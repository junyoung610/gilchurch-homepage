import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const table = document.getElementById("userTable");

async function loadUsers() {
  const snapshot = await getDocs(collection(db, "users"));

  table.innerHTML = "";

  snapshot.forEach((userDoc) => {
    const data = userDoc.data();

    table.innerHTML += `

      <tr>

        <td>${data.name || ""}</td>

        <td>${data.email || ""}</td>

        <td>${data.role || "member"}</td>

        <td>
          ${data.approved ? "승인완료" : "승인대기"}
        </td>

        <td>

          ${
            !data.approved
              ? `
              <button
                class="approve-btn"
                data-id="${userDoc.id}"
              >
                승인
              </button>
            `
              : "-"
          }

        </td>

      </tr>

    `;
  });

  bindApprove();
}

function bindApprove() {
  document.querySelectorAll(".approve-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const uid = btn.dataset.id;

      const userRef = doc(db, "users", uid);

      await updateDoc(userRef, {
        approved: true,
      });

      const userSnapshot = await getDocs(collection(db, "users"));

      const user = userSnapshot.docs.find((d) => d.id === uid).data();

      await setDoc(doc(db, "members", uid), {
        uid: uid,

        name: user.name || "",

        phone: "",

        birth: "",

        gender: "",

        address: "",

        department: "",

        position: "",

        baptized: false,

        registered: true,
      });

      alert("승인 완료");

      loadUsers();
    });
  });
}

loadUsers();
