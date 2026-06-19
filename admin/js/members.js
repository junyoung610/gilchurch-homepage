import { db } from "./firebase.js";

import {
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

async function loadMembers() {
  const table = document.getElementById("memberTable");

  const snapshot = await getDocs(collection(db, "members"));

  table.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const member = docSnap.data();

    table.innerHTML += `
      <tr>

        <td>${member.name || ""}</td>

        <td>${member.department || ""}</td>

        <td>${member.position || ""}</td>

        <td>${member.phone || ""}</td>

        <td>

          <button>
            수정
          </button>

        </td>

      </tr>
    `;
  });
}

loadMembers();
