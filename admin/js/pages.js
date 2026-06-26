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
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/* =====================
   DOM
===================== */

const form = document.getElementById("pageForm");
const pageList = document.getElementById("pageList");

const pageType = document.getElementById("pageType");
const boardArea = document.getElementById("boardArea");
const boardSelect = document.getElementById("boardSelect");

let editor;
let editId = null;

/* =====================
   CKEditor
===================== */

ClassicEditor.create(document.querySelector("#content"))
  .then((newEditor) => {
    editor = newEditor;
  })
  .catch(console.error);

/* =====================
   게시판 목록
===================== */

async function loadBoards() {
  const snapshot = await getDocs(collection(db, "boards"));

  boardSelect.innerHTML = `
    <option value="">
      게시판 선택
    </option>
  `;

  snapshot.forEach((docSnap) => {
    const board = docSnap.data();

    boardSelect.innerHTML += `
      <option value="${docSnap.id}">
        ${board.name}
      </option>
    `;
  });
}

/* =====================
   페이지 유형 변경
===================== */

pageType.addEventListener("change", () => {
  if (pageType.value === "board") {
    boardArea.style.display = "block";
  } else {
    boardArea.style.display = "none";
    boardSelect.value = "";
  }
});

/* =====================
   페이지 목록
===================== */

async function loadPages() {
  pageList.innerHTML = "";

  const q = query(collection(db, "pages"));

  const snapshot = await getDocs(q);

  snapshot.forEach((docSnap) => {
    const page = docSnap.data();

    pageList.innerHTML += `
      <div class="page-item">

        <div>

          <strong>${page.title}</strong>

          <div>/${page.slug}</div>

          <small>
            ${page.pageType === "board" ? "📋 게시판 페이지" : "📄 일반 페이지"}
          </small>

        </div>

        <div class="page-actions">

          <button
            class="edit-btn"
            data-id="${docSnap.id}">
            수정
          </button>

          <button
            class="delete-btn"
            data-id="${docSnap.id}">
            삭제
          </button>

        </div>

      </div>
    `;
  });

  bindEvents();
}

/* =====================
   이벤트
===================== */

function bindEvents() {
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.onclick = () => editPage(btn.dataset.id);
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.onclick = () => deletePage(btn.dataset.id);
  });
}

/* =====================
   저장
===================== */

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    title: document.getElementById("title").value.trim(),

    slug: document.getElementById("slug").value.trim(),

    content: editor.getData(),

    pageType: pageType.value,

    boardId: pageType.value === "board" ? boardSelect.value : null,

    published: true,

    updatedAt: serverTimestamp(),
  };

  if (editId) {
    await updateDoc(doc(db, "pages", editId), data);

    alert("수정 완료");
  } else {
    data.createdAt = serverTimestamp();

    await addDoc(collection(db, "pages"), data);

    alert("저장 완료");
  }

  resetForm();

  loadPages();
});

/* =====================
   수정
===================== */

async function editPage(id) {
  const snap = await getDoc(doc(db, "pages", id));

  if (!snap.exists()) return;

  const data = snap.data();

  editId = id;

  document.getElementById("title").value = data.title;

  document.getElementById("slug").value = data.slug;

  pageType.value = data.pageType || "normal";

  if (pageType.value === "board") {
    boardArea.style.display = "block";
    boardSelect.value = data.boardId || "";
  } else {
    boardArea.style.display = "none";
    boardSelect.value = "";
  }

  editor.setData(data.content || "");

  document.querySelector('#pageForm button[type="submit"]').textContent = "수정 저장";

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

/* =====================
   삭제
===================== */

async function deletePage(id) {
  if (!confirm("삭제하시겠습니까?")) return;

  await deleteDoc(doc(db, "pages", id));

  loadPages();
}

/* =====================
   초기화
===================== */

function resetForm() {
  form.reset();

  editor.setData("");

  editId = null;

  pageType.value = "normal";

  boardArea.style.display = "none";

  boardSelect.value = "";

  document.querySelector('#pageForm button[type="submit"]').textContent = "저장";
}

/* =====================
   시작
===================== */

await loadBoards();

pageType.value = "normal";

boardArea.style.display = "none";

loadPages();
