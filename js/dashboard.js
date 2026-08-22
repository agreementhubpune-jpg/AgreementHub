import { db, auth } from "./firebase.js";

import {
    collection,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

let agreements = [];

const searchInput = document.getElementById("searchInput");
const tbody = document.querySelector("#agreementTable tbody");


// ===============================
// Authentication Protection
// ===============================

onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    loadAgreements();

});


// ===============================
// Load Agreements
// ===============================

async function loadAgreements() {

    try {

        agreements = [];
        tbody.innerHTML = "";

        let activeCount = 0;
        let expiringCount = 0;
        let totalServiceCharges = 0;

        const snapshot = await getDocs(
            collection(db, "agreements")
        );

        snapshot.forEach((docSnap) => {

            agreements.push({
                id: docSnap.id,
                ...docSnap.data()
            });

        });


        // ===============================
        // Display Agreements
        // ===============================

        agreements.forEach((agreement, index) => {

            totalServiceCharges += Number(
    agreement.serviceCharge || 0
);


            // ===============================
            // End Date Calculation
            // ===============================

            let diffDays = -1;

            if (agreement.endDate) {

                const today = new Date();

                today.setHours(0, 0, 0, 0);

                const endDate = new Date(
                    agreement.endDate
                );

                endDate.setHours(0, 0, 0, 0);

                diffDays = Math.ceil(
                    (endDate - today) /
                    (1000 * 60 * 60 * 24)
                );

            }


            // ===============================
            // Status
            // ===============================

            let status = "";
            let statusClass = "";

            if (!agreement.endDate) {

                status = "No End Date";
                statusClass = "expired";

            }
            else if (diffDays < 0) {

                status = "Expired";
                statusClass = "expired";

            }
            else if (diffDays <= 30) {

                status = "Expiring";
                statusClass = "expiring";

                expiringCount++;

                activeCount++;

            }
            else {

                status = "Active";
                statusClass = "active";

                activeCount++;

            }


            // ===============================
            // Table Row
            // ===============================

            const row = document.createElement("tr");

            row.innerHTML = `

                <td>${agreement.agreementNumber || "-"}</td>

                <td>${agreement.owner || "-"}</td>

                <td>${agreement.tenant || "-"}</td>

                <td>${agreement.mobile || "-"}</td>

                <td>${agreement.projectName || "-"}</td>

                <td>${agreement.endDate || "-"}</td>

                <td>
                    <span class="${statusClass}">
                        ${status}
                    </span>
                </td>

                <td>
                    ₹${Number(
                        agreement.rent || 0
                    ).toLocaleString("en-IN")}
                </td>

                <td>

                    <button
                        onclick="viewAgreement(${index})">
                        View
                    </button>

                    <button
                        onclick="editAgreement(${index})">
                        Edit
                    </button>

                    <button
                        onclick="deleteAgreement(${index})">
                        Delete
                    </button>

                </td>

            `;

            tbody.appendChild(row);

        });


        // ===============================
        // Dashboard Cards
        // ===============================

        document.getElementById(
            "totalAgreements"
        ).textContent = agreements.length;


        document.getElementById(
            "activeAgreements"
        ).textContent = activeCount;


        document.getElementById(
            "expiringAgreements"
        ).textContent = expiringCount;


        document.getElementById(
    "totalRevenue"
).textContent =
    "₹" +
    totalServiceCharges.toLocaleString("en-IN");


        console.log(
            "Agreements loaded:",
            agreements
        );

    }

    catch (error) {

        console.error(
            "Firestore Load Error:",
            error
        );

        alert(
            "Agreements load failed. Please check Console."
        );

    }

}


// ===============================
// View Agreement
// ===============================

window.viewAgreement = function(index) {

    const agreement = agreements[index];

    if (!agreement || !agreement.id) {

        alert("Agreement ID not found");

        return;

    }

    localStorage.setItem(
        "selectedAgreementId",
        agreement.id
    );

    window.location.href =
        "agreement-preview.html";

};


// ===============================
// Edit Agreement
// ===============================

window.editAgreement = function(index) {

    const agreement = agreements[index];

    if (!agreement || !agreement.id) {

        alert("Agreement ID not found");

        return;

    }

    localStorage.setItem(
        "editAgreementId",
        agreement.id
    );

    window.location.href =
        "client-form.html";

};


// ===============================
// Delete Agreement
// ===============================

window.deleteAgreement = async function(index) {

    const agreement = agreements[index];

    if (!agreement || !agreement.id) {

        alert("Agreement ID not found");

        return;

    }


    if (
        !confirm(
            "Are you sure you want to delete this agreement?"
        )
    ) {

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

        alert(
            "Agreement Deleted Successfully"
        );

        await loadAgreements();

    }

    catch (error) {

        console.error(
            "Delete Error:",
            error
        );

        alert(
            "Delete Failed: " +
            error.message
        );

    }

};


// ===============================
// Search
// ===============================

if (searchInput) {

    searchInput.addEventListener(
        "keyup",
        function () {

            const value =
                this.value.toLowerCase();

            const rows =
                document.querySelectorAll(
                    "#agreementTable tbody tr"
                );

            rows.forEach((row) => {

                const text =
                    row.innerText.toLowerCase();

                row.style.display =
                    text.includes(value)
                        ? ""
                        : "none";

            });

        }
    );

}


// ===============================
// Logout
// ===============================

window.logout = async function() {

    try {

        await auth.signOut();

        localStorage.removeItem(
            "loggedIn"
        );

        window.location.href =
            "login.html";

    }

    catch (error) {

        console.error(
            "Logout Error:",
            error
        );

    }

};


// ===============================
// New Agreement
// ===============================

window.newAgreement = function() {

    localStorage.removeItem(
        "editAgreementId"
    );

};