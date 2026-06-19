import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
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

  ${
    user.approved
      ? "승인완료"
      : `<button class="approve-btn"
           data-id="${docSnap.id}">
           승인
         </button>`
  }

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
document.querySelectorAll(".approve-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const uid = btn.dataset.id;

    await updateDoc(doc(db, "users", uid), {
      approved: true,
    });

    const userDoc = snapshot.docs.find((d) => d.id === uid);

    const user = userDoc.data();

    await setDoc(doc(db, "members", uid), {
      uid: uid,
      name: user.name || "",
      email: user.email || "",
      gender: "",
      birth: "",
      phone: "",
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
