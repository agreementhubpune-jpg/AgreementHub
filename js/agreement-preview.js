import { db, auth } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const content = document.getElementById("content");

onAuthStateChanged(auth, async user => {
    if (!user) { window.location.href="login.html"; return; }

    const id = localStorage.getItem("selectedAgreementId");
    if (!id) { content.textContent="Agreement ID not found."; return; }

    const snap = await getDoc(doc(db,"agreements",id));
    if (!snap.exists()) { content.textContent="Agreement not found."; return; }

    const a = snap.data();
    content.innerHTML = [
        section("Agreement Details", [
            ["Agreement No",a.agreementNumber],["Start Date",a.startDate],["End Date",a.endDate],["Duration",(a.duration||"-")+" Months"]
        ]),
        section("Owner Details", [
            ["Name",a.owner],["Mobile",a.ownerMobile],["Email",a.ownerEmail],["Address",a.ownerAddress]
        ]),
        section("Tenant Details", [
            ["Name",a.tenant],["Mobile",a.mobile],["Email",a.tenantEmail],["Address",a.tenantAddress]
        ]),
        section("Property Details", [
            ["Project",a.projectName],["Flat No",a.flatNumber],["Building",a.buildingName],["Wing",a.wing],
            ["Floor",a.floor],["Property Address",a.propertyAddress]
        ]),
        section("Agreement Financial Details", [
            ["Monthly Rent","₹"+fmt(a.rent)],["Security Deposit","₹"+fmt(a.deposit)],["Maintenance","₹"+fmt(a.maintenance)],
            ["Stamp Duty","₹"+fmt(a.stampDuty)],["Registration Fee","₹"+fmt(a.registrationFee)]
        ])
    ].join("");

    // Internal fields intentionally excluded:
    // agreementCharges, serviceCharge, brokerage
});

function section(title, rows) {
    return `<section class="block"><h2>${esc(title)}</h2>${rows.map(([l,v]) =>
        `<div class="row"><div class="label">${esc(l)}</div><div>${esc(v || "-")}</div></div>`
    ).join("")}</section>`;
}
function fmt(v){return Number(v||0).toLocaleString("en-IN")}
function esc(v){return String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}
