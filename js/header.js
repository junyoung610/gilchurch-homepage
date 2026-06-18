import { db } from "./firebase.js";

import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { auth } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

export async function loadHeader() {
  const header = document.getElementById("header");

  const siteSnap = await getDoc(doc(db, "settings", "site"));

  let logoUrl = "";

  if (siteSnap.exists()) {
    logoUrl = siteSnap.data().logo || "";
  }

  const snapshot = await getDocs(query(collection(db, "menus"), orderBy("order")));

  let html = `

  <div class="container">

    <a href="index.html" class="logo">

      ${logoUrl ? `<img src="${logoUrl}" alt="교회 로고">` : "교회"}

    </a>

    <nav>

  `;

  snapshot.forEach((doc) => {
    const menu = doc.data();

    html += `
      <a href="${menu.url}">
        ${menu.title}
      </a>
    `;
  });

  html += `
      </nav>
    </div>
  `;

  html += `

<div class="auth-menu">

  <a href="/gilchurch-homepage/login.html">
    로그인
  </a>

  <a
    href="/gilchurch-homepage/register.html"
    class="register-btn"
  >
    회원가입
  </a>

</div>

`;

  header.innerHTML = html;
}

onAuthStateChanged(auth, (user) => {
  const authArea = document.getElementById("authArea");

  if (user) {
    authArea.innerHTML = `

      <a href="/gilchurch-homepage/mypage.html">
        마이페이지
      </a>

      <a href="#" id="logoutBtn">
        로그아웃
      </a>

    `;

    document.getElementById("logoutBtn").addEventListener("click", async (e) => {
      e.preventDefault();

      await signOut(auth);

      location.reload();
    });
  }
});
