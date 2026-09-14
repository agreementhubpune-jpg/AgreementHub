import { db, auth } from "./firebase.js";

import {
    collection,
    getDocs,
    deleteDoc,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";


// ==========================================
// GLOBAL DATA
// ==========================================

let agreements = [];

let renewalAlertDays = 30;

const tbody =
    document.querySelector("#agreementTable tbody");

const searchInput =
    document.getElementById("searchInput");

const filterStatus =
    document.getElementById("filterStatus");


// ==========================================
// LOGIN PROTECTION
// ==========================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href =
            "login.html";

        return;
    }

    await loadRenewalSettings();

    await loadDashboard();

});


// ==========================================
// LOAD RENEWAL ALERT SETTINGS
// ==========================================

async function loadRenewalSettings() {

    try {

        const settingsRef =
            doc(
                db,
                "companySettings",
                "agreementDefaults"
            );

        const settingsSnap =
            await getDoc(settingsRef);

        if (!settingsSnap.exists()) {

            renewalAlertDays = 30;

            return;
        }

        const settings =
            settingsSnap.data();

        const savedDays =
            Number(
                settings.renewalAlertDays
            );

        if (
            !Number.isNaN(savedDays) &&
            savedDays > 0
        ) {

            renewalAlertDays =
                savedDays;

        } else {

            renewalAlertDays = 30;

        }

        console.log(
            "Renewal Alert Days:",
            renewalAlertDays
        );

    } catch (error) {

        console.error(
            "Renewal Settings Error:",
            error
        );

        renewalAlertDays = 30;

    }

}


// ==========================================
// LOAD DASHBOARD
// ==========================================

async function loadDashboard() {

    await Promise.all([
        loadAgreements(),
        loadClientCount()
    ]);

}


// ==========================================
// AGREEMENT STATUS
// ==========================================

function getAgreementStatus(agreement) {

    if (!agreement.endDate) {

        return {
            text: "No End Date",
            key: "expired",
            diffDays: -999999
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
            text: "Invalid Date",
            key: "expired",
            diffDays: -999999
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


    // Expired

    if (diffDays < 0) {

        return {
            text: "Expired",
            key: "expired",
            diffDays
        };

    }


    // Renewal Alert

    if (
        diffDays <=
        renewalAlertDays
    ) {

        return {
            text: "Expiring",
            key: "expiring",
            diffDays
        };

    }


    // Active

    return {
        text: "Active",
        key: "active",
        diffDays
    };

}


// ==========================================
// LOAD AGREEMENTS
// ==========================================

async function loadAgreements() {

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
                (document) => {

                    return {

                        id:
                            document.id,

                        ...document.data()

                    };

                }
            );


        let activeCount = 0;

        let expiringCount = 0;

        let expiredCount = 0;

        let totalServiceCharges = 0;

        let todayCount = 0;


        const renewalAlerts = [];


        const todayIso =
            new Date()
                .toISOString()
                .slice(
                    0,
                    10
                );


        agreements.forEach(
            (agreement) => {


                const status =
                    getAgreementStatus(
                        agreement
                    );


                // Active Count

                if (
                    status.key ===
                    "active"
                ) {

                    activeCount++;

                }


                // Expiring is still active

                if (
                    status.key ===
                    "expiring"
                ) {

                    activeCount++;

                    expiringCount++;


                    renewalAlerts.push({

                        agreement,

                        diffDays:
                            status.diffDays

                    });

                }


                // Expired

                if (
                    status.key ===
                    "expired"
                ) {

                    expiredCount++;

                }


                // Revenue
                // ONLY My Service Charge

                totalServiceCharges +=
                    Number(
                        agreement.serviceCharge ||
                        0
                    );


                // Today's Agreements

                const createdDate =
                    String(
                        agreement.createdAt ||
                        ""
                    ).slice(
                        0,
                        10
                    );


                if (
                    createdDate ===
                    todayIso
                ) {

                    todayCount++;

                }

            }
        );


        // ==================================
        // UPDATE DASHBOARD CARDS
        // ==================================

        document.getElementById(
            "totalAgreements"
        ).textContent =
            agreements.length;


        document.getElementById(
            "activeAgreements"
        ).textContent =
            activeCount;


        document.getElementById(
            "expiringAgreements"
        ).textContent =
            expiringCount;


        document.getElementById(
            "expiredAgreements"
        ).textContent =
            expiredCount;


        document.getElementById(
            "todayAgreements"
        ).textContent =
            todayCount;


        document.getElementById(
            "totalRevenue"
        ).textContent =
            "₹" +
            totalServiceCharges
                .toLocaleString(
                    "en-IN"
                );


        renderRenewalAlerts(
            renewalAlerts
        );


        renderAgreements();


    } catch (error) {

        console.error(
            "Agreement Load Error:",
            error
        );

    }

}


// ==========================================
// CLIENT COUNT
// ==========================================

async function loadClientCount() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "clients"
                )
            );


        document.getElementById(
            "totalClients"
        ).textContent =
            snapshot.size;


    } catch (error) {

        console.error(
            "Client Count Error:",
            error
        );


        document.getElementById(
            "totalClients"
        ).textContent =
            "0";

    }

}


// ==========================================
// RENEWAL ALERTS
// ==========================================

function renderRenewalAlerts(
    items
) {

    const alertBox =
        document.getElementById(
            "renewalAlerts"
        );


    if (!items.length) {

        alertBox.innerHTML = `

            <p>
                No Renewal Alerts
            </p>

            <small>
                Alert Period:
                ${renewalAlertDays} Days
            </small>

        `;

        return;
    }


    const sortedItems =
        items.sort(
            (a, b) =>
                a.diffDays -
                b.diffDays
        );


    alertBox.innerHTML =
        sortedItems
            .slice(
                0,
                10
            )
            .map(
                (
                    {
                        agreement,
                        diffDays
                    }
                ) => {

                    return `

                        <div
                            class="renewal-item"
                        >

                            <strong>
                                ${
                                    escapeHtml(
                                        agreement
                                            .agreementNumber ||
                                        "-"
                                    )
                                }
                            </strong>

                            <br>

                            <span>
                                Tenant:
                                ${
                                    escapeHtml(
                                        agreement
                                            .tenant ||
                                        "-"
                                    )
                                }
                            </span>

                            <br>

                            <span>
                                ${
                                    diffDays === 0
                                        ?
                                        "Expires Today"
                                        :
                                        diffDays +
                                        " Days Remaining"
                                }
                            </span>

                        </div>

                    `;

                }
            )
            .join("");

}


// ==========================================
// RENDER TABLE
// ==========================================

function renderAgreements() {

    const searchValue =
        searchInput
            .value
            .trim()
            .toLowerCase();


    const selectedStatus =
        filterStatus.value;


    tbody.innerHTML = "";


    agreements.forEach(
        (
            agreement,
            index
        ) => {


            const status =
                getAgreementStatus(
                    agreement
                );


            const searchableText =
                [

                    agreement
                        .agreementNumber,

                    agreement.owner,

                    agreement.tenant,

                    agreement.mobile,

                    agreement
                        .projectName

                ]
                    .join(" ")
                    .toLowerCase();


            // Search Filter

            if (
                searchValue &&
                !searchableText
                    .includes(
                        searchValue
                    )
            ) {

                return;

            }


            // Status Filter

            if (
                selectedStatus !==
                    "all" &&
                status.key !==
                    selectedStatus
            ) {

                return;

            }


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
                            agreement.owner ||
                            "-"
                        )
                    }
                </td>

                <td>
                    ${
                        escapeHtml(
                            agreement.tenant ||
                            "-"
                        )
                    }
                </td>

                <td>
                    ${
                        escapeHtml(
                            agreement.mobile ||
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

                <td>

                    <span
                        class="
                            status
                            ${status.key}
                        "
                    >

                        ${status.text}

                    </span>

                </td>

                <td>

                    ₹${
                        Number(
                            agreement.rent ||
                            0
                        )
                        .toLocaleString(
                            "en-IN"
                        )
                    }

                </td>

                <td>

                    <button
                        data-action="view"
                        data-index="${index}"
                    >
                        View
                    </button>

                    <button
                        data-action="edit"
                        data-index="${index}"
                    >
                        Edit
                    </button>

                    <button
                        data-action="delete"
                        data-index="${index}"
                    >
                        Delete
                    </button>

                </td>

            `;


            tbody.appendChild(
                row
            );

        }
    );

}


// ==========================================
// TABLE ACTIONS
// ==========================================

tbody.addEventListener(
    "click",
    async (event) => {


        const button =
            event.target.closest(
                "button[data-action]"
            );


        if (!button) {

            return;

        }


        const index =
            Number(
                button.dataset.index
            );


        const agreement =
            agreements[index];


        if (!agreement) {

            return;

        }


        // View

        if (
            button.dataset.action ===
            "view"
        ) {

            localStorage.setItem(
                "selectedAgreementId",
                agreement.id
            );


            window.location.href =
                "agreement-preview.html";

        }


        // Edit

        if (
            button.dataset.action ===
            "edit"
        ) {

            localStorage.setItem(
                "editAgreementId",
                agreement.id
            );


            window.location.href =
                "client-form.html";

        }


        // Delete

        if (
            button.dataset.action ===
            "delete"
        ) {

            const confirmed =
                confirm(
                    "Are you sure you want to delete this agreement?"
                );


            if (!confirmed) {

                return;

            }


            try {

                await deleteDoc(
                    doc(
                        db,
                        "agreements",
                        agreement.id
                    )
                );


                await loadAgreements();


            } catch (error) {

                console.error(
                    error
                );


                alert(
                    "Delete Failed: " +
                    error.message
                );

            }

        }

    }
);


// ==========================================
// SEARCH
// ==========================================

searchInput.addEventListener(
    "input",
    renderAgreements
);


// ==========================================
// STATUS FILTER
// ==========================================

filterStatus.addEventListener(
    "change",
    renderAgreements
);


// ==========================================
// LOGOUT
// ==========================================

document.getElementById(
    "logoutBtn"
).addEventListener(
    "click",
    async () => {


        await signOut(auth);


        localStorage.removeItem(
            "loggedIn"
        );


        window.location.href =
            "login.html";

    }
);


// ==========================================
// SAFE HTML
// ==========================================

function escapeHtml(value) {

    return String(
        value ?? ""
    )

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}