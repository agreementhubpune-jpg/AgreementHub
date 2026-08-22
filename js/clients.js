import { db, auth } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";


const clientForm =
    document.getElementById("clientForm");

const clientMsg =
    document.getElementById("clientMsg");

const tbody =
    document.querySelector("#clientTable tbody");

const clientSearch =
    document.getElementById("clientSearch");


let clients = [];


// ===============================
// AUTHENTICATION
// ===============================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html";

        return;
    }

    loadClients();

});


// ===============================
// SAVE CLIENT
// ===============================

clientForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const client = {

        clientName:
            document.getElementById("clientName").value.trim(),

        email:
            document.getElementById("clientEmail").value.trim(),

        mobile:
            document.getElementById("clientMobile").value.trim(),

        propertyAddress:
            document.getElementById("propertyAddress").value.trim(),

        status:
            document.getElementById("clientStatus").value,

        createdAt:
            new Date().toISOString()

    };


    try {

        await addDoc(
            collection(db, "clients"),
            client
        );

        clientMsg.innerText =
            "Client Saved Successfully!";

        clientMsg.style.color = "green";

        clientForm.reset();

        await loadClients();

    }

    catch (error) {

        console.error(
            "Client Save Error:",
            error
        );

        clientMsg.innerText =
            "Client Save Failed: " +
            error.message;

        clientMsg.style.color = "red";

    }

});


// ===============================
// LOAD CLIENTS
// ===============================

async function loadClients() {

    try {

        clients = [];

        tbody.innerHTML = "";

        const snapshot =
            await getDocs(
                collection(db, "clients")
            );

        snapshot.forEach((docSnap) => {

            clients.push({

                id: docSnap.id,

                ...docSnap.data()

            });

        });

        displayClients(clients);

        console.log(
            "Clients loaded:",
            clients
        );

    }

    catch (error) {

        console.error(
            "Client Load Error:",
            error
        );

    }

}


// ===============================
// DISPLAY CLIENTS
// ===============================

function displayClients(clientList) {

    tbody.innerHTML = "";

    clientList.forEach((client) => {

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>
                ${client.clientName || "-"}
            </td>

            <td>
                ${client.email || "-"}
            </td>

            <td>
                ${client.mobile || "-"}
            </td>

            <td>
                ${client.propertyAddress || "-"}
            </td>

            <td>
                ${client.status || "-"}
            </td>

        `;

        tbody.appendChild(row);

    });

}


// ===============================
// SEARCH
// ===============================

clientSearch.addEventListener("keyup", function () {

    const value =
        this.value.toLowerCase().trim();

    const filtered =
        clients.filter((client) => {

            const text = `
                ${client.clientName || ""}
                ${client.email || ""}
                ${client.mobile || ""}
                ${client.propertyAddress || ""}
                ${client.status || ""}
            `.toLowerCase();

            return text.includes(value);

        });

    displayClients(filtered);

});