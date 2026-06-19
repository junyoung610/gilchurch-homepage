import { db } from "./firebase.js";

import {
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

document.getElementById("addBtn").addEventListener("click", () => {
  location.href = "./newcomer-add.html";
});

async function loadNewcomers() {
  const table = document.getElementById("newcomerTable");

  const snapshot = await getDocs(collection(db, "newcomers"));

  table.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    table.innerHTML += `

      <tr>

        <td>${data.name}</td>

        <td>${data.phone || ""}</td>

        <td>${data.visitDate}</td>

        <td>${data.status}</td>

        <td>

          <button>
            수정
          </button>

        </td>

      </tr>

    `;
  });
}

loadNewcomers();
