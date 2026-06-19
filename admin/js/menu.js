const pageSelect = document.getElementById("pageSelect");

import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/* ==========================
   DOM
========================== */

const form = document.getElementById("menuForm");
const menuList = document.getElementById("menuList");

const typeSelect = document.getElementById("type");

const parentWrap = document.getElementById("parentWrap");
const parentMenu = document.getElementById("parentMenu");

let editId = null;

async function loadPages() {
  const snapshot = await getDocs(collection(db, "pages"));

  pageSelect.innerHTML = '<option value="">페이지 선택</option>';

  snapshot.forEach((docSnap) => {
    const page = docSnap.data();

    pageSelect.innerHTML += `
      <option value="${docSnap.id}">
        ${page.title}
      </option>
    `;
  });
}

/* ==========================
   메뉴유형 변경
========================== */

typeSelect.addEventListener("change", () => {
  parentWrap.style.display = typeSelect.value === "sub" ? "block" : "none";
});

/* ==========================
   상위메뉴 로드
========================== */

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

/* ==========================
   메뉴 목록 출력
========================== */

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

        <span>
          📁 ${main.title}
        </span>

        <div class="menu-actions">

          <button
            class="edit-btn"
            data-id="${main.id}"
          >
            수정
          </button>

          <button
            class="delete-btn"
            data-id="${main.id}"
          >
            삭제
          </button>

        </div>

      </div>
    `;

    const subs = menus.filter((menu) => menu.parentId === main.id);

    subs.forEach((sub) => {
      div.innerHTML += `
        <div class="menu-sub">

          <span>
            └ ${sub.title}
          </span>

          <div class="menu-actions">

            <button
              class="edit-btn"
              data-id="${sub.id}"
            >
              수정
            </button>

            <button
              class="delete-btn"
              data-id="${sub.id}"
            >
              삭제
            </button>

          </div>

        </div>
      `;
    });

    menuList.appendChild(div);
  });

  /* 삭제 이벤트 */

  menuList.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      deleteMenu(btn.dataset.id);
    });
  });

  /* 수정 이벤트 */

  menuList.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      editMenu(btn.dataset.id);
    });
  });
}

/* ==========================
   저장 / 수정
========================== */

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;

  const pageId = pageSelect.value || null;

  const type = document.getElementById("type").value;

  const order = Number(document.getElementById("order").value);

  const parentId = type === "sub" ? parentMenu.value : null;

  if (editId) {
    await updateDoc(doc(db, "menus", editId), {
      title,
      pageId,
      type,
      parentId,
      order,
    });

    alert("수정 완료");
  } else {
    await addDoc(collection(db, "menus"), {
      title,
      pageId,
      type,
      parentId,
      order,
      visible: true,
    });
    alert("메뉴 저장 완료");
  }

  resetForm();

  await loadMenus();
  await loadParentMenus();
});

/* ==========================
   수정
========================== */

async function editMenu(id) {
  const menuRef = doc(db, "menus", id);

  const snap = await getDoc(menuRef);

  if (!snap.exists()) return;

  const data = snap.data();

  editId = id;

  document.getElementById("title").value = data.title;

  pageSelect.value = data.pageId || "";

  pageSelect.value = "";

  document.getElementById("type").value = data.type;

  document.getElementById("order").value = data.order;

  if (data.type === "sub") {
    parentWrap.style.display = "block";

    parentMenu.value = data.parentId;
  } else {
    parentWrap.style.display = "none";
  }

  document.querySelector('#menuForm button[type="submit"]').textContent = "수정 저장";

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

/* ==========================
   삭제
========================== */

async function deleteMenu(id) {
  try {
    const menuRef = doc(db, "menus", id);

    const menuSnap = await getDoc(menuRef);

    if (!menuSnap.exists()) return;

    const menuData = menuSnap.data();

    const ok = confirm(`"${menuData.title}" 메뉴를 삭제하시겠습니까?`);

    if (!ok) return;

    if (menuData.type === "main") {
      const ok2 = confirm("연결된 서브메뉴도 모두 삭제됩니다.");

      if (!ok2) return;

      const subQuery = query(collection(db, "menus"), where("parentId", "==", id));

      const subSnapshot = await getDocs(subQuery);

      for (const subDoc of subSnapshot.docs) {
        await deleteDoc(subDoc.ref);
      }
    }

    await deleteDoc(menuRef);

    alert("삭제 완료");

    await loadMenus();
  } catch (error) {
    console.error(error);

    alert("삭제 실패");
  }
}

/* ==========================
   폼 초기화
========================== */

function resetForm() {
  form.reset();

  editId = null;

  parentWrap.style.display = "none";

  document.querySelector('#menuForm button[type="submit"]').textContent = "메뉴 저장";
}

/* ==========================
   최초 실행
========================== */

loadMenus();
loadParentMenus();
loadPages();
