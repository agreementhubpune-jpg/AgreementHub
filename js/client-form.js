// ===============================
// Firebase Imports
// ===============================

import { db, auth } from "./firebase.js";

import {
    collection,
    addDoc,
    doc,
    getDoc,
    updateDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


// ===============================
// Form Elements
// ===============================

const form = document.getElementById("agreementForm");

const startDate = document.getElementById("startDate");
const duration = document.getElementById("duration");
const endDate = document.getElementById("endDate");


// ===============================
// Calculate End Date
// ===============================

function calculateEndDate() {

    if (!startDate.value || !duration.value) {
        endDate.value = "";
        return;
    }

    const start = new Date(startDate.value + "T00:00:00");
    const months = parseInt(duration.value, 10);

    if (isNaN(start.getTime()) || isNaN(months)) {
        endDate.value = "";
        return;
    }

    start.setMonth(start.getMonth() + months);
    start.setDate(start.getDate() - 1);

    const yyyy = start.getFullYear();
    const mm = String(start.getMonth() + 1).padStart(2, "0");
    const dd = String(start.getDate()).padStart(2, "0");

    endDate.value = `${yyyy}-${mm}-${dd}`;
}

startDate.addEventListener("change", calculateEndDate);
duration.addEventListener("change", calculateEndDate);


// ===============================
// Create Agreement Object
// ===============================

function getAgreementData() {

    function getValue(id) {

        const element =
            document.getElementById(id);

        return element
            ? element.value || ""
            : "";
    }

    return {

        // ===============================
        // AGREEMENT DETAILS
        // ===============================

        agreementNumber:
            getValue("agreementNumber"),

        startDate:
            getValue("startDate"),

        endDate:
            getValue("endDate"),

        duration:
            getValue("duration"),


        // ===============================
        // OWNER DETAILS
        // ===============================

        owner:
            getValue("ownerName"),

        ownerMobile:
            getValue("ownerMobile"),

        ownerEmail:
            getValue("ownerEmail"),

        ownerAadhaar:
            getValue("ownerAadhaar"),

        ownerPan:
            getValue("ownerPan"),

        ownerAge:
            getValue("ownerAge"),

        ownerOccupation:
            getValue("ownerOccupation"),

        ownerAddress:
            getValue("ownerAddress"),


        // ===============================
        // TENANT DETAILS
        // ===============================

        tenant:
            getValue("tenantName"),

        mobile:
            getValue("mobileNumber"),

        tenantEmail:
            getValue("tenantEmail"),

        tenantAadhaar:
            getValue("tenantAadhaar"),

        tenantPan:
            getValue("tenantPan"),

        tenantAge:
            getValue("tenantAge"),

        tenantOccupation:
            getValue("tenantOccupation"),

        tenantAddress:
            getValue("tenantAddress"),


        // ===============================
        // PROPERTY DETAILS
        // ===============================

        projectName:
            getValue("projectName"),

        flatNumber:
            getValue("flatNumber"),

        buildingName:
            getValue("buildingName"),

        wing:
            getValue("wing"),

        floor:
            getValue("floor"),

        area:
            getValue("area"),

        surveyNumber:
            getValue("surveyNumber"),

        ctsNumber:
            getValue("ctsNumber"),

        village:
            getValue("village"),

        taluka:
            getValue("taluka"),

        district:
            getValue("district"),

        pinCode:
            getValue("pinCode"),

        propertyAddress:
            getValue("propertyAddress"),


        // ===============================
        // FINANCIAL DETAILS
        // ===============================

        rent:
            getValue("rent"),

        deposit:
            getValue("deposit"),

        maintenance:
            getValue("maintenance"),

        lockIn:
            getValue("lockIn"),

        noticePeriod:
            getValue("noticePeriod"),


        // ===============================
        // WITNESS DETAILS
        // ===============================

        witness1Name:
            getValue("witness1Name"),

        witness1Mobile:
            getValue("witness1Mobile"),

        witness2Name:
            getValue("witness2Name"),

        witness2Mobile:
            getValue("witness2Mobile"),


        // ===============================
        // REGISTRATION DETAILS
        // ===============================

        stampDuty:
            getValue("stampDuty"),

        registrationFee:
            getValue("registrationFee"),

agreementCharges:
    getValue("agreementCharges"),

serviceCharge:
    getValue("serviceCharge"),

brokerage:
    getValue("brokerage"),


        // ===============================
        // SELECTED CLAUSES
        // ===============================

        selectedClauses:
            Array.from(
                document.querySelectorAll(
                    'input[name="clause"]:checked'
                )
            ).map(
                checkbox => checkbox.value
            )

    };
}

// ===============================
// Save / Update Agreement
// ===============================

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    console.log("CURRENT FIREBASE USER:", auth.currentUser);

    calculateEndDate();

    const agreement = getAgreementData();

    console.log("DATA TO SAVE:", agreement);

    const editAgreementId =
        localStorage.getItem("editAgreementId");

    try {

    // ===============================
    // EDIT EXISTING AGREEMENT
    // ===============================

    if (editAgreementId) {

        console.log(
            "UPDATING AGREEMENT:",
            editAgreementId
        );

        const agreementRef =
            doc(
                db,
                "agreements",
                editAgreementId
            );

        await updateDoc(
            agreementRef,
            agreement
        );

        console.log(
            "FIRESTORE UPDATE SUCCESS:",
            agreement
        );

        alert(
            "Agreement Updated Successfully!"
        );

        localStorage.removeItem(
            "editAgreementId"
        );

    }

    // ===============================
    // NEW AGREEMENT
    // ===============================

    else {

        console.log(
            "ADDING NEW AGREEMENT:",
            agreement
        );

        const docRef =
            await addDoc(
                collection(
                    db,
                    "agreements"
                ),
                agreement
            );

        console.log(
            "NEW AGREEMENT SAVED:",
            docRef.id
        );

        alert(
            "Agreement Saved Successfully!"
        );

    }

    // ===============================
    // GO TO DASHBOARD
    // ===============================

    window.location.href =
        "dashboard.html";

}

    catch (error) {

        console.error(
            "FIRESTORE ERROR:",
            error
        );

alert(
    "Agreement Save Failed: " + error.message
);
    }

});


// ===============================
// Load Agreement For Editing
// ===============================

async function loadEditAgreement() {

    const editAgreementId =
        localStorage.getItem("editAgreementId");

    if (!editAgreementId) {

        generateAgreementNumber();

        return;
    }

    try {

        const agreementRef =
            doc(db, "agreements", editAgreementId);

        const agreementSnap =
            await getDoc(agreementRef);

        if (!agreementSnap.exists()) {

            alert("Agreement not found.");

            localStorage.removeItem("editAgreementId");

            window.location.href = "dashboard.html";

            return;
        }

        const agreement =
            agreementSnap.data();

            console.log("EDIT AGREEMENT DATA:", agreement);
console.log("EDIT RENT:", agreement.rent);
console.log("EDIT DEPOSIT:", agreement.deposit);


        document.getElementById("agreementNumber").value =
            agreement.agreementNumber || "";

        document.getElementById("ownerName").value =
            agreement.owner || "";

        document.getElementById("ownerMobile").value =
            agreement.ownerMobile || "";

        document.getElementById("ownerEmail").value =
            agreement.ownerEmail || "";

        document.getElementById("ownerAadhaar").value =
            agreement.ownerAadhaar || "";

        document.getElementById("ownerPan").value =
            agreement.ownerPan || "";

            document.getElementById("ownerAge").value =
    agreement.ownerAge || "";

document.getElementById("ownerOccupation").value =
    agreement.ownerOccupation || "";

document.getElementById("ownerAddress").value =
    agreement.ownerAddress || "";

        document.getElementById("tenantName").value =
            agreement.tenant || "";

        document.getElementById("mobileNumber").value =
            agreement.mobile || "";

        document.getElementById("tenantEmail").value =
            agreement.tenantEmail || "";

        document.getElementById("tenantAadhaar").value =
            agreement.tenantAadhaar || "";

        document.getElementById("tenantPan").value =
            agreement.tenantPan || "";

            document.getElementById("tenantAge").value =
    agreement.tenantAge || "";

document.getElementById("tenantOccupation").value =
    agreement.tenantOccupation || "";

document.getElementById("tenantAddress").value =
    agreement.tenantAddress || "";

        document.getElementById("projectName").value =
            agreement.projectName || "";

        document.getElementById("flatNumber").value =
            agreement.flatNumber || "";

        document.getElementById("buildingName").value =
            agreement.buildingName || "";

        document.getElementById("floor").value =
            agreement.floor || "";

        document.getElementById("area").value =
            agreement.area || "";

        document.getElementById("surveyNumber").value =
            agreement.surveyNumber || "";

        document.getElementById("ctsNumber").value =
            agreement.ctsNumber || "";

        document.getElementById("village").value =
            agreement.village || "";

        document.getElementById("taluka").value =
            agreement.taluka || "";

        document.getElementById("district").value =
            agreement.district || "";

        document.getElementById("pinCode").value =
            agreement.pinCode || "";

        document.getElementById("propertyAddress").value =
            agreement.propertyAddress || "";


       // ===============================
// FINANCIAL DETAILS - EDIT
// ===============================

const rentField = document.getElementById("rent");
const depositField = document.getElementById("deposit");
const maintenanceField = document.getElementById("maintenance");
const lockInField = document.getElementById("lockIn");
const noticePeriodField = document.getElementById("noticePeriod");

if (rentField) {
    rentField.value =
        agreement.rent !== undefined &&
        agreement.rent !== null
            ? agreement.rent
            : "";
}

if (depositField) {
    depositField.value =
        agreement.deposit !== undefined &&
        agreement.deposit !== null
            ? agreement.deposit
            : "";
}

if (maintenanceField) {
    maintenanceField.value =
        agreement.maintenance !== undefined &&
        agreement.maintenance !== null
            ? agreement.maintenance
            : "";
}

if (lockInField) {
    lockInField.value =
        agreement.lockIn !== undefined &&
        agreement.lockIn !== null
            ? agreement.lockIn
            : "";
}

if (noticePeriodField) {
    noticePeriodField.value =
        agreement.noticePeriod !== undefined &&
        agreement.noticePeriod !== null
            ? agreement.noticePeriod
            : "";
}

        document.getElementById("startDate").value =
            agreement.startDate || "";

        document.getElementById("endDate").value =
            agreement.endDate || "";

        document.getElementById("duration").value =
            agreement.duration || "";


        document.getElementById("witness1Name").value =
            agreement.witness1Name || "";

        document.getElementById("witness1Mobile").value =
            agreement.witness1Mobile || "";

        document.getElementById("witness2Name").value =
            agreement.witness2Name || "";

        document.getElementById("witness2Mobile").value =
            agreement.witness2Mobile || "";


        document.getElementById("stampDuty").value =
            agreement.stampDuty || "";

        document.getElementById("registrationFee").value =
            agreement.registrationFee || "";

        document.getElementById("agreementCharges").value =
            agreement.agreementCharges || "";

            document.getElementById("serviceCharge").value =
    agreement.serviceCharge || "";

        document.getElementById("brokerage").value =
            agreement.brokerage || "";

            // Load Saved Clauses

const selectedClauses =
    agreement.selectedClauses || [];

document
    .querySelectorAll('input[name="clause"]')
    .forEach((checkbox) => {

        checkbox.checked =
            selectedClauses.includes(
                checkbox.value
            );

    });

    } catch (error) {

        console.error(
            "Error loading agreement:",
            error
        );
    }
}


// ===============================
// Generate Agreement Number
// ===============================

async function generateAgreementNumber() {

    try {

        const snapshot =
            await getDocs(
                collection(db, "agreements")
            );

        const nextNumber =
            snapshot.size + 1;

        const year =
            new Date().getFullYear();

        document.getElementById(
            "agreementNumber"
        ).value =
            "AG-" +
            year +
            "-" +
            String(nextNumber).padStart(4, "0");

    } catch (error) {

        console.error(
            "Agreement Number Error:",
            error
        );
    }
}

// ===============================
// Clause Text
// ===============================

const clauseTexts = {

    period: `
1. Period:
That the Licensor hereby grants to the Licensees herein a revocable leave and license, to occupy the Licensed Premises described in Schedule I hereunder written without creating any tenancy rights or any other rights, title and interest in favour of the Licensees for the period specified in this Agreement.
`,

    licenseFee: `
2. License Fee & Deposit:
That the Licensees shall pay to the Licensor License fee at the rate of Rs. ${document.getElementById("rent").value} per month towards the compensation and Rs. ${document.getElementById("deposit").value} as interest free refundable deposit for the use of the said Licensed premises.
`,

    depositPayment: `
3. Payment of Deposit:
That the Licensees has paid / shall pay the above mentioned deposit/premium as mentioned above by Transaction Reference No. as applicable.
`,

    maintenance: `
4. Maintenance Charges:
That the all outgoings including all rates, taxes, levies, assessment, maintenance charges, non occupancy charges, etc. in respect of the said premises shall be paid by the Licensor.
`,

    electricity: `
5. Electricity Charges:
The Licensee herein shall pay the electricity bills directly for energy consumed on the licensed premises.
`,

    use: `
6. Use:
That the Licensed premises shall only be used by the Licensees for Residential purpose. The Licensees shall maintain the said premises in its existing condition subject to normal wear and tear.
`,

    alteration: `
7. Alteration:
That the Licensees shall not make or permit to do any alteration or addition to the Licensed premises without previous consent in writing from the Licensor.
`,

    noTenancy: `
8. No Tenancy:
That the Licensees shall not claim any tenancy right and shall not have any right to transfer, assign, sublet or grant any license or sub-license in respect of the Licensed Premises.
`,

    inspection: `
9. Inspection:
That the Licensor shall have a right of access through himself or authorized representative to enter, view and inspect the Licensed premises at reasonable intervals.
`,

    cancellation: `
10. Cancellation:
Subject to the condition of lock in period, if any, the Licensor shall be entitled to revoke and/or cancel the License in case of default or breach of the terms of this agreement by giving notice as specified in this Agreement.
`,

    possession: `
11. Possession:
Immediately on expiration or termination of this agreement the Licensees shall vacate the said premises without delay with all their goods and belongings.
`,

    registration: `
12. Registration:
This Agreement is to be registered and the expenditure of Stamp Duty and registration fees and incidental charges, if any, shall be borne as agreed between the Licensee and Licensor.
`

};

// ===============================
// Generate PDF
// ===============================

async function generatePDF() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    let y = 20;

// ===============================
// Selected Clauses
// ===============================

const selectedClauses =
    Array.from(
        document.querySelectorAll('input[name="clause"]:checked')
    ).map(
        checkbox => checkbox.value
    );


// ===============================
// Add Selected Clauses to PDF
// ===============================

for (const clause of selectedClauses) {

    const text = clauseTexts[clause];

    if (!text) {
        continue;
    }

    const lines = doc.splitTextToSize(
        text.trim(),
        pageWidth - 40
    );

    if (y + (lines.length * 6) > pageHeight - 20) {

        doc.addPage();

        y = 20;
    }

    doc.text(
        lines,
        20,
        y
    );

    y += (lines.length * 6) + 8;
}

    // ===============================
    // Helper Functions
    // ===============================

    function getValue(id) {

        const element = document.getElementById(id);

        return element ? element.value || "-" : "-";
    }


    function addTitle(text) {

        doc.setFontSize(15);

        doc.setFont(undefined, "bold");

        doc.text(text, 20, y);

        y += 10;

        doc.setFont(undefined, "normal");
    }


    function addRow(label, value) {

        if (y > pageHeight - 20) {

            doc.addPage();

            y = 20;
        }

        doc.setFontSize(10);

        doc.setFont(undefined, "bold");

        doc.text(label, 20, y);

        doc.setFont(undefined, "normal");

        doc.text(String(value || "-"), 75, y);

        y += 7;
    }


// ===============================
// Header
// ===============================

doc.setFontSize(18);

doc.setFont(undefined, "bold");

doc.text(
    "AGREEMENT HUB",
    pageWidth / 2,
    y,
    { align: "center" }
);

y += 10;

doc.setFontSize(14);

doc.text(
    "LEAVE AND LICENSE AGREEMENT",
    pageWidth / 2,
    y,
    { align: "center" }
);

y += 15;

doc.setFontSize(10);

doc.setFont(undefined, "normal");

doc.text(
    "This Agreement is made and executed on",
    20,
    y
);

y += 8;

doc.text(
    "at Pune.",
    20,
    y
);

y += 12;

    // ===============================
    // Agreement Details
    // ===============================

    addTitle("AGREEMENT DETAILS");

    addRow(
        "Agreement No:",
        getValue("agreementNumber")
    );

    addRow(
        "Start Date:",
        getValue("startDate")
    );

    addRow(
        "End Date:",
        getValue("endDate")
    );

    addRow(
        "Duration:",
        getValue("duration") + " Months"
    );


    y += 5;


    // ===============================
    // Owner Details
    // ===============================

    addTitle("OWNER DETAILS");

    addRow(
        "Name:",
        getValue("ownerName")
    );

    addRow(
    "Age:",
    getValue("ownerAge")
);

addRow(
    "Occupation:",
    getValue("ownerOccupation")
);

addRow(
    "Address:",
    getValue("ownerAddress")
);

    addRow(
        "Mobile:",
        getValue("ownerMobile")
    );

    addRow(
        "Email:",
        getValue("ownerEmail")
    );

    addRow(
        "Aadhaar:",
        getValue("ownerAadhaar")
    );

    addRow(
        "PAN:",
        getValue("ownerPan")
    );


    y += 5;


    // ===============================
    // Tenant Details
    // ===============================

    addTitle("TENANT DETAILS");

    addRow(
        "Name:",
        getValue("tenantName")
    );

    addRow(
    "Age:",
    getValue("tenantAge")
);

addRow(
    "Occupation:",
    getValue("tenantOccupation")
);

addRow(
    "Address:",
    getValue("tenantAddress")
);

    addRow(
        "Mobile:",
        getValue("mobileNumber")
    );

    addRow(
        "Email:",
        getValue("tenantEmail")
    );

    addRow(
        "Aadhaar:",
        getValue("tenantAadhaar")
    );

    addRow(
        "PAN:",
        getValue("tenantPan")
    );


    y += 5;


    // ===============================
// PROPERTY DETAILS - EDIT
// ===============================

const propertyFields = {
    projectName: agreement.projectName,
    flatNumber: agreement.flatNumber,
    buildingName: agreement.buildingName,
    wing: agreement.wing,
    floor: agreement.floor,
    area: agreement.area,
    surveyNumber: agreement.surveyNumber,
    ctsNumber: agreement.ctsNumber,
    village: agreement.village,
    taluka: agreement.taluka,
    district: agreement.district,
    pinCode: agreement.pinCode,
    propertyAddress: agreement.propertyAddress
};

Object.keys(propertyFields).forEach(function (fieldId) {

    const field = document.getElementById(fieldId);

    if (field) {
        field.value =
            propertyFields[fieldId] !== undefined &&
            propertyFields[fieldId] !== null
                ? propertyFields[fieldId]
                : "";
    }

});


    document.getElementById("propertyAddress").value =
    agreement.propertyAddress || "";


// ===============================
// FINANCIAL DETAILS - EDIT
// ===============================

const rentField = document.getElementById("rent");
const depositField = document.getElementById("deposit");
const maintenanceField = document.getElementById("maintenance");
const lockInField = document.getElementById("lockIn");
const noticePeriodField = document.getElementById("noticePeriod");

if (rentField) {
    rentField.value =
        agreement.rent !== undefined &&
        agreement.rent !== null
            ? agreement.rent
            : "";
}

if (depositField) {
    depositField.value =
        agreement.deposit !== undefined &&
        agreement.deposit !== null
            ? agreement.deposit
            : "";
}

if (maintenanceField) {
    maintenanceField.value =
        agreement.maintenance !== undefined &&
        agreement.maintenance !== null
            ? agreement.maintenance
            : "";
}

if (lockInField) {
    lockInField.value =
        agreement.lockIn !== undefined &&
        agreement.lockIn !== null
            ? agreement.lockIn
            : "";
}

if (noticePeriodField) {
    noticePeriodField.value =
        agreement.noticePeriod !== undefined &&
        agreement.noticePeriod !== null
            ? agreement.noticePeriod
            : "";
}


    // ===============================
    // Witness Details
    // ===============================

    addTitle("WITNESS DETAILS");

    addRow(
        "Witness 1:",
        getValue("witness1Name")
    );

    addRow(
        "Mobile 1:",
        getValue("witness1Mobile")
    );

    addRow(
        "Witness 2:",
        getValue("witness2Name")
    );

    addRow(
        "Mobile 2:",
        getValue("witness2Mobile")
    );


    y += 5;


    // ===============================
    // Registration Details
    // ===============================

    addTitle("REGISTRATION DETAILS");

    addRow(
        "Stamp Duty:",
        "Rs. " + getValue("stampDuty")
    );

    addRow(
        "Registration Fee:",
        "Rs. " + getValue("registrationFee")
    );

    addRow(
        "Agreement Charges:",
        "Rs. " + getValue("agreementCharges")
    );

    addRow(
        "Brokerage:",
        "Rs. " + getValue("brokerage")
    );


    // ===============================
    // Footer
    // ===============================

    const totalPages =
        doc.internal.getNumberOfPages();

    for (
        let i = 1;
        i <= totalPages;
        i++
    ) {

        doc.setPage(i);

        doc.setFontSize(8);

        doc.setFont(undefined, "normal");

        doc.text(
            "Agreement Hub",
            20,
            pageHeight - 10
        );

        doc.text(
            "Page " + i + " of " + totalPages,
            pageWidth - 20,
            pageHeight - 10,
            { align: "right" }
        );
    }


    // ===============================
    // Save PDF
    // ===============================

    const agreementNumber =
        getValue("agreementNumber");

    doc.save(
        "Agreement-" +
        agreementNumber +
        ".pdf"
    );

}

// ===============================
// Load Agreement Default Settings
// ===============================

async function loadAgreementDefaults() {

    const editAgreementId =
        localStorage.getItem("editAgreementId");

    // Edit mode मध्ये defaults apply करू नका
    if (editAgreementId) {
        return;
    }

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
            console.log("Agreement defaults not found.");
            return;
        }

        const settings =
            settingsSnap.data();

        console.log(
            "AGREEMENT DEFAULT SETTINGS:",
            settings
        );

        // Default Agreement Period
        const durationField =
            document.getElementById("duration");

        if (
            durationField &&
            settings.defaultAgreementPeriod
        ) {

            durationField.value =
                String(
                    settings.defaultAgreementPeriod
                );

        }

        calculateEndDate();

    } catch (error) {

        console.error(
            "Agreement Defaults Load Error:",
            error
        );

    }
}


// ===============================
// Start
// ===============================

async function initializeAgreementForm() {

    await loadAgreementDefaults();

    await loadEditAgreement();

}

initializeAgreementForm();