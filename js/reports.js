import { db, auth } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";


let agreements = [];

const monthFilter =
    document.getElementById("monthFilter");

const yearFilter =
    document.getElementById("yearFilter");

const reportSearch =
    document.getElementById("reportSearch");

const tbody =
    document.querySelector("#reportTable tbody");


/* ==========================================
   LOGIN PROTECTION
========================================== */

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    await loadReports();

});


/* ==========================================
   NUMBER
========================================== */

function numberValue(value) {

    const number = Number(value || 0);

    return Number.isFinite(number)
        ? number
        : 0;

}


/* ==========================================
   MONEY
========================================== */

function money(value) {

    return "₹" +
        numberValue(value).toLocaleString(
            "en-IN"
        );

}


/* ==========================================
   BUSINESS DUE
   Revenue = Service Charge + Brokerage
========================================== */

function calculateBusinessDue(agreement) {

    return (
        numberValue(agreement.serviceCharge) +
        numberValue(agreement.brokerage)
    );

}


/* ==========================================
   PAYMENT VALUES
========================================== */

function getPaymentValues(agreement) {

    const businessDue =
        calculateBusinessDue(agreement);

    const rawReceived =
        Math.max(
            numberValue(
                agreement.amountReceived
            ),
            0
        );

    const received =
        Math.min(
            rawReceived,
            businessDue
        );

    const pending =
        Math.max(
            businessDue - received,
            0
        );

    let status = "No Due";
    let statusClass = "no-due";

    if (businessDue > 0) {

        if (received <= 0) {

            status = "Pending";
            statusClass = "pending";

        } else if (received >= businessDue) {

            status = "Paid";
            statusClass = "paid";

        } else {

            status = "Partially Paid";
            statusClass = "partial";

        }

    }

    return {
        businessDue,
        received,
        pending,
        status,
        statusClass
    };

}


/* ==========================================
   REPORT DATE
========================================== */

function getAgreementDate(agreement) {

    const possibleDates = [
        agreement.createdAt,
        agreement.entryDate,
        agreement.startDate
    ];

    for (const value of possibleDates) {

        if (!value) {
            continue;
        }

        if (
            typeof value === "object" &&
            typeof value.toDate === "function"
        ) {

            const date = value.toDate();

            if (!Number.isNaN(date.getTime())) {
                return date;
            }

        }

        const text =
            String(value).slice(0, 10);

        const date =
            new Date(text + "T00:00:00");

        if (!Number.isNaN(date.getTime())) {
            return date;
        }

    }

    return null;

}


/* ==========================================
   LOAD REPORTS
========================================== */

async function loadReports() {

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
                (document) => ({
                    id: document.id,
                    ...document.data()
                })
            );

        populateYears();

        renderReports();

    } catch (error) {

        console.error(
            "Reports Load Error:",
            error
        );

        tbody.innerHTML = `
            <tr>
                <td
                    colspan="10"
                    class="empty-row"
                >
                    Unable to load reports.
                </td>
            </tr>
        `;

    }

}


/* ==========================================
   YEAR FILTER
========================================== */

function populateYears() {

    const years = new Set();

    agreements.forEach(
        (agreement) => {

            const date =
                getAgreementDate(
                    agreement
                );

            if (date) {
                years.add(
                    date.getFullYear()
                );
            }

        }
    );

    const sortedYears =
        [...years].sort(
            (a, b) => b - a
        );

    yearFilter.innerHTML = `
        <option value="all">
            All Years
        </option>
    `;

    sortedYears.forEach(
        (year) => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                String(year);

            option.textContent =
                String(year);

            yearFilter.appendChild(
                option
            );

        }
    );

}


/* ==========================================
   FILTER DATA
========================================== */

function getFilteredAgreements() {

    const selectedMonth =
        monthFilter.value;

    const selectedYear =
        yearFilter.value;

    const searchValue =
        reportSearch.value
            .trim()
            .toLowerCase();

    return agreements.filter(
        (agreement) => {

            const date =
                getAgreementDate(
                    agreement
                );

            if (
                selectedYear !== "all"
            ) {

                if (
                    !date ||
                    String(
                        date.getFullYear()
                    ) !== selectedYear
                ) {
                    return false;
                }

            }

            if (
                selectedMonth !== "all"
            ) {

                if (!date) {
                    return false;
                }

                const month =
                    String(
                        date.getMonth() + 1
                    ).padStart(
                        2,
                        "0"
                    );

                if (
                    month !== selectedMonth
                ) {
                    return false;
                }

            }

            if (searchValue) {

                const searchableText = [
                    agreement.agreementNumber,
                    agreement.owner,
                    agreement.tenant,
                    agreement.mobile,
                    agreement.projectName
                ]
                    .join(" ")
                    .toLowerCase();

                if (
                    !searchableText.includes(
                        searchValue
                    )
                ) {
                    return false;
                }

            }

            return true;

        }
    );

}


/* ==========================================
   RENDER REPORT
========================================== */

function renderReports() {

    const filtered =
        getFilteredAgreements();

    let totalBusinessCharges = 0;
    let totalReceived = 0;
    let totalPending = 0;
    let fullyPaidCount = 0;

    filtered.forEach(
        (agreement) => {

            const payment =
                getPaymentValues(
                    agreement
                );

            totalBusinessCharges +=
                payment.businessDue;

            totalReceived +=
                payment.received;

            totalPending +=
                payment.pending;

            if (
                payment.businessDue > 0 &&
                payment.received >=
                    payment.businessDue
            ) {
                fullyPaidCount++;
            }

        }
    );


    document.getElementById(
        "reportBusinessCharges"
    ).textContent =
        money(totalBusinessCharges);


    document.getElementById(
        "reportReceived"
    ).textContent =
        money(totalReceived);


    document.getElementById(
        "reportPending"
    ).textContent =
        money(totalPending);


    document.getElementById(
        "reportFullyPaid"
    ).textContent =
        fullyPaidCount;


    document.getElementById(
        "reportCount"
    ).textContent =
        filtered.length +
        (
            filtered.length === 1
                ? " Agreement"
                : " Agreements"
        );


    renderTable(filtered);

}


/* ==========================================
   RENDER TABLE
========================================== */

function renderTable(items) {

    tbody.innerHTML = "";

    if (!items.length) {

        tbody.innerHTML = `
            <tr>
                <td
                    colspan="10"
                    class="empty-row"
                >
                    No report data found.
                </td>
            </tr>
        `;

        return;

    }


    const sortedItems =
        [...items].sort(
            (a, b) => {

                const dateA =
                    getAgreementDate(a);

                const dateB =
                    getAgreementDate(b);

                return (
                    (dateB?.getTime() || 0) -
                    (dateA?.getTime() || 0)
                );

            }
        );


    sortedItems.forEach(
        (agreement) => {

            const payment =
                getPaymentValues(
                    agreement
                );

            const date =
                getAgreementDate(
                    agreement
                );

            const displayDate =
                date
                    ? date.toLocaleDateString(
                        "en-GB"
                    )
                    : "-";


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${escapeHtml(
                        agreement.agreementNumber ||
                        "-"
                    )}
                </td>

                <td>
                    ${displayDate}
                </td>

                <td>
                    ${escapeHtml(
                        agreement.tenant ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        agreement.projectName ||
                        "-"
                    )}
                </td>

                <td>
                    ${money(
                        agreement.serviceCharge
                    )}
                </td>

                <td>
                    ${money(
                        agreement.brokerage
                    )}
                </td>

                <td>
                    ${money(
                        payment.businessDue
                    )}
                </td>

                <td>
                    ${money(
                        payment.received
                    )}
                </td>

                <td>
                    ${money(
                        payment.pending
                    )}
                </td>

                <td>
                    <span
                        class="
                            report-status
                            ${payment.statusClass}
                        "
                    >
                        ${payment.status}
                    </span>
                </td>

            `;


            tbody.appendChild(
                row
            );

        }
    );

}


/* ==========================================
   FILTER EVENTS
========================================== */

monthFilter.addEventListener(
    "change",
    renderReports
);

yearFilter.addEventListener(
    "change",
    renderReports
);

reportSearch.addEventListener(
    "input",
    renderReports
);


/* ==========================================
   LOGOUT
========================================== */

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


/* ==========================================
   SAFE HTML
========================================== */

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

/* ==========================================
   EXPORT CSV
========================================== */

document.getElementById(
    "exportCsvBtn"
).addEventListener(
    "click",
    () => {

        const filtered =
            getFilteredAgreements();

        if (!filtered.length) {

            alert(
                "No report data available to export."
            );

            return;
        }

        const rows = [
            [
                "Agreement No",
                "Date",
                "Tenant",
                "Project",
                "Service Charge",
                "Brokerage",
                "Business Charges",
                "Amount Received",
                "Pending Amount",
                "Payment Status"
            ]
        ];


        filtered.forEach(
            (agreement) => {

                const payment =
                    getPaymentValues(
                        agreement
                    );

                const date =
                    getAgreementDate(
                        agreement
                    );

                const displayDate =
                    date
                        ? date.toLocaleDateString(
                            "en-GB"
                        )
                        : "";


                rows.push([
                    agreement.agreementNumber || "",
                    displayDate,
                    agreement.tenant || "",
                    agreement.projectName || "",
                    numberValue(
                        agreement.serviceCharge
                    ),
                    numberValue(
                        agreement.brokerage
                    ),
                    payment.businessDue,
                    payment.received,
                    payment.pending,
                    payment.status
                ]);

            }
        );


        const csv =
            rows.map(
                (row) =>
                    row.map(
                        (value) =>
                            '"' +
                            String(value)
                                .replaceAll(
                                    '"',
                                    '""'
                                ) +
                            '"'
                    ).join(",")
            ).join("\n");


        const blob =
            new Blob(
                [
                    "\uFEFF" +
                    csv
                ],
                {
                    type:
                        "text/csv;charset=utf-8;"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );

        link.href = url;

        link.download =
            "Agreement-Hub-Report.csv";

        document.body.appendChild(
            link
        );

        link.click();

        link.remove();

        URL.revokeObjectURL(
            url
        );

    }
);


/* ==========================================
   PRINT REPORT
========================================== */

document.getElementById(
    "printReportBtn"
).addEventListener(
    "click",
    () => {

        window.print();

    }
);