import { db, auth } from "./firebase.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { onAuthStateChanged, updatePassword, signOut } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const loginEmail = document.getElementById("loginEmail");
const businessFields = ["businessName","ownerName","mobileNumber","businessEmail","whatsappNumber","officeAddress"];
const agreementFields = ["defaultAgreementPeriod","rentDueDate","defaultServiceCharge","renewalAlertDays","defaultRentIncrease","defaultCity"];

onAuthStateChanged(auth, async user => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }
    loginEmail.textContent = user.email || "Email not available";
    await loadDoc("profile", businessFields);
    await loadDoc("agreementDefaults", agreementFields);
});

async function loadDoc(name, fields) {
    try {
        const snap = await getDoc(doc(db,"companySettings",name));
        if (!snap.exists()) return;
        const data = snap.data();
        fields.forEach(id => {
            const el = document.getElementById(id);
            if (el && data[id] !== undefined) el.value = data[id];
        });
    } catch (error) {
        console.error(error);
    }
}

async function saveDoc(name, fields, messageEl) {
    const user = auth.currentUser;
    if (!user) return;

    const data = {};
    fields.forEach(id => data[id] = document.getElementById(id).value.trim());

    // numeric settings
    ["defaultAgreementPeriod","rentDueDate","defaultServiceCharge","renewalAlertDays","defaultRentIncrease"].forEach(k => {
        if (k in data) data[k] = Number(data[k]);
    });

    try {
        await setDoc(doc(db,"companySettings",name), {
            ...data, updatedAt:new Date().toISOString(), updatedBy:user.uid
        }, {merge:true});
        messageEl.style.color = "green";
        messageEl.textContent = name === "profile" ? "Business Profile saved successfully." : "Agreement Settings saved successfully.";
    } catch (error) {
        messageEl.style.color = "red";
        messageEl.textContent = error.message;
    }
}

document.getElementById("saveBusinessBtn").addEventListener("click", () => {
    saveDoc("profile", businessFields, document.getElementById("businessMessage"));
});

document.getElementById("saveAgreementSettingsBtn").addEventListener("click", () => {
    saveDoc("agreementDefaults", agreementFields, document.getElementById("agreementSettingsMessage"));
});

const passwordForm = document.getElementById("passwordForm");
document.getElementById("changePasswordBtn").addEventListener("click", () => passwordForm.style.display = "block");
document.getElementById("cancelPasswordBtn").addEventListener("click", () => passwordForm.style.display = "none");

document.getElementById("savePasswordBtn").addEventListener("click", async () => {
    const msg = document.getElementById("passwordMessage");
    const p1 = document.getElementById("newPassword").value;
    const p2 = document.getElementById("confirmPassword").value;

    if (p1.length < 6) { msg.style.color="red"; msg.textContent="Password must be at least 6 characters."; return; }
    if (p1 !== p2) { msg.style.color="red"; msg.textContent="Passwords do not match."; return; }

    try {
        await updatePassword(auth.currentUser, p1);
        msg.style.color="green";
        msg.textContent="Password changed successfully.";
    } catch (error) {
        msg.style.color="red";
        msg.textContent = error.code === "auth/requires-recent-login"
            ? "Please Logout and Login again before changing your password."
            : error.message;
    }
});

document.getElementById("dashboardBtn").addEventListener("click", () => window.location.href="dashboard.html");
document.getElementById("logoutBtn").addEventListener("click", async () => {
    await signOut(auth);
    window.location.href="login.html";
});
