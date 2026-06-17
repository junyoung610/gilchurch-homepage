import { db } from "./firebase.js";

import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

async function loadSite() {
  const snap = await getDoc(doc(db, "settings", "site"));

  if (!snap.exists()) return;

  const data = snap.data();

  document.title = data.siteName;

  document.getElementById("welcomeTitle").textContent = data.siteName;

  document.getElementById("welcomeDesc").textContent = data.description;
}

loadSite();

import {
  collection,
  getDocs,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

async function loadMenus() {
  const snapshot = await getDocs(query(collection(db, "menus"), orderBy("order")));

  let html = `
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
 `;

  document.getElementById("header").innerHTML = html;
}

loadMenus();

async function loadHero() {
  const snap = await getDoc(doc(db, "homepage", "main"));

  if (!snap.exists()) return;

  const data = snap.data();

  document.getElementById("heroTitle").textContent = data.heroTitle || "";

  document.getElementById("heroDescription").textContent = data.heroDescription || "";

  document.getElementById("heroBtn1").textContent = data.heroButton1 || "";

  document.getElementById("heroBtn1").href = data.heroButton1Link || "#";

  document.getElementById("heroBtn2").textContent = data.heroButton2 || "";

  document.getElementById("heroBtn2").href = data.heroButton2Link || "#";

  if (data.heroImage) {
    document.getElementById("hero").style.backgroundImage = `url(${data.heroImage})`;
  }
}

loadHero();
