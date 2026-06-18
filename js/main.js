import { db } from "./firebase.js";

import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { loadHeader } from "./header.js";
import { loadFooter } from "./footer.js";

/* 사이트 기본 정보 */
async function loadSite() {
  const snap = await getDoc(doc(db, "settings", "site"));

  if (!snap.exists()) return;

  const data = snap.data();

  document.title = data.siteName || "교회 홈페이지";
}

/* Hero 영역 */
async function loadHero() {
  const snap = await getDoc(doc(db, "homepage", "main"));

  if (!snap.exists()) return;

  const data = snap.data();

  const heroTitle = document.getElementById("heroTitle");

  const heroDescription = document.getElementById("heroDescription");

  const heroBtn1 = document.getElementById("heroBtn1");

  const heroBtn2 = document.getElementById("heroBtn2");

  const hero = document.getElementById("hero");

  if (heroTitle) heroTitle.textContent = data.heroTitle || "";

  if (heroDescription) heroDescription.textContent = data.heroDescription || "";

  if (heroBtn1) {
    heroBtn1.textContent = data.heroButton1 || "";

    heroBtn1.href = data.heroButton1Link || "#";
  }

  if (heroBtn2) {
    heroBtn2.textContent = data.heroButton2 || "";

    heroBtn2.href = data.heroButton2Link || "#";
  }

  if (hero && data.heroImage) {
    hero.style.backgroundImage = `url(${data.heroImage})`;
  }
}

/* 예배안내 */
async function loadWorships() {
  const container = document.getElementById("worshipList");

  if (!container) return;

  const snapshot = await getDocs(query(collection(db, "worships"), orderBy("order")));

  container.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    container.innerHTML += `

      <div class="worship-card">

        <h3>${data.title}</h3>

        <p>${data.time}</p>

        <p>${data.location}</p>

      </div>

    `;
  });
}

/* 실행 */
async function init() {
  await loadHeader();

  await loadFooter();

  await loadSite();

  await loadHero();

  await loadWorships();
}

async function loadSermons() {
  const container = document.getElementById("sermonList");

  if (!container) return;

  const snapshot = await getDocs(collection(db, "videos"));

  container.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    container.innerHTML += `

      <a
        class="sermon-card"
        href="${data.youtubeUrl}"
        target="_blank"
      >

        <img
          src="${data.thumbnail}"
          alt="${data.title}"
        >

        <div class="sermon-content">

          <h3>${data.title}</h3>

          <p>${data.date || ""}</p>

        </div>

      </a>

    `;
  });
}

async function loadNews() {
  const container = document.getElementById("newsList");

  if (!container) return;

  const snapshot = await getDocs(collection(db, "posts"));

  container.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    container.innerHTML += `

      <div class="news-item">

        <a href="#">
          ${data.title}
        </a>

      </div>

    `;
  });
}

init();
await loadSermons();
await loadNews();
