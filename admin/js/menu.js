import { db } from "../../js/firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

//요소가져오기
const menuTitle = document.getElementById("menuTitle");

const menuUrl = document.getElementById("menuUrl");

const menuOrder = document.getElementById("menuOrder");

const addMenuBtn = document.getElementById("addMenuBtn");

const menuList = document.getElementById("menuList");

// 메뉴추가
addMenuBtn.addEventListener("click", async () => {
  await addDoc(collection(db, "menus"), {
    title: menuTitle.value,
    url: menuUrl.value,
    order: Number(menuOrder.value),
    visible: true,
  });

  menuTitle.value = "";
  menuUrl.value = "";
  menuOrder.value = "";

  loadMenus();
});

// 메뉴불러오기
async function loadMenus() {
  menuList.innerHTML = "";

  const q = query(collection(db, "menus"), orderBy("order"));

  const snapshot = await getDocs(q);

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    const div = document.createElement("div");

    div.innerHTML = `
      <p>
        ${data.order}.
        ${data.title}
        (${data.url})

        <button
        data-id="${docSnap.id}">
        삭제
        </button>
      </p>
    `;

    menuList.appendChild(div);
  });
}

// 삭제기능
menuList.addEventListener("click", async (e) => {
  if (e.target.tagName === "BUTTON") {
    const id = e.target.dataset.id;

    await deleteDoc(doc(db, "menus", id));

    loadMenus();
  }
});

// 최초로 실행
loadMenus();
