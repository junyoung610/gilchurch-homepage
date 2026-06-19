import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const params = new URLSearchParams(location.search);

const memberId = params.get("id");

document.getElementById("visitDate").value = new Date().toISOString().split("T")[0];

async function loadHistory() {
  const history = document.getElementById("historyList");

  const snapshot = await getDocs(
    query(collection(db, "pastoralCare"), where("memberId", "==", memberId)),
  );

  history.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    history.innerHTML += `

      <div class="history-card">

        <strong>
          ${data.visitDate}
        </strong>

        <p>
          ${data.prayer}
        </p>

      </div>

    `;
  });
}

document.getElementById("careForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  await addDoc(collection(db, "pastoralCare"), {
    memberId,

    visitDate: document.getElementById("visitDate").value,

    prayer: document.getElementById("prayer").value,

    counsel: document.getElementById("counsel").value,

    note: document.getElementById("note").value,
  });

  alert("심방기록 저장 완료");

  loadHistory();
});

loadHistory();
