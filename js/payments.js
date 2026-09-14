// ==========================================
// AGREEMENT HUB - PAYMENTS MODULE
// ==========================================

import {
    db,
    auth
} from "./firebase.js";


import {
    collection,
    getDocs,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";



// ==========================================
// GLOBAL DATA
// ==========================================

let agreements = [];

let selectedAgreementId = null;


const tbody =
    document.querySelector(
        "#paymentTable tbody"
    );


const searchInput =
    document.getElementById(
        "searchInput"
    );


const paymentFilter =
    document.getElementById(
        "paymentFilter"
    );


const modal =
    document.getElementById(
        "paymentModal"
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


        await loadPayments();

    }
);



// ==========================================
// NUMBER
// ==========================================

function numberValue(
    value
) {

    const number =
        Number(
            value || 0
        );


    if (
        Number.isNaN(
            number
        )
    ) {

        return 0;

    }


    return number;

}



// ==========================================
// BUSINESS DUE
// ==========================================

function calculateBusinessDue(
    agreement
) {

    const serviceCharge =
        numberValue(
            agreement.serviceCharge
        );


    const brokerage =
        numberValue(
            agreement.brokerage
        );


    /*
        IMPORTANT

        Rent = NOT Revenue

        Deposit = NOT Revenue

        Agreement Charges =
        Internal Reference Only

        Business Due =
        Service Charge + Brokerage
    */


    return (
        serviceCharge +
        brokerage
    );

}



// ==========================================
// PAYMENT STATUS
// ==========================================

function getPaymentStatus(
    agreement
) {

    const due =
        calculateBusinessDue(
            agreement
        );


    const received =
        numberValue(
            agreement.amountReceived
        );


    if (
        due <= 0
    ) {

        return {

            key:
                "paid",

            text:
                "No Due"

        };

    }


    if (
        received <= 0
    ) {

        return {

            key:
                "pending",

            text:
                "Pending"

        };

    }


    if (
        received >= due
    ) {

        return {

            key:
                "paid",

            text:
                "Paid"

        };

    }


    return {

        key:
            "partial",

        text:
            "Partially Paid"

    };

}



// ==========================================
// LOAD PAYMENTS
// ==========================================

async function loadPayments() {

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
                document => {

                    return {

                        id:
                            document.id,

                        ...document.data()

                    };

                }
            );


        /*
            Latest agreements first
        */

        agreements.sort(
            (
                a,
                b
            ) => {

                return String(
                    b.updatedAt ||
                    b.createdAt ||
                    ""
                ).localeCompare(
                    String(
                        a.updatedAt ||
                        a.createdAt ||
                        ""
                    )
                );

            }
        );


        updateSummary();


        renderPayments();


    } catch (error) {

        console.error(
            "PAYMENT LOAD ERROR:",
            error
        );

    }

}



// ==========================================
// SUMMARY
// ==========================================

function updateSummary() {

    let totalBusinessAmount =
        0;

    let totalReceived =
        0;

    let totalPending =
        0;

    let paidAgreements =
        0;


    agreements.forEach(
        agreement => {


            const due =
                calculateBusinessDue(
                    agreement
                );


            const received =
                numberValue(
                    agreement.amountReceived
                );


            const pending =
                Math.max(
                    due -
                    received,
                    0
                );


            const status =
                getPaymentStatus(
                    agreement
                );


            totalBusinessAmount +=
                due;


            totalReceived +=
                Math.min(
                    received,
                    due
                );


            totalPending +=
                pending;


            if (
                status.key ===
                "paid" &&
                due > 0
            ) {

                paidAgreements++;

            }

        }
    );


    document.getElementById(
        "totalBusinessAmount"
    ).textContent =

        formatCurrency(
            totalBusinessAmount
        );


    document.getElementById(
        "totalReceived"
    ).textContent =

        formatCurrency(
            totalReceived
        );


    document.getElementById(
        "totalPending"
    ).textContent =

        formatCurrency(
            totalPending
        );


    document.getElementById(
        "paidAgreements"
    ).textContent =

        paidAgreements;

}



// ==========================================
// RENDER TABLE
// ==========================================

function renderPayments() {

    const search =
        searchInput
            .value
            .trim()
            .toLowerCase();


    const selectedFilter =
        paymentFilter.value;


    tbody.innerHTML = "";


    agreements.forEach(
        agreement => {


            const status =
                getPaymentStatus(
                    agreement
                );


            if (
                selectedFilter !==
                    "all" &&
                status.key !==
                    selectedFilter
            ) {

                return;

            }


            const searchableText =
                [

                    agreement
                        .agreementNumber,

                    agreement.tenant,

                    agreement.mobile,

                    agreement
                        .projectName

                ]
                    .join(" ")
                    .toLowerCase();


            if (
                search &&
                !searchableText
                    .includes(
                        search
                    )
            ) {

                return;

            }



            const serviceCharge =
                numberValue(
                    agreement
                        .serviceCharge
                );


            const agreementCharges =
                numberValue(
                    agreement
                        .agreementCharges
                );


            const brokerage =
                numberValue(
                    agreement
                        .brokerage
                );


            const businessDue =
                calculateBusinessDue(
                    agreement
                );


            const amountReceived =
                numberValue(
                    agreement
                        .amountReceived
                );


            const pending =
                Math.max(
                    businessDue -
                    amountReceived,
                    0
                );


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
                            agreement.tenant ||
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
                        formatCurrency(
                            serviceCharge
                        )
                    }

                </td>


                <td>

                    ${
                        formatCurrency(
                            agreementCharges
                        )
                    }

                </td>


                <td>

                    ${
                        formatCurrency(
                            brokerage
                        )
                    }

                </td>


                <td>

                    <strong>

                        ${
                            formatCurrency(
                                businessDue
                            )
                        }

                    </strong>

                </td>


                <td>

                    ${
                        formatCurrency(
                            amountReceived
                        )
                    }

                </td>


                <td>

                    ${
                        formatCurrency(
                            pending
                        )
                    }

                </td>


                <td>

                    <span
                        class="
                            payment-status
                            ${status.key}
                        "
                    >

                        ${status.text}

                    </span>

                </td>


                <td>

                    ${
                        escapeHtml(
                            agreement
                                .paymentDate ||
                            "-"
                        )
                    }

                </td>


                <td>

                    <button
                        class="edit-payment-btn"
                        data-id="${
                            agreement.id
                        }"
                    >

                        Update

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
// OPEN MODAL
// ==========================================

tbody.addEventListener(
    "click",
    event => {


        const button =
            event.target.closest(
                ".edit-payment-btn"
            );


        if (!button) {

            return;

        }


        const id =
            button.dataset.id;


        const agreement =
            agreements.find(
                item =>
                    item.id === id
            );


        if (!agreement) {

            return;

        }


        selectedAgreementId =
            id;


        const businessDue =
            calculateBusinessDue(
                agreement
            );


        const received =
            numberValue(
                agreement
                    .amountReceived
            );


        document.getElementById(
            "modalAgreementNo"
        ).textContent =

            agreement
                .agreementNumber ||
            "Agreement";


        document.getElementById(
            "modalBusinessDue"
        ).textContent =

            formatCurrency(
                businessDue
            );


        document.getElementById(
            "modalCurrentReceived"
        ).textContent =

            formatCurrency(
                received
            );


        document.getElementById(
            "amountReceived"
        ).value =

            received || "";


        document.getElementById(
            "paymentDate"
        ).value =

            agreement
                .paymentDate ||
            "";


        document.getElementById(
            "paymentNote"
        ).value =

            agreement
                .paymentNote ||
            "";


        document.getElementById(
            "paymentMessage"
        ).textContent =
            "";


        modal.classList.add(
            "show"
        );

    }
);



// ==========================================
// CLOSE MODAL
// ==========================================

function closeModal() {

    modal.classList.remove(
        "show"
    );


    selectedAgreementId =
        null;

}


document.getElementById(
    "closeModalBtn"
).addEventListener(
    "click",
    closeModal
);


document.getElementById(
    "cancelPaymentBtn"
).addEventListener(
    "click",
    closeModal
);


modal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            modal
        ) {

            closeModal();

        }

    }
);



// ==========================================
// SAVE PAYMENT
// ==========================================

document.getElementById(
    "savePaymentBtn"
).addEventListener(
    "click",
    async () => {


        if (
            !selectedAgreementId
        ) {

            return;

        }


        const agreement =
            agreements.find(
                item =>
                    item.id ===
                    selectedAgreementId
            );


        if (
            !agreement
        ) {

            return;

        }


        const amountReceived =
            numberValue(
                document
                    .getElementById(
                        "amountReceived"
                    )
                    .value
            );


        const paymentDate =
            document
                .getElementById(
                    "paymentDate"
                )
                .value;


        const paymentNote =
            document
                .getElementById(
                    "paymentNote"
                )
                .value
                .trim();


        const businessDue =
            calculateBusinessDue(
                agreement
            );


        const pendingAmount =
            Math.max(
                businessDue -
                amountReceived,
                0
            );


        let paymentStatus =
            "Pending";


        if (
            amountReceived >=
                businessDue &&
            businessDue > 0
        ) {

            paymentStatus =
                "Paid";

        }

        else if (
            amountReceived > 0
        ) {

            paymentStatus =
                "Partially Paid";

        }


        try {

            const agreementRef =
                doc(
                    db,
                    "agreements",
                    selectedAgreementId
                );


            await updateDoc(
                agreementRef,
                {

                    amountReceived:
                        amountReceived,

                    pendingAmount:
                        pendingAmount,

                    paymentStatus:
                        paymentStatus,

                    paymentDate:
                        paymentDate,

                    paymentNote:
                        paymentNote,

                    paymentUpdatedAt:
                        new Date()
                            .toISOString()

                }
            );


            const message =
                document.getElementById(
                    "paymentMessage"
                );


            message.style.color =
                "green";


            message.textContent =
                "Payment updated successfully.";


            await loadPayments();


            setTimeout(
                () => {

                    closeModal();

                },
                500
            );


        } catch (error) {

            console.error(
                "PAYMENT UPDATE ERROR:",
                error
            );


            const message =
                document.getElementById(
                    "paymentMessage"
                );


            message.style.color =
                "red";


            message.textContent =
                "Payment Update Failed: " +
                error.message;

        }

    }
);



// ==========================================
// SEARCH / FILTER
// ==========================================

searchInput.addEventListener(
    "input",
    renderPayments
);


paymentFilter.addEventListener(
    "change",
    renderPayments
);



// ==========================================
// CURRENCY FORMAT
// ==========================================

function formatCurrency(
    number
) {

    return (
        "₹" +
        numberValue(
            number
        ).toLocaleString(
            "en-IN"
        )
    );

}



// ==========================================
// SAFE HTML
// ==========================================

function escapeHtml(
    value
) {

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