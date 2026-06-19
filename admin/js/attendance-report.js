import { db } from "./firebase.js";

import {
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const reportList = document.getElementById("reportList");

async function loadReport() {
  const snapshot = await getDocs(collection(db, "attendance"));

  const stats = {};

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    if (!stats[data.memberId]) {
      stats[data.memberId] = {
        name: data.name,

        total: 0,

        present: 0,
      };
    }

    stats[data.memberId].total++;

    if (data.present) {
      stats[data.memberId].present++;
    }
  });

  reportList.innerHTML = "";

  Object.values(stats).forEach((member) => {
    const rate = Math.round((member.present / member.total) * 100);

    reportList.innerHTML += `

      <div class="report-card">

        <h3>
          ${member.name}
        </h3>

        <p>
          출석
          ${member.present}
          /
          ${member.total}
        </p>

        <p>
          출석률
          ${rate}%
        </p>

      </div>

    `;
  });
}

loadReport();
