import {
    db,
    auth
} from "./firebase.js";


import {
    collection,
    getDocs,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";


// ==========================================
// VARIABLES
// ==========================================

let agreements = [];

let renewalAlertDays = 30;


const tbody =
    document.querySelector(
        "#renewalTable tbody"
    );


const searchInput =
    document.getElementById(
        "renewalSearch"
    );


const filterSelect =
    document.getElementById(
        "renewalFilter"
    );


const emptyMessage =
    document.getElementById(
        "emptyMessage"
    );


// ==========================================
// AUTH
// ==========================================

onAuthStateChanged(
    auth,
    async user => {

        if (!user) {

            window.location.href =
                "login.html";

            return;

        }


        await loadSettings();

        await loadRenewals();

    }
);


// ==========================================
// SETTINGS
// ==========================================

async function loadSettings() {

    try {

        const settingsRef =
            doc(
                db,
                "companySettings",
                "main"
            );


        const settingsSnap =
            await getDoc(
                settingsRef
            );


        if (
            settingsSnap.exists()
        ) {

            const settings =
                settingsSnap.data();


            const savedDays =
                Number(
                    settings
                        .renewalAlertDays
                );


            if (
                !Number.isNaN(savedDays) &&
                savedDays > 0
            ) {

                renewalAlertDays =
                    savedDays;

            }

        }


        document
            .getElementById(
                "alertDaysText"
            )
            .textContent =
                "Next " +
                renewalAlertDays +
                " Days";


    } catch (error) {

        console.error(
            "RENEWAL SETTINGS ERROR:",
            error
        );

        renewalAlertDays = 30;

    }

}


// ==========================================
// LOAD AGREEMENTS
// ==========================================

async function loadRenewals() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "agreements"
                )
            );


        agreements =
            snapshot.docs.map(
                agreementDoc => ({
                    id:
                        agreementDoc.id,

                    ...agreementDoc.data()
                })
            );

        updateSummary();

        renderRenewals();


    } catch (error) {

        console.error(
            "RENEWAL LOAD ERROR:",
            error
        );

        alert(
            "Unable to load renewals."
        );

    }

}


// ==========================================
// STATUS LOGIC
// ==========================================

function getRenewalStatus(
    agreement
) {

    if (
        !agreement.endDate
    ) {

        return {
            text:
                "No End Date",

            key:
                "invalid",

            diffDays:
                null
        };

    }


    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    const endDate =
        new Date(
            agreement.endDate +
            "T00:00:00"
        );


    if (
        Number.isNaN(
            endDate.getTime()
        )
    ) {

        return {
            text:
                "Invalid Date",

            key:
                "invalid",

            diffDays:
                null
        };

    }


    const diffTime =
        endDate - today;


    const diffDays =
        Math.ceil(
            diffTime /
            (
                1000 *
                60 *
                60 *
                24
            )
        );


    if (
        diffDays < 0
    ) {

        return {
            text:
                "Expired",

            key:
                "expired",

            diffDays
        };

    }


    if (
        diffDays <= 7
    ) {

        return {
            text:
                "Urgent",

            key:
                "7",

            diffDays
        };

    }


    if (
        diffDays <= 15
    ) {

        return {
            text:
                "Expiring Soon",

            key:
                "15",

            diffDays
        };

    }


    if (
        diffDays <=
        renewalAlertDays
    ) {

        return {
            text:
                "Renewal Alert",

            key:
                "alert",

            diffDays
        };

    }


    return {
        text:
            "Active",

        key:
            "active",

        diffDays
    };

}


// ==========================================
// SUMMARY
// ==========================================

function updateSummary() {

    let alertCount = 0;
    let fifteenCount = 0;
    let sevenCount = 0;
    let expiredCount = 0;


    agreements.forEach(
        agreement => {

        // Do not count already renewed agreements
        if (
            agreement.renewalStatus ===
            "Renewed"
        ) {
            return;
        }

            const status =
                getRenewalStatus(
                    agreement
                );


            if (
                status.diffDays === null
            ) {

                return;

            }


            if (
                status.diffDays < 0
            ) {

                expiredCount++;

                return;

            }


            if (
                status.diffDays <=
                renewalAlertDays
            ) {

                alertCount++;

            }


            if (
                status.diffDays <= 15
            ) {

                fifteenCount++;

            }


            if (
                status.diffDays <= 7
            ) {

                sevenCount++;

            }

        }
    );


    document
        .getElementById(
            "alertCount"
        )
        .textContent =
            alertCount;


    document
        .getElementById(
            "fifteenCount"
        )
        .textContent =
            fifteenCount;


    document
        .getElementById(
            "sevenCount"
        )
        .textContent =
            sevenCount;


    document
        .getElementById(
            "expiredCount"
        )
        .textContent =
            expiredCount;

}


// ==========================================
// RENDER
// ==========================================

function renderRenewals() {

    tbody.innerHTML = "";


    const searchValue =
        searchInput
            .value
            .trim()
            .toLowerCase();


    const selectedFilter =
        filterSelect.value;


    const filtered =
        agreements
            .map(
                agreement => {

                    return {
                        agreement,
                        status:
                            getRenewalStatus(
                                agreement
                            )
                    };

                }
            )
            .filter(
                item => {

                    const {
                        agreement,
                        status
                    } = item;


                    if (
                        status.diffDays === null
                    ) {

                        return false;

                    }

                    // Already renewed agreements should not
// appear in renewal pending list
if (
    agreement.renewalStatus ===
    "Renewed"
) {
    return false;
}

                    const isRenewalRecord =
                        (
                            status.diffDays < 0 ||
                            status.diffDays <=
                                renewalAlertDays
                        );


                    if (
                        !isRenewalRecord
                    ) {

                        return false;

                    }


                    const searchable =
                        [
                            agreement
                                .agreementNumber,

                            agreement
                                .tenant,

                            agreement
                                .mobile,

                            agreement
                                .projectName,

                            agreement
                                .flatNumber
                        ]
                            .join(" ")
                            .toLowerCase();


                    if (
                        searchValue &&
                        !searchable.includes(
                            searchValue
                        )
                    ) {

                        return false;

                    }


                    if (
                        selectedFilter ===
                        "expired"
                    ) {

                        return (
                            status.diffDays < 0
                        );

                    }


                    if (
                        selectedFilter ===
                        "7"
                    ) {

                        return (
                            status.diffDays >= 0 &&
                            status.diffDays <= 7
                        );

                    }


                    if (
                        selectedFilter ===
                        "15"
                    ) {

                        return (
                            status.diffDays >= 0 &&
                            status.diffDays <= 15
                        );

                    }


                    if (
                        selectedFilter ===
                        "alert"
                    ) {

                        return (
                            status.diffDays >= 0 &&
                            status.diffDays <=
                                renewalAlertDays
                        );

                    }


                    return true;

                }
            )
            .sort(
                (a, b) => {

                    return (
                        a.status.diffDays -
                        b.status.diffDays
                    );

                }
            );


    emptyMessage.style.display =
        filtered.length
            ? "none"
            : "block";


    filtered.forEach(
        item => {

            const agreement =
                item.agreement;


            const status =
                item.status;


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${
                        escapeHtml(
                            agreement
                                .agreementNumber ||
                            "-"
                        )
                    }
                </td>

                <td>
                    ${
                        escapeHtml(
                            agreement
                                .tenant ||
                            "-"
                        )
                    }
                </td>

                <td>
                    ${
                        escapeHtml(
                            agreement
                                .mobile ||
                            "-"
                        )
                    }
                </td>

                <td>
                    ${
                        escapeHtml(
                            agreement
                                .projectName ||
                            "-"
                        )
                    }
                </td>

                <td>
                    ${
                        escapeHtml(
                            agreement
                                .endDate ||
                            "-"
                        )
                    }
                </td>

                <td class="${
                    getDaysClass(
                        status.diffDays
                    )
                }">
                    ${
                        formatDays(
                            status.diffDays
                        )
                    }
                </td>

                <td>
                    <span
                        class="status ${
                            getStatusClass(
                                status
                            )
                        }"
                    >
                        ${
                            escapeHtml(
                                status.text
                            )
                        }
                    </span>
                </td>

                <td>

                    <div class="action-group">

                        <button
                            type="button"
                            class="action-btn whatsapp-btn"
                            data-action="whatsapp"
                            data-id="${
                                escapeHtml(
                                    agreement.id
                                )
                            }"
                        >
                            WhatsApp
                        </button>

                        <button
    type="button"
    class="action-btn view-btn"
    data-action="renew"
    data-id="${escapeHtml(
        agreement.id
    )}"
>
    Renew Agreement
</button>

                    </div>

                </td>
            `;


            tbody.appendChild(
                row
            );

        }
    );

}


// ==========================================
// DAYS FORMAT
// ==========================================

function formatDays(
    diffDays
) {

    if (
        diffDays < 0
    ) {

        return (
            Math.abs(diffDays) +
            " Days Expired"
        );

    }


    if (
        diffDays === 0
    ) {

        return "Expires Today";

    }


    return (
        diffDays +
        " Days Left"
    );

}


function getDaysClass(
    diffDays
) {

    if (
        diffDays < 0
    ) {

        return "days-expired";

    }


    if (
        diffDays <= 7
    ) {

        return "days-urgent";

    }


    return "days-normal";

}


// ==========================================
// STATUS CSS
// ==========================================

function getStatusClass(
    status
) {

    if (
        status.diffDays < 0
    ) {

        return "status-expired";

    }


    if (
        status.diffDays <= 7
    ) {

        return "status-urgent";

    }


    if (
        status.diffDays <= 15
    ) {

        return "status-warning";

    }


    return "status-renewal";

}


// ==========================================
// ACTIONS
// ==========================================

tbody.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-action]"
            );


        if (!button) {
            return;
        }


        const agreement =
            agreements.find(
                item =>
                    item.id ===
                    button.dataset.id
            );


        if (!agreement) {
            return;
        }


        const action =
            button.dataset.action;


        if (
            action ===
            "whatsapp"
        ) {

            openWhatsApp(
                agreement
            );

        }


        if (
    action ===
    "renew"
) {

    localStorage.removeItem(
        "editAgreementId"
    );

    localStorage.setItem(
        "renewAgreementId",
        agreement.id
    );

    window.location.href =
        "client-form.html";

}

    }
);


// ==========================================
// WHATSAPP
// ==========================================

function openWhatsApp(
    agreement
) {

    const mobile =
        normalizeMobile(
            agreement.mobile
        );


    if (!mobile) {

        alert(
            "Client mobile number not available."
        );

        return;

    }


    const status =
        getRenewalStatus(
            agreement
        );


    let renewalText = "";


    if (
        status.diffDays < 0
    ) {

        renewalText =
            "has expired";

    } else {

        renewalText =
            "will expire on " +
            (
                agreement.endDate ||
                ""
            );

    }


    const message =
        "Hello " +
        (
            agreement.tenant ||
            ""
        ) +
        ", your rent agreement " +
        (
            agreement.agreementNumber ||
            ""
        ) +
        " " +
        renewalText +
        ". Please contact Agreement Hub for renewal service. Thank you.";


    const url =
        "https://wa.me/91" +
        mobile +
        "?text=" +
        encodeURIComponent(
            message
        );


    window.open(
        url,
        "_blank"
    );

}


// ==========================================
// MOBILE NORMALIZATION
// ==========================================

function normalizeMobile(
    value
) {

    const digits =
        String(
            value || ""
        )
            .replace(
                /\D/g,
                ""
            );


    if (
        digits.length > 10
    ) {

        return digits.slice(
            -10
        );

    }


    return digits;

}


// ==========================================
// FILTER EVENTS
// ==========================================

searchInput.addEventListener(
    "input",
    renderRenewals
);


filterSelect.addEventListener(
    "change",
    renderRenewals
);


// ==========================================
// SAFE HTML
// ==========================================

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}