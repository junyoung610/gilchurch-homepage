import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    location.href = "./login.html";

    return;
  }

  const snap = await getDoc(doc(db, "users", user.uid));

  const data = snap.data();

  document.getElementById("userInfo").innerHTML = `

      <p>이름 : ${data.name}</p>

      <p>이메일 : ${data.email}</p>

      <p>권한 : ${data.role}</p>

      <p>
      승인 :
      ${data.approved ? "승인완료" : "승인대기"}
      </p>

    `;
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);

  location.href = "./login.html";
});
