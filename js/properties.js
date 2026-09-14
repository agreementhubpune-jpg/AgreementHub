import { db, auth } from "./firebase.js";

import {
    collection,
    getDocs,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";


let properties = [];


const tbody =
    document.querySelector(
        "#propertyTable tbody"
    );

const searchInput =
    document.getElementById(
        "propertySearch"
    );

const statusFilter =
    document.getElementById(
        "propertyStatusFilter"
    );

const propertyModal =
    document.getElementById(
        "propertyModal"
    );

const propertyForm =
    document.getElementById(
        "propertyForm"
    );


/* ==========================================
   LOGIN PROTECTION
========================================== */

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            window.location.href =
                "login.html";

            return;
        }

        await loadProperties();

    }
);


/* ==========================================
   HELPERS
========================================== */

function numberValue(value) {

    const number =
        Number(value || 0);

    return Number.isFinite(number)
        ? number
        : 0;

}


function money(value) {

    return "₹" +
        numberValue(value)
            .toLocaleString(
                "en-IN"
            );

}


function normalizeMobile(value) {

    return String(
        value || ""
    )
        .replace(/\D/g, "")
        .slice(-10);

}


/* ==========================================
   PROPERTY ID
========================================== */

function getNextPropertyId() {

    let highest = 0;

    properties.forEach(
        (property) => {

            const match =
                String(
                    property.propertyId ||
                    ""
                ).match(
                    /^PROP-(\d+)$/
                );

            if (!match) {
                return;
            }

            const serial =
                Number(match[1]);

            if (serial > highest) {
                highest = serial;
            }

        }
    );

    return (
        "PROP-" +
        String(
            highest + 1
        ).padStart(
            4,
            "0"
        )
    );

}


/* ==========================================
   LOAD PROPERTIES
========================================== */

async function loadProperties() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "properties"
                )
            );

        properties =
            snapshot.docs.map(
                (document) => ({
                    id:
                        document.id,

                    ...document.data()
                })
            );

        updateSummary();

        renderProperties();

    } catch (error) {

        console.error(
            "Properties Load Error:",
            error
        );

        tbody.innerHTML = `
            <tr>
                <td
                    colspan="11"
                    class="empty-row"
                >
                    Unable to load properties.
                </td>
            </tr>
        `;

    }

}


/* ==========================================
   SUMMARY
========================================== */

function updateSummary() {

    let availableCount = 0;
    let occupiedCount = 0;

    properties.forEach(
        (property) => {

            const status =
                String(
                    property.status ||
                    "available"
                ).toLowerCase();

            if (
                status ===
                "occupied"
            ) {

                occupiedCount++;

            } else {

                availableCount++;

            }

        }
    );


    document.getElementById(
        "totalProperties"
    ).textContent =
        properties.length;


    document.getElementById(
        "availableProperties"
    ).textContent =
        availableCount;


    document.getElementById(
        "occupiedProperties"
    ).textContent =
        occupiedCount;

}


/* ==========================================
   FILTER
========================================== */

function getFilteredProperties() {

    const searchValue =
        searchInput.value
            .trim()
            .toLowerCase();

    const selectedStatus =
        statusFilter.value;


    return properties.filter(
        (property) => {

            const status =
                String(
                    property.status ||
                    "available"
                ).toLowerCase();


            if (
                selectedStatus !== "all" &&
                status !== selectedStatus
            ) {

                return false;

            }


            if (searchValue) {

                const searchableText =
                    [
                        property.propertyId,
                        property.ownerName,
                        property.ownerMobile,
                        property.propertyType,
                        property.projectName,
                        property.flatNumber,
                        property.area,
                        property.address
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
   RENDER TABLE
========================================== */

function renderProperties() {

    const filtered =
        getFilteredProperties();


    document.getElementById(
        "propertyCount"
    ).textContent =
        filtered.length +
        (
            filtered.length === 1
                ? " Property"
                : " Properties"
        );


    tbody.innerHTML = "";


    if (!filtered.length) {

        tbody.innerHTML = `
            <tr>
                <td
                    colspan="11"
                    class="empty-row"
                >
                    No properties found.
                </td>
            </tr>
        `;

        return;

    }


    filtered.forEach(
        (property) => {

            const row =
                document.createElement(
                    "tr"
                );


            const status =
                String(
                    property.status ||
                    "available"
                ).toLowerCase();


            row.innerHTML = `

                <td>
                    ${escapeHtml(
                        property.propertyId ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        property.ownerName ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        property.ownerMobile ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        property.propertyType ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        property.projectName ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        property.flatNumber ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        property.area ||
                        "-"
                    )}
                </td>

                <td>
                    ${money(
                        property.monthlyRent
                    )}
                </td>

                <td>
                    ${money(
                        property.securityDeposit
                    )}
                </td>

                <td>

                    <span
                        class="
                            property-status
                            ${status}
                        "
                    >
                        ${
                            status ===
                            "occupied"
                                ? "Occupied"
                                : "Available"
                        }
                    </span>

                </td>

                <td>

                    <button
                        type="button"
                        class="
                            property-action-btn
                            edit
                        "
                        data-action="edit"
                        data-id="${property.id}"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        class="
                            property-action-btn
                            delete
                        "
                        data-action="delete"
                        data-id="${property.id}"
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


/* ==========================================
   OPEN ADD MODAL
========================================== */

document.getElementById(
    "addPropertyBtn"
).addEventListener(
    "click",
    () => {

        propertyForm.reset();

        document.getElementById(
            "editingPropertyId"
        ).value = "";

        document.getElementById(
            "propertyStatus"
        ).value =
            "available";

        document.getElementById(
            "propertyModalTitle"
        ).textContent =
            "Add Property";

        propertyModal.classList.add(
            "show"
        );

    }
);


/* ==========================================
   CLOSE MODAL
========================================== */

function closePropertyModal() {

    propertyModal.classList.remove(
        "show"
    );

}


document.getElementById(
    "closePropertyModal"
).addEventListener(
    "click",
    closePropertyModal
);


document.getElementById(
    "cancelPropertyBtn"
).addEventListener(
    "click",
    closePropertyModal
);


propertyModal.addEventListener(
    "click",
    (event) => {

        if (
            event.target ===
            propertyModal
        ) {

            closePropertyModal();

        }

    }
);


/* ==========================================
   SAVE PROPERTY
========================================== */

propertyForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const editingId =
            document.getElementById(
                "editingPropertyId"
            ).value;


        const ownerName =
            document.getElementById(
                "ownerName"
            ).value.trim();


        const ownerMobile =
            normalizeMobile(
                document.getElementById(
                    "ownerMobile"
                ).value
            );


        if (
            ownerMobile.length !== 10
        ) {

            alert(
                "Please enter a valid 10 digit owner mobile number."
            );

            return;

        }


        const data = {

            ownerName,

            ownerMobile,

            propertyType:
                document.getElementById(
                    "propertyType"
                ).value,

            projectName:
                document.getElementById(
                    "projectName"
                ).value.trim(),

            flatNumber:
                document.getElementById(
                    "flatNumber"
                ).value.trim(),

            area:
                document.getElementById(
                    "area"
                ).value.trim(),

            monthlyRent:
                numberValue(
                    document.getElementById(
                        "monthlyRent"
                    ).value
                ),

            securityDeposit:
                numberValue(
                    document.getElementById(
                        "securityDeposit"
                    ).value
                ),

            status:
                document.getElementById(
                    "propertyStatus"
                ).value,

            address:
                document.getElementById(
                    "propertyAddress"
                ).value.trim(),

            updatedAt:
                serverTimestamp()

        };


        try {

            if (editingId) {

                await updateDoc(
                    doc(
                        db,
                        "properties",
                        editingId
                    ),
                    data
                );

            } else {

                const propertyId =
                    getNextPropertyId();


                const newRef =
                    doc(
                        collection(
                            db,
                            "properties"
                        )
                    );


                await setDoc(
                    newRef,
                    {
                        ...data,

                        propertyId,

                        createdAt:
                            serverTimestamp()
                    }
                );

            }


            closePropertyModal();

            await loadProperties();


        } catch (error) {

            console.error(
                "Property Save Error:",
                error
            );

            alert(
                "Property save failed: " +
                error.message
            );

        }

    }
);


/* ==========================================
   TABLE ACTIONS
========================================== */

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


        const property =
            properties.find(
                (item) =>
                    item.id ===
                    button.dataset.id
            );


        if (!property) {
            return;
        }


        /* EDIT */

        if (
            button.dataset.action ===
            "edit"
        ) {

            document.getElementById(
                "editingPropertyId"
            ).value =
                property.id;


            document.getElementById(
                "ownerName"
            ).value =
                property.ownerName ||
                "";


            document.getElementById(
                "ownerMobile"
            ).value =
                property.ownerMobile ||
                "";


            document.getElementById(
                "propertyType"
            ).value =
                property.propertyType ||
                "";


            document.getElementById(
                "projectName"
            ).value =
                property.projectName ||
                "";


            document.getElementById(
                "flatNumber"
            ).value =
                property.flatNumber ||
                "";


            document.getElementById(
                "area"
            ).value =
                property.area ||
                "";


            document.getElementById(
                "monthlyRent"
            ).value =
                property.monthlyRent ||
                0;


            document.getElementById(
                "securityDeposit"
            ).value =
                property.securityDeposit ||
                0;


            document.getElementById(
                "propertyStatus"
            ).value =
                property.status ||
                "available";


            document.getElementById(
                "propertyAddress"
            ).value =
                property.address ||
                "";


            document.getElementById(
                "propertyModalTitle"
            ).textContent =
                "Edit Property";


            propertyModal.classList.add(
                "show"
            );

        }


        /* DELETE */

        if (
            button.dataset.action ===
            "delete"
        ) {

            const confirmed =
                confirm(
                    "Are you sure you want to delete this property?"
                );


            if (!confirmed) {
                return;
            }


            try {

                await deleteDoc(
                    doc(
                        db,
                        "properties",
                        property.id
                    )
                );


                await loadProperties();


            } catch (error) {

                console.error(
                    "Property Delete Error:",
                    error
                );


                alert(
                    "Property delete failed: " +
                    error.message
                );

            }

        }

    }
);


/* ==========================================
   SEARCH + FILTER
========================================== */

searchInput.addEventListener(
    "input",
    renderProperties
);


statusFilter.addEventListener(
    "change",
    renderProperties
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