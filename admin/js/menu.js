import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const form = document.getElementById("menuForm");
const menuList = document.getElementById("menuList");
const typeSelect = document.getElementById("type");
const parentWrap = document.getElementById("parentWrap");
const parentMenu = document.getElementById("parentMenu");

typeSelect.addEventListener("change", () => {
  parentWrap.style.display = typeSelect.value === "sub" ? "block" : "none";
});

async function loadParentMenus() {
  const snapshot = await getDocs(collection(db, "menus"));

  parentMenu.innerHTML = '<option value="">선택</option>';

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    if (data.type === "main") {
      parentMenu.innerHTML += `
        <option value="${docSnap.id}">
          ${data.title}
        </option>
      `;
    }
  });
}

async function loadMenus() {
  menuList.innerHTML = "";

  const q = query(collection(db, "menus"), orderBy("order"));

  const snapshot = await getDocs(q);

  const menus = [];

  snapshot.forEach((docSnap) => {
    menus.push({
      id: docSnap.id,
      ...docSnap.data(),
    });
  });

  const mains = menus.filter((menu) => menu.type === "main");

  mains.forEach((main) => {
    const div = document.createElement("div");

    div.className = "menu-item";

    div.innerHTML = `
      <div class="menu-main">
        📁 ${main.title}
      </div>
    `;

    const subs = menus.filter((menu) => menu.parentId === main.id);

    subs.forEach((sub) => {
      div.innerHTML += `
        <div class="menu-sub">
          └ ${sub.title}
        </div>
      `;
    });

    menuList.appendChild(div);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  await addDoc(collection(db, "menus"), {
    title: document.getElementById("title").value,

    url: document.getElementById("url").value,

    type: document.getElementById("type").value,

    parentId: document.getElementById("type").value === "sub" ? parentMenu.value : null,

    order: Number(document.getElementById("order").value),

    visible: true,
  });

  form.reset();

  await loadMenus();

  await loadParentMenus();
});

loadMenus();
loadParentMenus();
