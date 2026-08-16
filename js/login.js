import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";


document.addEventListener("DOMContentLoaded", () => {

    const loginBtn = document.getElementById("loginBtn");

    loginBtn.addEventListener("click", async (e) => {

        e.preventDefault();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const msg =
            document.getElementById("msg");


        if (!email || !password) {

            msg.innerText =
                "Please enter email and password.";

            return;
        }


        try {

            loginBtn.disabled = true;

            loginBtn.innerText = "Logging in...";


            // Firebase Authentication Login

            const userCredential =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            console.log(
                "Firebase Login Success:",
                userCredential.user.uid
            );


            // Website Login Status

            localStorage.setItem(
                "loggedIn",
                "true"
            );


            // Go to Dashboard

            window.location.href =
                "dashboard.html";


        } catch (error) {

            console.error(
                "Firebase Login Error:",
                error
            );

            console.error(
                error.code
            );

            msg.innerText =
                error.message;


            loginBtn.disabled = false;

            loginBtn.innerText = "Login";

        }

    });

});