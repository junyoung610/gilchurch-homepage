import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/* ==========================
HTML 요소 가져오기
========================== */

const form = document.getElementById("menuForm");
const menuList = document.getElementById("menuList");

const typeSelect = document.getElementById("type");

const parentWrap = document.getElementById("parentWrap");
const parentMenu = document.getElementById("parentMenu");

/* ==========================
메뉴유형 변경
main → 상위메뉴 숨김
sub → 상위메뉴 표시
========================== */

typeSelect.addEventListener("change", () => {
  parentWrap.style.display = typeSelect.value === "sub" ? "block" : "none";
});

/* ==========================
메인메뉴 목록 불러오기
(서브메뉴 생성용)
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

  /* 메인메뉴만 추출 */

  const mains = menus.filter((menu) => menu.type === "main");

  mains.forEach((main) => {
    const div = document.createElement("div");

    div.className = "menu-item";

    /* 메인메뉴 */

    div.innerHTML = `
  <div class="menu-main">

    <span>
      📁 ${main.title}
    </span>

    <button
      class="delete-btn"
      data-id="${main.id}"
    >
      삭제
    </button>

  </div>
`;

    /* 해당 메인메뉴의 서브메뉴 */

    const subs = menus.filter((menu) => menu.parentId === main.id);

    subs.forEach((sub) => {
      div.innerHTML += `
    <div class="menu-sub">

      <span>
        └ ${sub.title}
      </span>

      <button
        class="delete-btn"
        data-id="${sub.id}"
      >
        삭제
      </button>

    </div>
  `;
    });

    menuList.appendChild(div);
  });

  /* ==========================
삭제 버튼 이벤트 연결
========================== */

  menuList.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      deleteMenu(btn.dataset.id);
    });
  });
}

/* ==========================
메뉴 저장
========================== */

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

  alert("메뉴가 저장되었습니다.");

  form.reset();

  parentWrap.style.display = "none";

  await loadMenus();

  await loadParentMenus();
});

/* ==========================
메뉴 삭제
========================== */

async function deleteMenu(id) {
  try {
    const menuRef = doc(db, "menus", id);

    const menuSnap = await getDoc(menuRef);

    if (!menuSnap.exists()) return;

    const menuData = menuSnap.data();

    const ok = confirm(`"${menuData.title}" 메뉴를 삭제하시겠습니까?`);

    if (!ok) return;

    /* 메인메뉴 삭제 */

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
최초 실행
========================== */

loadMenus();

loadParentMenus();
