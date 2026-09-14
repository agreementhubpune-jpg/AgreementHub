import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const form = document.getElementById("loginForm");
const btn = document.getElementById("loginBtn");
const msg = document.getElementById("msg");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        msg.textContent = "Please enter email and password.";
        return;
    }

    try {
        btn.disabled = true;
        btn.textContent = "Logging in...";
        msg.textContent = "";
        await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem("loggedIn", "true");
        window.location.href = "dashboard.html";
    } catch (error) {
        console.error(error);
        msg.textContent = error.message;
        btn.disabled = false;
        btn.textContent = "Login";
    }
});
