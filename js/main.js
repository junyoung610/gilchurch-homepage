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
