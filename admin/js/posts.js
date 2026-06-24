import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

let editor;
let editId = null;

const form = document.getElementById("postForm");

const boardSelect = document.getElementById("boardSelect");

const postList = document.getElementById("postList");

/* =====================
   CKEditor
===================== */

ClassicEditor.create(document.querySelector("#editor")).then((newEditor) => {
  editor = newEditor;
});

/* =====================
   게시판 목록
===================== */

async function loadBoards() {
  const snapshot = await getDocs(collection(db, "boards"));

  boardSelect.innerHTML = "";

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
   게시글 목록
===================== */

async function loadPosts() {
  postList.innerHTML = "";

  const boardsSnapshot = await getDocs(collection(db, "boards"));

  const boardMap = {};

  boardsSnapshot.forEach((docSnap) => {
    boardMap[docSnap.id] = docSnap.data().name;
  });

  const snapshot = await getDocs(collection(db, "posts"));

  snapshot.forEach((docSnap) => {
    const post = docSnap.data();

    postList.innerHTML += `
      <div class="board-item">

        <div>

          <strong>
            ${post.title}
          </strong>

          <div>
            ${boardMap[post.boardId] || "-"}
          </div>

        </div>

        <div class="board-actions">

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
   이벤트
===================== */

function bindEvents() {
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.onclick = () => {
      editPost(btn.dataset.id);
    };
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.onclick = () => {
      deletePost(btn.dataset.id);
    };
  });
}

/* =====================
   저장
===================== */

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    boardId: boardSelect.value,

    title: document.getElementById("title").value,

    content: editor.getData(),

    notice: document.getElementById("notice").checked,

    views: 0,

    writer: "관리자",

    updatedAt: Date.now(),
  };

  if (editId) {
    await updateDoc(doc(db, "posts", editId), data);

    alert("수정 완료");
  } else {
    await addDoc(collection(db, "posts"), {
      ...data,
      createdAt: Date.now(),
    });

    alert("저장 완료");
  }

  resetForm();

  loadPosts();
});

/* =====================
   수정
===================== */

async function editPost(id) {
  const snap = await getDoc(doc(db, "posts", id));

  if (!snap.exists()) return;

  const data = snap.data();

  editId = id;

  boardSelect.value = data.boardId;

  document.getElementById("title").value = data.title;

  document.getElementById("notice").checked = data.notice;

  editor.setData(data.content || "");
}

/* =====================
   삭제
===================== */

async function deletePost(id) {
  if (!confirm("삭제하시겠습니까?")) return;

  await deleteDoc(doc(db, "posts", id));

  loadPosts();
}

/* =====================
   초기화
===================== */

function resetForm() {
  form.reset();

  editor.setData("");

  editId = null;
}

/* =====================
   시작
===================== */

loadBoards();
loadPosts();
