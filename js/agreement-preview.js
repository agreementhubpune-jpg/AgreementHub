import { db } from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


// ===============================
// Get Selected Agreement
// ===============================

const agreementId =
    localStorage.getItem("selectedAgreementId");


// ===============================
// Load Agreement
// ===============================

async function loadAgreement() {

    if (!agreementId) {

        alert("Agreement not selected.");

        window.location.href = "dashboard.html";

        return;
    }

    try {

        const agreementRef =
            doc(db, "agreements", agreementId);

        const agreementSnap =
            await getDoc(agreementRef);

        if (!agreementSnap.exists()) {

            alert("Agreement not found.");

            window.location.href = "dashboard.html";

            return;
        }

        const agreement =
            agreementSnap.data();


        // ===============================
        // Agreement Details
        // ===============================

        setValue(
            "agreementNumber",
            agreement.agreementNumber
        );


        // ===============================
        // Owner Details
        // ===============================

        setValue(
            "ownerName",
            agreement.owner
        );

        setValue(
            "ownerMobile",
            agreement.ownerMobile
        );

        setValue(
            "ownerEmail",
            agreement.ownerEmail
        );

        setValue(
            "ownerAadhaar",
            agreement.ownerAadhaar
        );

        setValue(
            "ownerPan",
            agreement.ownerPan
        );


        // ===============================
        // Tenant Details
        // ===============================

        setValue(
            "tenantName",
            agreement.tenant
        );

        setValue(
            "tenantMobile",
            agreement.mobile
        );

        setValue(
            "tenantEmail",
            agreement.tenantEmail
        );

        setValue(
            "tenantAadhaar",
            agreement.tenantAadhaar
        );

        setValue(
            "tenantPan",
            agreement.tenantPan
        );


        // ===============================
        // Property Details
        // ===============================

        setValue(
            "projectName",
            agreement.projectName
        );

        setValue(
            "flatNumber",
            agreement.flatNumber
        );

        setValue(
            "buildingName",
            agreement.buildingName
        );

        setValue(
            "wing",
            agreement.wing
        );

        setValue(
            "floor",
            agreement.floor
        );

        setValue(
            "area",
            agreement.area
        );

        setValue(
            "surveyNumber",
            agreement.surveyNumber
        );

        setValue(
            "ctsNumber",
            agreement.ctsNumber
        );

        setValue(
            "village",
            agreement.village
        );

        setValue(
            "taluka",
            agreement.taluka
        );

        setValue(
            "district",
            agreement.district
        );

        setValue(
            "pinCode",
            agreement.pinCode
        );

        setValue(
            "propertyAddress",
            agreement.propertyAddress
        );


        // ===============================
        // Agreement Details
        // ===============================

        setValue(
            "rent",
            agreement.rent
        );

        setValue(
            "deposit",
            agreement.deposit
        );

        setValue(
            "maintenance",
            agreement.maintenance
        );

        setValue(
            "lockIn",
            agreement.lockIn
        );

        setValue(
            "noticePeriod",
            agreement.noticePeriod
        );

        setValue(
            "startDate",
            agreement.startDate
        );

        setValue(
            "endDate",
            agreement.endDate
        );

        setValue(
            "duration",
            agreement.duration
        );


        // ===============================
        // Witness Details
        // ===============================

        setValue(
            "witness1Name",
            agreement.witness1Name
        );

        setValue(
            "witness1Mobile",
            agreement.witness1Mobile
        );

        setValue(
            "witness2Name",
            agreement.witness2Name
        );

        setValue(
            "witness2Mobile",
            agreement.witness2Mobile
        );


        // ===============================
        // Registration Details
        // ===============================

        setValue(
            "stampDuty",
            agreement.stampDuty
        );

        setValue(
            "registrationFee",
            agreement.registrationFee
        );

        setValue(
            "agreementCharges",
            agreement.agreementCharges
        );

        setValue(
            "brokerage",
            agreement.brokerage
        );


        console.log(
            "Agreement Loaded Successfully",
            agreement
        );


    } catch (error) {

        console.error(
            "Preview Error:",
            error
        );

        alert(
            "Unable to load agreement."
        );
    }
}


// ===============================
// Set Value Helper
// ===============================

function setValue(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent =
            value || "-";
    }
}


// ===============================
// Back To Dashboard
// ===============================

function goToDashboard() {

    window.location.href =
        "dashboard.html";
}


// ===============================
// Make Function Available
// ===============================

window.goToDashboard =
    goToDashboard;


// ===============================
// Start
// ===============================

loadAgreement();