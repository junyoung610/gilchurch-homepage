import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

export async function loadHeader() {
  const header = document.getElementById("header");

  const snapshot = await getDocs(query(collection(db, "menus"), orderBy("order")));

  let html = `
  <div class="container">

    <div class="logo">
      <img src="로고URL">
    </div>

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
