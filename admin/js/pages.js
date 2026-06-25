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
  orderBy,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const boardSelect = document.getElementById("boardSelect");

let editor;
let editId = null;

const form = document.getElementById("pageForm");
const pageList = document.getElementById("pageList");

/* =====================
   CKEditor
===================== */

ClassicEditor.create(document.querySelector("#content"))
  .then((newEditor) => {
    editor = newEditor;
  })
  .catch(console.error);

async function loadBoards() {
  const snapshot = await getDocs(collection(db, "boards"));

  boardSelect.innerHTML = `
    <option value="">
      게시판 없음
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
   목록
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
          <strong>
            ${page.title}
          </strong>

          <div>
            /${page.slug}
          </div>
        </div>

        <div class="page-actions">

          <button
            class="edit-btn"
            data-id="${docSnap.id}"
          >
            수정
          </button>

          <button
            class="delete-btn"
            data-id="${docSnap.id}"
          >
            삭제
          </button>

        </div>

      </div>
    `;
  });

  bindEvents();
}

/* =====================
   이벤트 연결
===================== */

function bindEvents() {
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.onclick = () => {
      editPage(btn.dataset.id);
    };
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.onclick = () => {
      deletePage(btn.dataset.id);
    };
  });
}

/* =====================
   저장
===================== */

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    title: document.getElementById("title").value,

    slug: document.getElementById("slug").value,

    content: editor.getData(),

    boardId: boardSelect.value || null,

    updatedAt: serverTimestamp(),

    published: true,
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

  boardSelect.value = data.boardId || "";

  editId = id;

  document.getElementById("title").value = data.title;

  document.getElementById("slug").value = data.slug;

  editor.setData(data.content || "");

  document.querySelector('#pageForm button[type="submit"]').textContent = "수정 저장";
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

  document.querySelector('#pageForm button[type="submit"]').textContent = "저장";

  boardSelect.value = "";
}

/* =====================
   시작
===================== */

await loadBoards();

loadPages();
