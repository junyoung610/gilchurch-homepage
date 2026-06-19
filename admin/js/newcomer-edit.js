import { db } from "./firebase.js";

import {
  doc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const params = new URLSearchParams(location.search);

const id = params.get("id");

async function loadData() {
  const snap = await getDoc(doc(db, "newcomers", id));

  if (!snap.exists()) return;

  const data = snap.data();

  document.getElementById("name").value = data.name || "";

  document.getElementById("phone").value = data.phone || "";

  document.getElementById("inviter").value = data.inviter || "";

  document.getElementById("status").value = data.status || "첫방문";

  document.getElementById("memo").value = data.memo || "";
}

loadData();

document.getElementById("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  await updateDoc(doc(db, "newcomers", id), {
    name: document.getElementById("name").value,

    phone: document.getElementById("phone").value,

    inviter: document.getElementById("inviter").value,

    status: document.getElementById("status").value,

    memo: document.getElementById("memo").value,
  });

  alert("저장 완료");

  location.href = "./newcomers.html";
});
