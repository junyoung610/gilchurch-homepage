import { db } from "./firebase.js";

import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
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

  const status = document.getElementById("status").value;

  await updateDoc(doc(db, "newcomers", id), {
    name: document.getElementById("name").value,

    phone: document.getElementById("phone").value,

    inviter: document.getElementById("inviter").value,

    status: document.getElementById("status").value,

    memo: document.getElementById("memo").value,
  });

  if (status === "등록완료") {
    await setDoc(
      doc(db, "members", id),

      {
        name: document.getElementById("name").value,

        phone: document.getElementById("phone").value,

        birth: "",

        address: "",

        departments: [],

        positions: [],

        baptized: false,

        registered: true,
      },
    );
  }

  alert("저장 완료");

  location.href = "./newcomers.html";
});

const memberSnap = await getDoc(doc(db, "members", id));

if (!memberSnap.exists()) {
  // 생성
}
