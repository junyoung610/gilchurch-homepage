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

const form = document.getElementById("boardForm");
const boardList = document.getElementById("boardList");

let editId = null;

/* =========================
   게시판 목록
========================= */

async function loadBoards() {
  boardList.innerHTML = "";

  const snapshot = await getDocs(collection(db, "boards"));

  snapshot.forEach((docSnap) => {
    const board = docSnap.data();

    boardList.innerHTML += `

      <div class="board-item">

        <div>

          <strong>
            ${board.name}
          </strong>

          <div>
            ${board.slug}
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

/* =========================
   이벤트
========================= */

function bindEvents() {
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.onclick = () => editBoard(btn.dataset.id);
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.onclick = () => deleteBoard(btn.dataset.id);
  });
}

/* =========================
   저장
========================= */

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value,

    slug: document.getElementById("slug").value,

    description: document.getElementById("description").value,
  };

  if (editId) {
    await updateDoc(doc(db, "boards", editId), data);

    alert("수정 완료");
  } else {
    await addDoc(collection(db, "boards"), {
      ...data,
      createdAt: Date.now(),
    });

    alert("게시판 생성 완료");
  }

  resetForm();

  loadBoards();
});

/* =========================
   수정
========================= */

async function editBoard(id) {
  const snap = await getDoc(doc(db, "boards", id));

  if (!snap.exists()) return;

  const data = snap.data();

  editId = id;

  document.getElementById("name").value = data.name;

  document.getElementById("slug").value = data.slug;

  document.getElementById("description").value = data.description || "";

  document.querySelector('#boardForm button[type="submit"]').textContent = "수정 저장";
}

/* =========================
   삭제
========================= */

async function deleteBoard(id) {
  if (!confirm("삭제하시겠습니까?")) return;

  await deleteDoc(doc(db, "boards", id));

  loadBoards();
}

/* =========================
   초기화
========================= */

function resetForm() {
  form.reset();

  editId = null;

  document.querySelector('#boardForm button[type="submit"]').textContent = "저장";
}

/* =========================
   시작
========================= */

loadBoards();
