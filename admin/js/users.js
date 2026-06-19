import { db } from "./firebase.js";

import {
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

async function loadUsers() {
  const table = document.getElementById("userTable");

  const snapshot = await getDocs(collection(db, "users"));

  table.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const user = docSnap.data();

    table.innerHTML += `

      <tr>

        <td>${user.name || ""}</td>

        <td>${user.email || ""}</td>

        <td>${user.role || "member"}</td>

        <td>
          ${user.approved ? "승인완료" : "승인대기"}
        </td>

        <td>

          <button>
            승인
          </button>

        </td>

      </tr>

    `;
  });
}

loadUsers();
