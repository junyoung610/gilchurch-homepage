import { db } from "./firebase.js";

import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

document.getElementById("newcomerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  await addDoc(collection(db, "newcomers"), {
    name: document.getElementById("name").value,

    phone: document.getElementById("phone").value,

    birth: document.getElementById("birth").value,

    inviter: document.getElementById("inviter").value,

    memo: document.getElementById("memo").value,

    visitDate: new Date().toISOString().split("T")[0],

    status: "첫방문",
  });

  alert("등록 완료");

  location.href = "./newcomers.html";
});
