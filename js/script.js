// Auto Agreement Number

let agreementNo = localStorage.getItem("agreementCounter");

if (!agreementNo) {
    agreementNo = 1;
}

document.getElementById("agreementNo").value =
    "AH-2026-" + String(agreementNo).padStart(4, "0");

function saveAgreement() {

    alert("Agreement Saved Successfully!");

    agreementNo++;

    localStorage.setItem("agreementCounter", agreementNo);
}