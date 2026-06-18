import { auth } from "./firebase.js";

import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

document.getElementById("loginBtn").addEventListener("click", async () => {
  try {
    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;

    await signInWithEmailAndPassword(auth, email, password);

    location.href = "./mypage.html";
  } catch (error) {
    alert("로그인 실패");
  }
});
