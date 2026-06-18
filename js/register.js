import { auth, db } from "./firebase.js";

import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

document.getElementById("registerBtn").addEventListener("click", async () => {
  const name = document.getElementById("name").value;

  const email = document.getElementById("email").value;

  const password = document.getElementById("password").value;

  const passwordConfirm = document.getElementById("passwordConfirm").value;

  if (password !== passwordConfirm) {
    alert("비밀번호가 일치하지 않습니다.");

    return;
  }

  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    const user = result.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: name,
      email: email,
      role: "member",
      approved: false,
      createdAt: serverTimestamp(),
    });

    alert("회원가입 완료");

    location.href = "./login.html";
  } catch (error) {
    alert(error.message);
  }
});
