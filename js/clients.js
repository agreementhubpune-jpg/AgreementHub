// ==========================================
// AGREEMENT HUB - CLIENTS
// ==========================================

import {
    db,
    auth
} from "./firebase.js";


import {
    collection,
    getDocs,
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";


const form =
    document.getElementById(
        "clientForm"
    );


const message =
    document.getElementById(
        "clientMsg"
    );


const tbody =
    document.querySelector(
        "#clientTable tbody"
    );


const searchInput =
    document.getElementById(
        "clientSearch"
    );


let clients = [];


// ==========================================
// LOGIN
// ==========================================

onAuthStateChanged(
    auth,
    async user => {

        if (!user) {

            window.location.href =
                "login.html";

            return;

        }


        await loadClients();

    }
);


// ==========================================
// NORMALIZE MOBILE
// ==========================================

function normalizeMobile(
    mobile
) {

    return String(
        mobile || ""
    ).replace(
        /\D/g,
        ""
    );

}


// ==========================================
// MANUAL ADD / UPDATE CLIENT
// ==========================================

form.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const clientName =
            document.getElementById(
                "clientName"
            ).value.trim();


        const email =
            document.getElementById(
                "clientEmail"
            ).value.trim();


        const mobile =
            normalizeMobile(
                document.getElementById(
                    "clientMobile"
                ).value
            );


        const propertyAddress =
            document.getElementById(
                "propertyAddress"
            ).value.trim();


        const status =
            document.getElementById(
                "clientStatus"
            ).value;


        if (
            !clientName ||
            !mobile
        ) {

            message.style.color =
                "red";


            message.textContent =
                "Client Name and Mobile Number are required.";


            return;

        }


        try {

            const clientRef =
                doc(
                    db,
                    "clients",
                    mobile
                );


            const existingClient =
                await getDoc(
                    clientRef
                );


            const clientData = {

                clientName:
                    clientName,

                mobile:
                    mobile,

                email:
                    email,

                propertyAddress:
                    propertyAddress,

                status:
                    status,

                updatedAt:
                    new Date()
                        .toISOString()

            };


            if (
                !existingClient.exists()
            ) {

                clientData.createdAt =
                    new Date()
                        .toISOString();

            }


            await setDoc(

                clientRef,

                clientData,

                {
                    merge: true
                }

            );


            message.style.color =
                "green";


            message.textContent =
                existingClient.exists()
                    ?
                    "Client Updated Successfully!"
                    :
                    "Client Saved Successfully!";


            form.reset();


            await loadClients();


        } catch (error) {

            console.error(
                "CLIENT SAVE ERROR:",
                error
            );


            message.style.color =
                "red";


            message.textContent =
                "Client Save Failed: " +
                error.message;

        }

    }
);


// ==========================================
// LOAD CLIENTS
// ==========================================

async function loadClients() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "clients"
                )
            );


        clients =
            snapshot.docs.map(
                document => {

                    return {

                        id:
                            document.id,

                        ...document.data()

                    };

                }
            );


        clients.sort(
            (
                a,
                b
            ) => {

                const nameA =
                    String(
                        a.clientName ||
                        ""
                    ).toLowerCase();


                const nameB =
                    String(
                        b.clientName ||
                        ""
                    ).toLowerCase();


                return nameA
                    .localeCompare(
                        nameB
                    );

            }
        );


        renderClients();


    } catch (error) {

        console.error(
            "CLIENT LOAD ERROR:",
            error
        );

    }

}


// ==========================================
// RENDER CLIENT TABLE
// ==========================================

function renderClients() {

    const searchValue =
        searchInput
            .value
            .trim()
            .toLowerCase();


    tbody.innerHTML = "";


    clients.forEach(
        client => {


            const project =
                client.projectName ||
                client.propertyAddress ||
                "-";


            const searchableText =
                [

                    client.clientName,

                    client.email,

                    client.mobile,

                    client.projectName,

                    client.propertyAddress,

                    client.lastAgreementNo,

                    client.status

                ]
                    .join(" ")
                    .toLowerCase();


            if (
                searchValue &&
                !searchableText
                    .includes(
                        searchValue
                    )
            ) {

                return;

            }


            const row =
                document.createElement(
                    "tr"
                );


            /*
                Current clients.html has:

                Name
                Email
                Mobile
                Property
                Status

                त्यामुळे lastAgreementNo data
                Firestore मध्ये save राहतो.
                पुढे HTML table मध्ये वेगळा
                column add करू शकतो.
            */

            row.innerHTML = `

                <td>
                    ${
                        escapeHtml(
                            client.clientName ||
                            "-"
                        )
                    }
                </td>

                <td>
                    ${
                        escapeHtml(
                            client.email ||
                            "-"
                        )
                    }
                </td>

                <td>
                    ${
                        escapeHtml(
                            client.mobile ||
                            "-"
                        )
                    }
                </td>

                <td
                    title="${
                        escapeHtml(
                            client.lastAgreementNo ||
                            ""
                        )
                    }"
                >
                    ${
                        escapeHtml(
                            project
                        )
                    }
                </td>

                <td>
                    ${
                        escapeHtml(
                            client.status ||
                            "Active"
                        )
                    }
                </td>
<td>
    <button
        type="button"
        class="profile-btn"
        data-mobile="${escapeHtml(client.mobile || "")}"
    >
        View Client
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
// CLIENT PROFILE
// ==========================================

tbody.addEventListener("click", async event => {

    const button =
        event.target.closest(".profile-btn");

    if (!button) {
        return;
    }

    const mobile =
        normalizeMobile(
            button.dataset.mobile
        );

    const client =
        clients.find(
            item =>
                normalizeMobile(item.mobile) === mobile
        );

    if (!client) {
        return;
    }

    const profilePanel =
        document.getElementById("profilePanel");

    document.getElementById("profileTitle").textContent =
        (client.clientName || "Client") + " - Profile";

    document.getElementById("profileName").textContent =
        client.clientName || "-";

    document.getElementById("profileMobile").textContent =
        client.mobile || "-";

    document.getElementById("profileEmail").textContent =
        client.email || "-";

    document.getElementById("profileProperty").textContent =
        client.projectName ||
        client.propertyAddress ||
        "-";

    document.getElementById("profileStatus").textContent =
        client.status || "Active";


    try {

        const snapshot =
            await getDocs(
                collection(db, "agreements")
            );

        const agreements =
            snapshot.docs
                .map(document => ({
                    id: document.id,
                    ...document.data()
                }))
                .filter(agreement =>
                    normalizeMobile(
                        agreement.mobile ||
                        agreement.tenantMobile
                    ) === mobile
                );


        let activeCount = 0;
        let expiredCount = 0;
        let totalPending = 0;
        let latestEndDate = "";


        agreements.forEach(agreement => {

            const endDate =
                agreement.endDate || "";

            if (
                endDate &&
                new Date(endDate) < new Date()
            ) {

                expiredCount++;

            } else {

                activeCount++;

            }


            if (
                endDate &&
                (
                    !latestEndDate ||
                    endDate > latestEndDate
                )
            ) {

                latestEndDate =
                    endDate;

            }


            const businessDue =
                Number(
                    agreement.serviceCharge || 0
                ) +
                Number(
                    agreement.brokerage || 0
                );

            const received =
                Math.min(
                    Number(
                        agreement.amountReceived || 0
                    ),
                    businessDue
                );

            totalPending +=
                Math.max(
                    businessDue - received,
                    0
                );

        });


        document.getElementById(
            "profileTotalAgreements"
        ).textContent =
            agreements.length;

        document.getElementById(
            "profileActiveAgreements"
        ).textContent =
            activeCount;

        document.getElementById(
            "profileExpiredAgreements"
        ).textContent =
            expiredCount;

        document.getElementById(
            "profileEndDate"
        ).textContent =
            latestEndDate || "-";

        document.getElementById(
            "profilePending"
        ).textContent =
            totalPending.toLocaleString("en-IN");


        profilePanel.style.display =
            "block";

        profilePanel.scrollIntoView({
            behavior: "smooth"
        });


    } catch (error) {

        console.error(
            "CLIENT PROFILE ERROR:",
            error
        );

        alert(
            "Unable to load client profile."
        );

    }

});

// ==========================================
// CLIENT AGREEMENT HISTORY
// ==========================================

tbody.addEventListener("click", async event => {

    const button =
        event.target.closest(".history-btn, .profile-btn");

    if (!button) {
        return;
    }

    const mobile =
        normalizeMobile(
            button.dataset.mobile
        );

    const client =
        clients.find(
            item =>
                normalizeMobile(item.mobile) === mobile
        );

    const historyPanel =
        document.getElementById("historyPanel");

    const historyTitle =
        document.getElementById("historyTitle");

    const historyBody =
        document.querySelector(
            "#historyTable tbody"
        );

    historyPanel.style.display = "block";

    historyTitle.textContent =
        (client?.clientName || "Client") +
        " - Agreement History";

    historyBody.innerHTML =
        '<tr><td colspan="6">Loading...</td></tr>';

    try {

        const snapshot =
            await getDocs(
                collection(db, "agreements")
            );

        const agreements =
            snapshot.docs
                .map(document => ({
                    id: document.id,
                    ...document.data()
                }))
                .filter(agreement =>
    normalizeMobile(
        agreement.mobile ||
        agreement.tenantMobile
    ) === mobile
);

        agreements.sort((a, b) =>
            String(b.startDate || "")
                .localeCompare(
                    String(a.startDate || "")
                )
        );

        historyBody.innerHTML = "";

        if (agreements.length === 0) {

            historyBody.innerHTML =
                '<tr><td colspan="6">No agreement history found.</td></tr>';

            historyPanel.scrollIntoView({
                behavior: "smooth"
            });

            return;
        }

        agreements.forEach(agreement => {

            const businessDue =
                Number(
                    agreement.serviceCharge || 0
                ) +
                Number(
                    agreement.brokerage || 0
                );

            const received =
                Math.min(
                    Number(
                        agreement.amountReceived || 0
                    ),
                    businessDue
                );

            const pending =
                Math.max(
                    businessDue - received,
                    0
                );

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>${escapeHtml(
                    agreement.agreementNumber || "-"
                )}</td>

                <td>${escapeHtml(
                    agreement.projectName || "-"
                )}</td>

                <td>${escapeHtml(
                    agreement.startDate || "-"
                )}</td>

                <td>${escapeHtml(
                    agreement.endDate || "-"
                )}</td>

                <td>${escapeHtml(
    (
        agreement.endDate &&
        new Date(agreement.endDate) < new Date()
    )
        ? "Expired"
        : "Active"
)}</td>

                <td>₹${pending.toLocaleString("en-IN")}</td>
            `;

            historyBody.appendChild(row);

        });

        historyPanel.scrollIntoView({
            behavior: "smooth"
        });

    } catch (error) {

        console.error(
            "CLIENT HISTORY ERROR:",
            error
        );

        historyBody.innerHTML =
            '<tr><td colspan="6">Unable to load agreement history.</td></tr>';
    }

});

// ==========================================
// SEARCH
// ==========================================

searchInput.addEventListener(
    "input",
    renderClients
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