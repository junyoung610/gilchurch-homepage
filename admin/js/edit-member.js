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

  document.getElementById("phone").value = data.phone || "";

  const departments = data.departments || [];

  document.querySelectorAll('input[name="department"]').forEach((checkbox) => {
    checkbox.checked = departments.includes(checkbox.value);
  });
}

loadMember();

document.getElementById("memberForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const departments = [];

  document.querySelectorAll('input[name="department"]:checked').forEach((checkbox) => {
    departments.push(checkbox.value);
  });

  await updateDoc(doc(db, "members", id), {
    name: document.getElementById("name").value,

    phone: document.getElementById("phone").value,

    departments,
  });

  alert("저장 완료");
});
