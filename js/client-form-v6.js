// ==========================================
// AGREEMENT HUB - CLIENT FORM
// ==========================================

import { db, auth } from "./firebase.js";

import {
    collection,
    addDoc,
    doc,
    getDoc,
    updateDoc,
    getDocs,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// ==========================================
// SAVED PROPERTY AUTO-FILL
// ==========================================

let savedProperties = [];

async function loadSavedProperties() {
    const savedPropertySelect = document.getElementById("savedProperty");

    if (!savedPropertySelect) return;

    try {
        const snapshot = await getDocs(collection(db, "properties"));

        savedProperties = snapshot.docs.map((propertyDoc) => ({
            id: propertyDoc.id,
            ...propertyDoc.data()
        }));

        savedPropertySelect.innerHTML =
            '<option value="">Select Property</option>';

        savedProperties
            .sort((a, b) =>
                String(a.propertyId || "").localeCompare(
                    String(b.propertyId || "")
                )
            )
            .forEach((property) => {
                const option = document.createElement("option");

                option.value = property.id;

                option.textContent = [
                    property.propertyId,
                    property.projectName,
                    property.flatNumber,
                    property.ownerName
                ]
                    .filter(Boolean)
                    .join(" - ");

                savedPropertySelect.appendChild(option);
            });

    } catch (error) {
        console.error("Saved Properties Load Error:", error);
    }
}

document
    .getElementById("savedProperty")
    ?.addEventListener("change", (event) => {

        const property = savedProperties.find(
            (item) => item.id === event.target.value
        );

        if (!property) return;

        document.getElementById("ownerName").value =
            property.ownerName || "";

        document.getElementById("ownerMobile").value =
            property.ownerMobile || "";

        document.getElementById("projectName").value =
            property.projectName || "";

        document.getElementById("flatNumber").value =
            property.flatNumber || "";

        document.getElementById("area").value =
            property.area || "";

        document.getElementById("rent").value =
            property.monthlyRent || "";

        document.getElementById("deposit").value =
            property.securityDeposit || "";
    });

loadSavedProperties();

// ==========================================
// FORM ELEMENTS
// ==========================================

const form =
    document.getElementById("agreementForm");

const startDate =
    document.getElementById("startDate");

const duration =
    document.getElementById("duration");

const endDate =
    document.getElementById("endDate");


// ==========================================
// LOGIN PROTECTION
// ==========================================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href =
            "login.html";

    }

});


// ==========================================
// END DATE CALCULATION
// ==========================================

function calculateEndDate() {

    if (
        !startDate.value ||
        !duration.value
    ) {

        endDate.value = "";

        return;

    }


    const start =
        new Date(
            startDate.value +
            "T00:00:00"
        );


    const months =
        parseInt(
            duration.value,
            10
        );


    if (
        Number.isNaN(
            start.getTime()
        ) ||
        Number.isNaN(months)
    ) {

        endDate.value = "";

        return;

    }


    start.setMonth(
        start.getMonth() +
        months
    );


    start.setDate(
        start.getDate() -
        1
    );


    const year =
        start.getFullYear();


    const month =
        String(
            start.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            start.getDate()
        ).padStart(
            2,
            "0"
        );


    endDate.value =
        `${year}-${month}-${day}`;

}


startDate.addEventListener(
    "change",
    calculateEndDate
);


duration.addEventListener(
    "change",
    calculateEndDate
);


// ==========================================
// GET FIELD VALUE
// ==========================================

function getValue(id) {

    const element =
        document.getElementById(id);


    if (!element) {

        return "";

    }


    return element.value || "";

}


// ==========================================
// CREATE AGREEMENT DATA
// ==========================================

function getAgreementData() {

    return {

        // Agreement

        agreementNumber:
            getValue(
                "agreementNumber"
            ),

        startDate:
            getValue(
                "startDate"
            ),

        endDate:
            getValue(
                "endDate"
            ),

        duration:
            getValue(
                "duration"
            ),


        // Owner

        owner:
            getValue(
                "ownerName"
            ),

        ownerMobile:
            getValue(
                "ownerMobile"
            ),

        ownerEmail:
            getValue(
                "ownerEmail"
            ),

        ownerAadhaar:
            getValue(
                "ownerAadhaar"
            ),

        ownerPan:
            getValue(
                "ownerPan"
            ),

        ownerAge:
            getValue(
                "ownerAge"
            ),

        ownerOccupation:
            getValue(
                "ownerOccupation"
            ),

        ownerAddress:
            getValue(
                "ownerAddress"
            ),


        // Tenant

        tenant:
            getValue(
                "tenantName"
            ),

        mobile:
            getValue(
                "mobileNumber"
            ),

        tenantEmail:
            getValue(
                "tenantEmail"
            ),

        tenantAadhaar:
            getValue(
                "tenantAadhaar"
            ),

        tenantPan:
            getValue(
                "tenantPan"
            ),

        tenantAge:
            getValue(
                "tenantAge"
            ),

        tenantOccupation:
            getValue(
                "tenantOccupation"
            ),

        tenantAddress:
            getValue(
                "tenantAddress"
            ),


        // Property

        projectName:
            getValue(
                "projectName"
            ),

        flatNumber:
            getValue(
                "flatNumber"
            ),

        buildingName:
            getValue(
                "buildingName"
            ),

        wing:
            getValue(
                "wing"
            ),

        floor:
            getValue(
                "floor"
            ),

        area:
            getValue(
                "area"
            ),

        surveyNumber:
            getValue(
                "surveyNumber"
            ),

        ctsNumber:
            getValue(
                "ctsNumber"
            ),

        village:
            getValue(
                "village"
            ),

        taluka:
            getValue(
                "taluka"
            ),

        district:
            getValue(
                "district"
            ),

        pinCode:
            getValue(
                "pinCode"
            ),

        propertyAddress:
            getValue(
                "propertyAddress"
            ),


        // Financial Details

        rent:
            getValue(
                "rent"
            ),

        deposit:
            getValue(
                "deposit"
            ),

        maintenance:
            getValue(
                "maintenance"
            ),

        lockIn:
            getValue(
                "lockIn"
            ),

        noticePeriod:
            getValue(
                "noticePeriod"
            ),


        // Witness

        witness1Name:
            getValue(
                "witness1Name"
            ),

        witness1Mobile:
            getValue(
                "witness1Mobile"
            ),

        witness2Name:
            getValue(
                "witness2Name"
            ),

        witness2Mobile:
            getValue(
                "witness2Mobile"
            ),


        // Registration

        stampDuty:
            getValue(
                "stampDuty"
            ),

        registrationFee:
            getValue(
                "registrationFee"
            ),


        // ==================================
        // ADMIN ONLY
        // ==================================

        agreementCharges:
            getValue(
                "agreementCharges"
            ),

        serviceCharge:
            getValue(
                "serviceCharge"
            ),

        brokerage:
            getValue(
                "brokerage"
            ),


        // Selected Clauses

        selectedClauses:

            Array.from(
                document.querySelectorAll(
                    'input[name="clause"]:checked'
                )
            ).map(
                checkbox =>
                    checkbox.value
            ),


        updatedAt:
            new Date()
                .toISOString()

    };

}


// ==========================================
// MOBILE NORMALIZATION
// ==========================================

// ==========================================
// NORMALIZE MOBILE
// ==========================================

function normalizeMobile(mobile) {

    let digits =
        String(mobile || "")
            .replace(/\D/g, "");

    // +91 / 91 prefix असल्यास
    // शेवटचे 10 digits वापरा

    if (digits.length > 10) {

        digits =
            digits.slice(-10);

    }

    return digits;
}


// ==========================================
// AUTO SYNC TENANT TO CLIENTS
// NO DUPLICATES BY MOBILE
// ==========================================

async function syncTenantToClients(
    agreement,
    agreementId
) {

    const mobile =
        normalizeMobile(
            agreement.mobile
        );


    if (!mobile) {

        console.log(
            "Client sync skipped - mobile missing"
        );

        return;

    }


    try {

        const clientsSnapshot =
            await getDocs(
                collection(
                    db,
                    "clients"
                )
            );


        let existingClientId = null;


        clientsSnapshot.forEach(
            clientDoc => {

                const clientData =
                    clientDoc.data();


                const savedMobile =
                    normalizeMobile(
                        clientData.mobile
                    );


                if (
                    savedMobile === mobile &&
                    !existingClientId
                ) {

                    existingClientId =
                        clientDoc.id;

                }

            }
        );


        const clientData = {

            clientName:
                agreement.tenant || "",

            mobile:
                mobile,

            email:
                agreement.tenantEmail || "",

            tenantAddress:
                agreement.tenantAddress || "",

            projectName:
                agreement.projectName || "",

            propertyAddress:
                agreement.propertyAddress || "",

            flatNumber:
                agreement.flatNumber || "",

            buildingName:
                agreement.buildingName || "",

            lastAgreementNo:
                agreement.agreementNumber || "",

            lastAgreementId:
                agreementId || "",

            agreementStartDate:
                agreement.startDate || "",

            agreementEndDate:
                agreement.endDate || "",

            status:
                "Active",

            updatedAt:
                new Date().toISOString()

        };


        // Existing client found

        if (existingClientId) {

            await setDoc(
                doc(
                    db,
                    "clients",
                    existingClientId
                ),
                clientData,
                {
                    merge: true
                }
            );


            console.log(
                "Existing Client Updated:",
                existingClientId
            );

        }


        // New client

        else {

            clientData.createdAt =
                new Date().toISOString();


            await setDoc(
                doc(
                    db,
                    "clients",
                    mobile
                ),
                clientData
            );


            console.log(
                "New Client Created:",
                mobile
            );

        }


    } catch (error) {

        console.error(
            "CLIENT AUTO SYNC ERROR:",
            error
        );

    }

}




// ==========================================
// SAVE / UPDATE AGREEMENT
// ==========================================

form.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        calculateEndDate();


        const user =
            auth.currentUser;


        if (!user) {

            alert(
                "Please login again."
            );

            return;

        }


        const agreement =
            getAgreementData();


        const editAgreementId =
            localStorage.getItem(
                "editAgreementId"
            );


        try {

            // ==================================
            // EDIT EXISTING AGREEMENT
            // ==================================

            if (
                editAgreementId
            ) {

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


                // Auto update Client

                await syncTenantToClients(

                    agreement,

                    editAgreementId

                );


                localStorage.removeItem(
                    "editAgreementId"
                );


                alert(
                    "Agreement Updated Successfully!"
                );

            }


            // ==================================
            // NEW AGREEMENT
            // ==================================

            else {

                agreement.createdAt =
                    new Date()
                        .toISOString();

                        // Renewal tracking
const renewAgreementId =
    localStorage.getItem(
        "renewAgreementId"
    );

if (renewAgreementId) {

    const oldAgreementSnap =
        await getDoc(
            doc(
                db,
                "agreements",
                renewAgreementId
            )
        );

    if (oldAgreementSnap.exists()) {

        const oldAgreement =
            oldAgreementSnap.data();

        agreement.renewedFrom =
            renewAgreementId;

        agreement.renewedFromAgreementNumber =
            oldAgreement.agreementNumber || "";

    }

}

                agreement.createdBy =
                    user.uid;


                const agreementRef =
                    await addDoc(

                        collection(
                            db,
                            "agreements"
                        ),

                        agreement

                    );

// Mark old agreement as renewed
if (renewAgreementId) {

    await updateDoc(
        doc(
            db,
            "agreements",
            renewAgreementId
        ),
        {
            renewalStatus:
                "Renewed",

            renewedTo:
                agreementRef.id,

            renewedToAgreementNumber:
                agreement.agreementNumber,

            renewedAt:
                new Date().toISOString()
        }
    );

}

                // Auto Create / Update Client

                await syncTenantToClients(

                    agreement,

                    agreementRef.id

                );

localStorage.removeItem(
    "renewAgreementId"
);

                alert(
                    "Agreement Saved Successfully!"
                );

            }


            window.location.href =
                "dashboard.html";


        } catch (error) {

            console.error(
                "AGREEMENT SAVE ERROR:",
                error
            );


            alert(
                "Agreement Save Failed: " +
                error.message
            );

        }

    }
);


// ==========================================
// LOAD AGREEMENT FOR EDIT
// ==========================================

async function loadEditAgreement() {

    const editAgreementId =
        localStorage.getItem(
            "editAgreementId"
        );


    if (
        !editAgreementId
    ) {

        await generateAgreementNumber();

        return;

    }


    try {

        const agreementRef =
            doc(
                db,
                "agreements",
                editAgreementId
            );


        const agreementSnap =
            await getDoc(
                agreementRef
            );


        if (
            !agreementSnap.exists()
        ) {

            localStorage.removeItem(
                "editAgreementId"
            );


            alert(
                "Agreement not found."
            );


            window.location.href =
                "dashboard.html";


            return;

        }


        const agreement =
            agreementSnap.data();


        const mapping = {

            agreementNumber:
                "agreementNumber",

            startDate:
                "startDate",

            endDate:
                "endDate",

            duration:
                "duration",


            owner:
                "ownerName",

            ownerMobile:
                "ownerMobile",

            ownerEmail:
                "ownerEmail",

            ownerAadhaar:
                "ownerAadhaar",

            ownerPan:
                "ownerPan",

            ownerAge:
                "ownerAge",

            ownerOccupation:
                "ownerOccupation",

            ownerAddress:
                "ownerAddress",


            tenant:
                "tenantName",

            mobile:
                "mobileNumber",

            tenantEmail:
                "tenantEmail",

            tenantAadhaar:
                "tenantAadhaar",

            tenantPan:
                "tenantPan",

            tenantAge:
                "tenantAge",

            tenantOccupation:
                "tenantOccupation",

            tenantAddress:
                "tenantAddress",


            projectName:
                "projectName",

            flatNumber:
                "flatNumber",

            buildingName:
                "buildingName",

            wing:
                "wing",

            floor:
                "floor",

            area:
                "area",

            surveyNumber:
                "surveyNumber",

            ctsNumber:
                "ctsNumber",

            village:
                "village",

            taluka:
                "taluka",

            district:
                "district",

            pinCode:
                "pinCode",

            propertyAddress:
                "propertyAddress",


            rent:
                "rent",

            deposit:
                "deposit",

            maintenance:
                "maintenance",

            lockIn:
                "lockIn",

            noticePeriod:
                "noticePeriod",


            witness1Name:
                "witness1Name",

            witness1Mobile:
                "witness1Mobile",

            witness2Name:
                "witness2Name",

            witness2Mobile:
                "witness2Mobile",


            stampDuty:
                "stampDuty",

            registrationFee:
                "registrationFee",


            agreementCharges:
                "agreementCharges",

            serviceCharge:
                "serviceCharge",

            brokerage:
                "brokerage"

        };


        Object.entries(
            mapping
        ).forEach(
            ([key, id]) => {

                const element =
                    document.getElementById(
                        id
                    );


                if (
                    element
                ) {

                    element.value =
                        agreement[key] ??
                        "";

                }

            }
        );


        const selectedClauses =
            agreement.selectedClauses ||
            [];


        document.querySelectorAll(
            'input[name="clause"]'
        ).forEach(
            checkbox => {

                checkbox.checked =
                    selectedClauses
                        .includes(
                            checkbox.value
                        );

            }
        );


    } catch (error) {

        console.error(
            "EDIT AGREEMENT LOAD ERROR:",
            error
        );

    }

}


// ==========================================
// AGREEMENT NUMBER
// ==========================================

async function generateAgreementNumber() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "agreements"
                )
            );


        const year =
            new Date()
                .getFullYear();


        let highestNumber = 0;


        snapshot.forEach(
            document => {

                const agreementNumber =
                    String(
                        document
                            .data()
                            .agreementNumber ||
                        ""
                    );


                const pattern =
                    new RegExp(
                        "^AG-" +
                        year +
                        "-(\\d+)$"
                    );


                const match =
                    agreementNumber
                        .match(
                            pattern
                        );


                if (
                    match
                ) {

                    highestNumber =
                        Math.max(

                            highestNumber,

                            parseInt(
                                match[1],
                                10
                            )

                        );

                }

            }
        );


        document.getElementById(
            "agreementNumber"
        ).value =

            "AG-" +
            year +
            "-" +
            String(
                highestNumber + 1
            ).padStart(
                4,
                "0"
            );


    } catch (error) {

        console.error(
            "AGREEMENT NUMBER ERROR:",
            error
        );

    }

}

// ==========================================
// LOAD AGREEMENT FOR RENEWAL
// ==========================================

async function loadRenewAgreement() {

    const renewAgreementId =
        localStorage.getItem(
            "renewAgreementId"
        );


    if (
        !renewAgreementId
    ) {
        return false;
    }


    try {

        const agreementRef =
            doc(
                db,
                "agreements",
                renewAgreementId
            );


        const agreementSnap =
            await getDoc(
                agreementRef
            );


        if (
            !agreementSnap.exists()
        ) {

            localStorage.removeItem(
                "renewAgreementId"
            );

            alert(
                "Renewal agreement not found."
            );

            return false;

        }


        const agreement =
            agreementSnap.data();


        const mapping = {

            duration:
                "duration",

            owner:
                "ownerName",

            ownerMobile:
                "ownerMobile",

            ownerEmail:
                "ownerEmail",

            ownerAadhaar:
                "ownerAadhaar",

            ownerPan:
                "ownerPan",

            ownerAge:
                "ownerAge",

            ownerOccupation:
                "ownerOccupation",

            ownerAddress:
                "ownerAddress",

            tenant:
                "tenantName",

            mobile:
                "mobileNumber",

            tenantEmail:
                "tenantEmail",

            tenantAadhaar:
                "tenantAadhaar",

            tenantPan:
                "tenantPan",

            tenantAge:
                "tenantAge",

            tenantOccupation:
                "tenantOccupation",

            tenantAddress:
                "tenantAddress",

            projectName:
                "projectName",

            flatNumber:
                "flatNumber",

            buildingName:
                "buildingName",

            wing:
                "wing",

            floor:
                "floor",

            area:
                "area",

            surveyNumber:
                "surveyNumber",

            ctsNumber:
                "ctsNumber",

            village:
                "village",

            taluka:
                "taluka",

            district:
                "district",

            pinCode:
                "pinCode",

            propertyAddress:
                "propertyAddress",

            rent:
                "rent",

            deposit:
                "deposit",

            maintenance:
                "maintenance",

            lockIn:
                "lockIn",

            noticePeriod:
                "noticePeriod",

            witness1Name:
                "witness1Name",

            witness1Mobile:
                "witness1Mobile",

            witness2Name:
                "witness2Name",

            witness2Mobile:
                "witness2Mobile",

            stampDuty:
                "stampDuty",

            registrationFee:
                "registrationFee",

            agreementCharges:
                "agreementCharges",

            serviceCharge:
                "serviceCharge",

            brokerage:
                "brokerage"

        };


        Object.entries(
            mapping
        ).forEach(
            ([key, id]) => {

                const element =
                    document.getElementById(
                        id
                    );


                if (element) {

                    element.value =
                        agreement[key] ??
                        "";

                }

            }
        );


        const selectedClauses =
            agreement.selectedClauses ||
            [];


        document.querySelectorAll(
            'input[name="clause"]'
        ).forEach(
            checkbox => {

                checkbox.checked =
                    selectedClauses
                        .includes(
                            checkbox.value
                        );

            }
        );


        // Renewal = NEW agreement
        // Do NOT reuse old dates or agreement number

        const startDate =
            document.getElementById(
                "startDate"
            );

        const endDate =
            document.getElementById(
                "endDate"
            );


        if (startDate) {
            startDate.value = "";
        }


        if (endDate) {
            endDate.value = "";
        }


        await generateAgreementNumber();


        console.log(
            "Renewal data loaded from:",
            renewAgreementId
        );


        return true;


    } catch (error) {

        console.error(
            "RENEW AGREEMENT LOAD ERROR:",
            error
        );


        return false;

    }

}

// ==========================================
// LOAD DEFAULT AGREEMENT SETTINGS
// ==========================================

async function loadAgreementDefaults() {

    // Edit mode मध्ये default बदलू नका

    if (
        localStorage.getItem(
            "editAgreementId"
        )
    ) {

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
            await getDoc(
                settingsRef
            );


        if (
            !settingsSnap.exists()
        ) {

            return;

        }


        const settings =
            settingsSnap.data();


        const savedPeriod =
            Number(
                settings
                    .defaultAgreementPeriod
            );


        if (
            [
                11,
                22,
                33
            ].includes(
                savedPeriod
            )
        ) {

            duration.value =
                String(
                    savedPeriod
                );

        }


        // Optional Default Service Charge

        const serviceChargeField =
            document.getElementById(
                "serviceCharge"
            );


        if (
            serviceChargeField &&
            settings
                .defaultServiceCharge !==
                undefined
        ) {

            serviceChargeField.value =
                settings
                    .defaultServiceCharge ||
                "";

        }


        calculateEndDate();


    } catch (error) {

        console.error(
            "DEFAULT SETTINGS LOAD ERROR:",
            error
        );

    }

}


// ==========================================
// CLIENT-SAFE PDF
// ==========================================

document.getElementById(
    "pdfBtn"
).addEventListener(
    "click",
    generateClientPdf
);


function generateClientPdf() {

    if (
        !window.jspdf ||
        !window.jspdf.jsPDF
    ) {

        alert(
            "PDF library not loaded."
        );

        return;

    }


    const {
        jsPDF
    } =
        window.jspdf;


    const pdf =
        new jsPDF();


    const pageWidth =
        pdf.internal
            .pageSize
            .getWidth();


    const pageHeight =
        pdf.internal
            .pageSize
            .getHeight();


    let y = 18;


    function addLine(
        label,
        value
    ) {

        const text =
            label +
            ": " +
            (
                value ||
                "-"
            );


        const lines =
            pdf.splitTextToSize(

                text,

                pageWidth - 30

            );


        if (
            y +
            lines.length * 6 >
            pageHeight - 18
        ) {

            pdf.addPage();

            y = 18;

        }


        pdf.text(
            lines,
            15,
            y
        );


        y +=
            lines.length *
            6 +
            2;

    }


    pdf.setFontSize(
        17
    );


    pdf.setFont(
        undefined,
        "bold"
    );


    pdf.text(

        "AGREEMENT HUB",

        pageWidth / 2,

        y,

        {
            align:
                "center"
        }

    );


    y += 10;


    pdf.setFontSize(
        13
    );


    pdf.text(

        "CLIENT AGREEMENT DETAILS",

        pageWidth / 2,

        y,

        {
            align:
                "center"
        }

    );


    y += 12;


    pdf.setFont(
        undefined,
        "normal"
    );


    pdf.setFontSize(
        10
    );


    addLine(
        "Agreement No",
        getValue(
            "agreementNumber"
        )
    );


    addLine(
        "Start Date",
        getValue(
            "startDate"
        )
    );


    addLine(
        "End Date",
        getValue(
            "endDate"
        )
    );


    addLine(
        "Duration",
        getValue(
            "duration"
        ) +
        " Months"
    );


    addLine(
        "Owner Name",
        getValue(
            "ownerName"
        )
    );


    addLine(
        "Owner Mobile",
        getValue(
            "ownerMobile"
        )
    );


    addLine(
        "Tenant Name",
        getValue(
            "tenantName"
        )
    );


    addLine(
        "Tenant Mobile",
        getValue(
            "mobileNumber"
        )
    );


    addLine(
        "Project",
        getValue(
            "projectName"
        )
    );


    addLine(
        "Property Address",
        getValue(
            "propertyAddress"
        )
    );


    addLine(
        "Monthly Rent",
        "Rs. " +
        getValue(
            "rent"
        )
    );


    addLine(
        "Security Deposit",
        "Rs. " +
        getValue(
            "deposit"
        )
    );


    addLine(
        "Maintenance",
        "Rs. " +
        getValue(
            "maintenance"
        )
    );


    addLine(
        "Stamp Duty",
        "Rs. " +
        getValue(
            "stampDuty"
        )
    );


    addLine(
        "Registration Fee",
        "Rs. " +
        getValue(
            "registrationFee"
        )
    );


    /*
        IMPORTANT

        Client PDF मध्ये खालील
        INTERNAL fields intentionally नाहीत:

        agreementCharges
        serviceCharge
        brokerage
    */


    pdf.save(

        "Agreement-" +
        (
            getValue(
                "agreementNumber"
            ) ||
            "Draft"
        ) +
        ".pdf"

    );

}


// ==========================================
// INITIALIZE
// ==========================================

async function initializeAgreementForm() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const mode =
    params.get("mode");


// New Agreement explicitly requested
if (mode === "new") {

    localStorage.removeItem(
        "editAgreementId"
    );

    localStorage.removeItem(
        "renewAgreementId"
    );

}


const renewAgreementId =
    localStorage.getItem(
        "renewAgreementId"
    );


if (renewAgreementId) {

    localStorage.removeItem(
        "editAgreementId"
    );

    await loadAgreementDefaults();

    await loadRenewAgreement();

} else {

    await loadAgreementDefaults();

    await loadEditAgreement();

}

}

initializeAgreementForm();
