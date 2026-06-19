import { db } from "./firebase.js";

import {
  doc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const params = new URLSearchParams(location.search);

const id = params.get("id");

async function loadMember() {
  const snap = await getDoc(doc(db, "members", id));

  if (!snap.exists()) return;

  const data = snap.data();

  document.getElementById("name").value = data.name || "";

  document.getElementById("department").value = data.department || "";

  document.getElementById("position").value = data.position || "";

  document.getElementById("phone").value = data.phone || "";

  document.getElementById("address").value = data.address || "";

  document.getElementById("birth").value = data.birth || "";

  document.getElementById("baptized").value = String(data.baptized);
}

loadMember();

document.getElementById("memberForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  await updateDoc(doc(db, "members", id), {
    name: document.getElementById("name").value,

    department: document.getElementById("department").value,

    position: document.getElementById("position").value,

    phone: document.getElementById("phone").value,

    address: document.getElementById("address").value,

    birth: document.getElementById("birth").value,

    baptized: document.getElementById("baptized").value === "true",
  });

  alert("저장 완료");
});
