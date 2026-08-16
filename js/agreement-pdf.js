// ======================================================
// AGREEMENT HUB
// FINAL LEAVE AND LICENSE AGREEMENT PDF
// ======================================================

async function generateProfessionalPDF() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const left = 20;
    const right = 20;
    const contentWidth = pageWidth - left - right;

    let y = 20;


    // ==================================================
    // GET FORM VALUE
    // ==================================================

    function getValue(id) {

        const element = document.getElementById(id);

        if (!element) {
            return "";
        }

        return element.value || "";
    }


    // ==================================================
    // PAGE CHECK
    // ==================================================

    function checkPage(space = 15) {

        if (y + space > pageHeight - 20) {

            doc.addPage();

            y = 20;
        }
    }


    // ==================================================
    // NORMAL TEXT
    // ==================================================

    function addParagraph(text) {

        if (!text) {
            return;
        }

        doc.setFontSize(10);

        doc.setFont(
            "helvetica",
            "normal"
        );

        const lines =
            doc.splitTextToSize(
                String(text),
                contentWidth
            );

        for (const line of lines) {

            checkPage(7);

            doc.text(
                line,
                left,
                y
            );

            y += 5.5;
        }

        y += 3;
    }


    // ==================================================
    // HEADING
    // ==================================================

    function addHeading(text) {

        checkPage(15);

        doc.setFontSize(11);

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.text(
            text,
            left,
            y
        );

        y += 7;

        doc.setFont(
            "helvetica",
            "normal"
        );
    }


    // ==================================================
    // CENTER HEADING
    // ==================================================

    function addCenterHeading(text, size = 14) {

        checkPage(20);

        doc.setFontSize(size);

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.text(
            text,
            pageWidth / 2,
            y,
            {
                align: "center"
            }
        );

        y += 9;
    }


    // ==================================================
    // FIELD ROW
    // ==================================================

    function addRow(label, value) {

        checkPage(10);

        doc.setFontSize(10);

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.text(
            label,
            left,
            y
        );

        doc.setFont(
            "helvetica",
            "normal"
        );

        const lines =
            doc.splitTextToSize(
                String(value || "-"),
                contentWidth - 55
            );

        doc.text(
            lines,
            left + 55,
            y
        );

        y +=
            Math.max(
                5.5,
                lines.length * 5.5
            );

        y += 2;
    }

    // ==================================================
// DATE FORMAT
// ==================================================

function formatDate(dateValue) {

    if (!dateValue) {
        return "-";
    }

    const parts = dateValue.split("-");

    if (parts.length !== 3) {
        return dateValue;
    }

    return parts[2] + "/" + parts[1] + "/" + parts[0];
}

    // ==================================================
    // FORM DATA
    // ==================================================

    const agreementNumber =
        getValue("agreementNumber");

const startDateRaw =
    getValue("startDate");

const endDateRaw =
    getValue("endDate");

const startDate =
    formatDate(startDateRaw);

const endDate =
    formatDate(endDateRaw);

    const duration =
        getValue("duration");

    // OWNER

    const ownerName =
        getValue("ownerName");

    const ownerAge =
        getValue("ownerAge");

    const ownerOccupation =
        getValue("ownerOccupation");

    const ownerPan =
        getValue("ownerPan");

    const ownerAadhaar =
        getValue("ownerAadhaar");

    const ownerAddress =
        getValue("ownerAddress");

    const ownerMobile =
        getValue("ownerMobile");

    const ownerEmail =
        getValue("ownerEmail");


    // TENANT

    const tenantName =
        getValue("tenantName");

    const tenantAge =
        getValue("tenantAge");

    const tenantOccupation =
        getValue("tenantOccupation");

    const tenantPan =
        getValue("tenantPan");

    const tenantAadhaar =
        getValue("tenantAadhaar");

    const tenantAddress =
        getValue("tenantAddress");

    const tenantMobile =
        getValue("mobileNumber");

    const tenantEmail =
        getValue("tenantEmail");


    // PROPERTY

    const projectName =
        getValue("projectName");

    const flatNumber =
        getValue("flatNumber");

    const buildingName =
        getValue("buildingName");

    const wing =
        getValue("wing");

    const floor =
        getValue("floor");

    const area =
        getValue("area");

    const surveyNumber =
        getValue("surveyNumber");

    const ctsNumber =
        getValue("ctsNumber");

    const village =
        getValue("village");

    const taluka =
        getValue("taluka");

    const district =
        getValue("district");

    const pinCode =
        getValue("pinCode");

    const propertyAddress =
        getValue("propertyAddress");


    // FINANCIAL

    const rent =
        getValue("rent");

    const deposit =
        getValue("deposit");

    const maintenance =
        getValue("maintenance");

    const lockIn =
        getValue("lockIn");

    const noticePeriod =
        getValue("noticePeriod");


    // WITNESS

    const witness1Name =
        getValue("witness1Name");

    const witness1Mobile =
        getValue("witness1Mobile");

    const witness2Name =
        getValue("witness2Name");

    const witness2Mobile =
        getValue("witness2Mobile");


    // REGISTRATION

    const stampDuty =
        getValue("stampDuty");

    const registrationFee =
        getValue("registrationFee");

    const agreementCharges =
        getValue("agreementCharges");

    const brokerage =
        getValue("brokerage");


  // ==================================================
// TITLE
// ==================================================

addCenterHeading(
    "AGREEMENT HUB",
    18
);

y += 2;

addCenterHeading(
    "LEAVE AND LICENSE AGREEMENT",
    14
);

y += 4;


// ==================================================
// AGREEMENT DATE AND NUMBER
// ==================================================

addParagraph(
    "Agreement No: " +
    agreementNumber
);

addParagraph(
    "Date: " +
    startDate
);

addParagraph(
    "Place: Pune"
);

y += 4;


// ==================================================
// BETWEEN
// ==================================================

addParagraph(
    "Between,"
);

    // ==================================================
    // LICENSOR
    // ==================================================

    addParagraph(
        "1) Name: Mr./Mrs. " +
        ownerName +
        ", Age: About " +
        ownerAge +
        " Years, Occupation: " +
        ownerOccupation +
        ", PAN: " +
        ownerPan +
        ", Aadhaar: " +
        ownerAadhaar +
        "."
    );

    addParagraph(
        "Residing at: " +
        ownerAddress
    );

    addParagraph(
        "HEREINAFTER called the Licensor which expression shall mean and include the Licensor above named and also his/her/their respective heirs, successors, assigns, executors and administrators."
    );


    // ==================================================
    // AND
    // ==================================================

    addParagraph(
        "AND"
    );


    // ==================================================
    // LICENSEE
    // ==================================================

    addParagraph(
        "1) Name: Mr./Mrs. " +
        tenantName +
        ", Age: About " +
        tenantAge +
        " Years, Occupation: " +
        tenantOccupation +
        ", PAN: " +
        tenantPan +
        ", Aadhaar: " +
        tenantAadhaar +
        "."
    );

    addParagraph(
        "Residing at: " +
        tenantAddress
    );

    addParagraph(
        "HEREINAFTER called the Licensee which expression shall mean and include only Licensee above named."
    );


    // ==================================================
    // WHEREAS
    // ==================================================

    addParagraph(
        "WHEREAS the Licensor is absolutely seized and possessed of and or otherwise well and sufficiently entitled to all that constructed portion being unit described in Schedule I hereunder written and is hereafter for the sake of brevity called or referred to as Licensed Premises and is desirous of giving the said premises on Leave and License basis under Section 24 of the Maharashtra Rent Control Act, 1999."
    );


    addParagraph(
        "AND WHEREAS the Licensee herein is in need of temporary premises for Residential use and has approached the Licensor with a request to allow the Licensee herein to use and occupy the said premises on Leave and License basis for a period of " +
        duration +
        " Months commencing from " +
        startDate +
        " and ending on " +
        endDate +
        ", on terms and subject to conditions hereafter appearing."
    );


    addParagraph(
        "AND WHEREAS the Licensor has agreed to allow the Licensee herein to use and occupy the said Licensed premises for Residential purposes only, on Leave and License basis for the above mentioned period, on terms and subject to conditions hereafter appearing."
    );


    addParagraph(
        "NOW THEREFORE IT IS HEREBY AGREED TO, DECLARED AND RECORDED BY AND BETWEEN THE PARTIES HERETO AS FOLLOWS:"
    );


    // ==================================================
    // 1 PERIOD
    // ==================================================

    addHeading(
        "1. Period:"
    );

    addParagraph(
        "That the Licensor hereby grants to the Licensee herein a revocable leave and license, to occupy the Licensed Premises described in Schedule I hereunder written without creating any tenancy rights or any other rights, title and interest in favour of the Licensee for a period of " +
        duration +
        " Months commencing from " +
        startDate +
        " and ending on " +
        endDate +
        "."
    );


    // ==================================================
    // 2 LICENSE FEE
    // ==================================================

    addHeading(
        "2. License Fee & Deposit:"
    );

    addParagraph(
        "That the Licensee shall pay to the Licensor License fee at the rate of Rs. " +
        rent +
        " per month towards the compensation and Rs. " +
        deposit +
        " as interest free refundable deposit for the use of the said Licensed premises. The amount of monthly compensation License fee shall be payable within the first five days of the concerned month of Leave and License."
    );


    // ==================================================
    // 3 PAYMENT OF DEPOSIT
    // ==================================================

    addHeading(
        "3. Payment of Deposit:"
    );

    addParagraph(
        "That the Licensee has paid or shall pay the above mentioned deposit of Rs. " +
        deposit +
        " as mentioned above. The payment transaction details shall be recorded separately."
    );


    // ==================================================
    // 4 MAINTENANCE
    // ==================================================

    addHeading(
        "4. Maintenance Charges:"
    );

    addParagraph(
        "That all outgoings including all rates, taxes, levies, assessment, maintenance charges, non occupancy charges and other applicable charges in respect of the said premises shall be paid as agreed between the Licensor and Licensee. The applicable maintenance amount is Rs. " +
        (maintenance || "-") +
        " per month."
    );


    // ==================================================
    // 5 ELECTRICITY
    // ==================================================

    addHeading(
        "5. Electricity Charges:"
    );

    addParagraph(
        "The Licensee herein shall pay the electricity bills directly for energy consumed on the licensed premises and shall keep the payment receipts as proof of payment."
    );


    // ==================================================
    // 6 USE
    // ==================================================

    addHeading(
        "6. Use:"
    );

    addParagraph(
        "That the Licensed premises shall only be used by the Licensee for Residential purpose. The Licensee shall maintain the said premises in its existing condition and damage, if any, caused to the said premises shall be repaired by the Licensee at its own cost subject to normal wear and tear. The Licensee shall not do anything in the said premises which is or is likely to cause a nuisance to the other occupants of the said building or prejudice the rights of the Licensor in respect of the said premises and shall not carry out any unlawful activities prohibited by State or Central Government."
    );


    // ==================================================
    // 7 ALTERATION
    // ==================================================

    addHeading(
        "7. Alteration:"
    );

    addParagraph(
        "That the Licensee shall not make or permit to do any alteration or addition to the construction or arrangements, internal or external, to the Licensed premises without previous consent in writing from the Licensor."
    );


    // ==================================================
    // 8 NO TENANCY
    // ==================================================

    addHeading(
        "8. No Tenancy:"
    );

    addParagraph(
        "That the Licensee shall not claim any tenancy right and shall not have any right to transfer, assign, sublet or grant any license or sub-license in respect of the Licensed Premises or any part thereof and shall not mortgage or raise any loan against the said premises."
    );


    // ==================================================
    // 9 INSPECTION
    // ==================================================

    addHeading(
        "9. Inspection:"
    );

    addParagraph(
        "That the Licensor shall on reasonable notice given to the Licensee have a right of access either by himself or through an authorized representative to enter, view and inspect the Licensed premises at reasonable intervals."
    );


    // ==================================================
    // 10 CANCELLATION
    // ==================================================

    addHeading(
        "10. Cancellation:"
    );

    addParagraph(
        "That subject to the condition of lock in period, if any, if the Licensee commits default in regular and punctual payment of monthly compensation or commits breach of any of the terms, covenants and conditions of this Agreement, the Licensor shall be entitled to revoke and/or cancel the License hereby granted by giving notice as specified in this Agreement. The Licensee shall have the right to vacate the said premises by giving a notice of " +
        (noticePeriod || "-") +
        " days to the Licensor, subject to the terms of this Agreement."
    );


    // ==================================================
    // 11 POSSESSION
    // ==================================================

    addHeading(
        "11. Possession:"
    );

    addParagraph(
        "That immediately upon expiration, termination or cancellation of this Agreement, the Licensee shall vacate the said premises without delay with all his/her goods and belongings. In the event of the Licensee failing or neglecting to vacate the premises on expiry or sooner determination of this Agreement, the Licensor shall be entitled to recover damages as permitted by law."
    );


    // ==================================================
    // 12 REGISTRATION
    // ==================================================

    addHeading(
        "12. Registration:"
    );

    addParagraph(
        "This Agreement is to be registered and the expenditure of Stamp Duty and registration fees and incidental charges, if any, shall be borne by the parties as mutually agreed."
    );


    /// ==================================================
// SCHEDULE I
// ==================================================

checkPage(80);

addCenterHeading(
    "SCHEDULE I",
    13
);

addParagraph(
    "(Being the correct description of premises which is the subject matter of these presents)"
);

y += 5;


// ==================================================
// PROPERTY DESCRIPTION
// ==================================================

addParagraph(
    "All that constructed portion being a Residential unit bearing " +
    "Apartment/Flat No. " +
    (flatNumber || "-") +
    ", situated in the premises described below."
);

y += 3;


// ==================================================
// PROPERTY DETAILS
// ==================================================

addRow(
    "Flat No:",
    flatNumber || "-"
);

addRow(
    "Building:",
    buildingName || "-"
);

addRow(
    "Wing:",
    wing || "-"
);

addRow(
    "Project:",
    projectName || "-"
);

addRow(
    "Floor:",
    floor || "-"
);

addRow(
    "Built-up Area:",
    area ? area + " Square Feet" : "-"
);

addRow(
    "Survey Number:",
    surveyNumber || "-"
);

addRow(
    "CTS Number:",
    ctsNumber || "-"
);

addRow(
    "Road / Location:",
    propertyAddress || "-"
);

addRow(
    "Village:",
    village || "-"
);

addRow(
    "Taluka:",
    taluka || "-"
);

addRow(
    "District:",
    district || "-"
);

addRow(
    "PIN Code:",
    pinCode || "-"
);

y += 8;


    // ==================================================
    // FINANCIAL DETAILS
    // ==================================================

    checkPage(30);

    addHeading(
        "FINANCIAL DETAILS"
    );

    addRow(
    "Monthly License Fee:",
    rent ? "Rs. " + rent : "-"
);

addRow(
    "Security Deposit:",
    deposit ? "Rs. " + deposit : "-"
);

addRow(
    "Maintenance Charges:",
    maintenance && maintenance !== "0"
        ? "Rs. " + maintenance + " per month"
        : "-"
);

addRow(
    "Lock-in Period:",
    getValue("lockIn") && getValue("lockIn") !== "0"
        ? getValue("lockIn") + " Months"
        : "-"
);

addRow(
    "Notice Period:",
    getValue("noticePeriod") && getValue("noticePeriod") !== "0"
        ? getValue("noticePeriod") + " Days"
        : "-"
);


    // ==================================================
    // PROPERTY DETAILS
    // ==================================================

    checkPage(30);

    addHeading(
        "PROPERTY DETAILS"
    );

    addRow(
        "Project:",
        projectName
    );

    addRow(
        "Flat No:",
        flatNumber
    );

    addRow(
        "Building:",
        buildingName
    );

    addRow(
        "Wing:",
        wing
    );

    addRow(
        "Floor:",
        floor
    );

    addRow(
        "Area:",
        area ? area + " Sq.ft." : "-"
    );

    addRow(
        "Survey No:",
        surveyNumber
    );

    addRow(
        "CTS No:",
        ctsNumber
    );

    addRow(
        "Village:",
        village
    );

    addRow(
        "Taluka:",
        taluka
    );

    addRow(
        "District:",
        district
    );

    addRow(
        "PIN Code:",
        pinCode
    );

    addRow(
        "Address:",
        propertyAddress
    );


    // ==================================================
    // REGISTRATION DETAILS
    // ==================================================

    checkPage(30);

    addHeading(
        "REGISTRATION DETAILS"
    );

    addRow(
        "Stamp Duty:",
        "Rs. " + (stampDuty || "-")
    );

    addRow(
        "Registration Fee:",
        "Rs. " + (registrationFee || "-")
    );

    addRow(
        "Agreement Charges:",
        "Rs. " + (agreementCharges || "-")
    );

    addRow(
        "Brokerage:",
        "Rs. " + (brokerage || "-")
    );


    // ==================================================
    // WITNESS DETAILS
    // ==================================================

    checkPage(40);

    addHeading(
        "WITNESS DETAILS"
    );

    addRow(
        "Witness 1:",
        witness1Name
    );

    addRow(
        "Mobile 1:",
        witness1Mobile
    );

    addRow(
        "Witness 2:",
        witness2Name
    );

    addRow(
        "Mobile 2:",
        witness2Mobile
    );


    // ==================================================
    // IN WITNESS WHEREOF
    // ==================================================

    checkPage(70);

    addCenterHeading(
        "IN WITNESS WHEREOF",
        12
    );

    addParagraph(
        "The parties hereto have set and subscribed their respective signatures by way of electronic signature hereto in the presence of witnesses on the day, month and year mentioned above."
    );


// ==================================================
// SIGNATURES
// ==================================================

checkPage(80);

y += 10;

doc.setFontSize(10);

doc.setFont(
    "helvetica",
    "bold"
);

// Signature headings

doc.text(
    "LICENSOR",
    55,
    y,
    { align: "center" }
);

doc.text(
    "LICENSEE",
    pageWidth - 55,
    y,
    { align: "center" }
);

y += 25;

// Signature lines

doc.setLineWidth(0.5);

doc.line(
    25,
    y,
    85,
    y
);

doc.line(
    pageWidth - 85,
    y,
    pageWidth - 25,
    y
);

y += 7;

// Names

doc.setFont(
    "helvetica",
    "normal"
);

doc.text(
    ownerName || "Licensor",
    55,
    y,
    { align: "center" }
);

doc.text(
    tenantName || "Licensee",
    pageWidth - 55,
    y,
    { align: "center" }
);

y += 20;


// ==================================================
// WITNESS SIGNATURES
// ==================================================

doc.setFont(
    "helvetica",
    "bold"
);

doc.text(
    "WITNESS 1",
    55,
    y,
    { align: "center" }
);

doc.text(
    "WITNESS 2",
    pageWidth - 55,
    y,
    { align: "center" }
);

y += 20;

// Witness signature lines

doc.line(
    25,
    y,
    85,
    y
);

doc.line(
    pageWidth - 85,
    y,
    pageWidth - 25,
    y
);

y += 7;

doc.setFont(
    "helvetica",
    "normal"
);

doc.text(
    witness1Name || "Witness 1",
    55,
    y,
    { align: "center" }
);

doc.text(
    witness2Name || "Witness 2",
    pageWidth - 55,
    y,
    { align: "center" }
);

    // ==================================================
    // AGREEMENT NUMBER
    // ==================================================

    y += 20;

    addParagraph(
        "Agreement No: " +
        (agreementNumber || "-")
    );


    // ==================================================
    // FOOTER
    // ==================================================

    const totalPages =
        doc.internal.getNumberOfPages();


    for (
        let i = 1;
        i <= totalPages;
        i++
    ) {

        doc.setPage(i);

        doc.setFontSize(8);

        doc.setFont(
            "helvetica",
            "normal"
        );

        doc.text(
            "Agreement Hub",
            20,
            pageHeight - 10
        );

        doc.text(
            "Page " +
            i +
            " of " +
            totalPages,
            pageWidth - 20,
            pageHeight - 10,
            {
                align: "right"
            }
        );
    }


    // ==================================================
    // SAVE PDF
    // ==================================================

    doc.save(
        "Agreement-" +
        (agreementNumber || "Document") +
        ".pdf"
    );
}


// ======================================================
// MAKE FUNCTION AVAILABLE TO HTML
// ======================================================

window.generatePDF =
    generateProfessionalPDF;