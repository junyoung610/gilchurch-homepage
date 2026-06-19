import { db, auth } from "./firebase.js";

import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

export async function loadHeader() {
  const header = document.getElementById("header");

  if (!header) return;

  /* =========================
     사이트 설정
  ========================= */

  const siteSnap = await getDoc(doc(db, "settings", "site"));

  let logoUrl = "";

  if (siteSnap.exists()) {
    logoUrl = siteSnap.data().logo || "";
  }

  /* =========================
     메뉴 불러오기
  ========================= */

  const menuSnapshot = await getDocs(query(collection(db, "menus"), orderBy("order")));

  const menus = [];

  menuSnapshot.forEach((menuDoc) => {
    menus.push({
      id: menuDoc.id,
      ...menuDoc.data(),
    });
  });

  /* =========================
     페이지 불러오기
  ========================= */

  const pagesSnapshot = await getDocs(collection(db, "pages"));

  const pageMap = {};

  pagesSnapshot.forEach((pageDoc) => {
    pageMap[pageDoc.id] = {
      id: pageDoc.id,
      ...pageDoc.data(),
    };
  });

  /* =========================
     헤더 시작
  ========================= */

  let html = `
    <div class="container">

      <a
        href="/gilchurch-homepage/index.html"
        class="logo"
      >
        ${logoUrl ? `<img src="${logoUrl}" alt="교회 로고">` : "교회"}
      </a>

      <nav>

        <ul class="main-menu">
  `;

  const mains = menus.filter((menu) => menu.type === "main" && menu.visible !== false);

  mains.forEach((main) => {
    const subs = menus.filter((menu) => menu.parentId === main.id && menu.visible !== false);

    const mainPage = pageMap[main.pageId];

    const mainHref = mainPage ? `/gilchurch-homepage/page.html?slug=${mainPage.slug}` : "#";

    html += `
      <li class="menu-item">

        <a href="${mainHref}">
          ${main.title}
        </a>
    `;

    if (subs.length > 0) {
      html += `
        <ul class="submenu">
      `;

      subs.forEach((sub) => {
        const subPage = pageMap[sub.pageId];

        const subHref = subPage ? `/gilchurch-homepage/page.html?slug=${subPage.slug}` : "#";

        html += `
          <li>

            <a href="${subHref}">
              ${sub.title}
            </a>

          </li>
        `;
      });

      html += `
        </ul>
      `;
    }

    html += `
      </li>
    `;
  });

  html += `
        </ul>

      </nav>

      <div id="authArea"></div>

    </div>
  `;

  header.innerHTML = html;

  /* =========================
     로그인 상태
  ========================= */

  const authArea = document.getElementById("authArea");

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      authArea.innerHTML = `
          <a href="/gilchurch-homepage/mypage.html">
            마이페이지
          </a>

          <a
            href="#"
            id="logoutBtn"
          >
            로그아웃
          </a>
        `;

      document.getElementById("logoutBtn")?.addEventListener("click", async (e) => {
        e.preventDefault();

        await signOut(auth);

        location.href = "/gilchurch-homepage/index.html";
      });
    } else {
      authArea.innerHTML = `
          <a href="/gilchurch-homepage/login.html">
            로그인
          </a>

          <a
            href="/gilchurch-homepage/register.html"
            class="register-btn"
          >
            회원가입
          </a>
        `;
    }
  });
}
