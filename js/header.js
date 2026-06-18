import { db } from "./firebase.js";

import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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

  header.innerHTML = html;
}
