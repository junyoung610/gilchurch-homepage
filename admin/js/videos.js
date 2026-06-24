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

const form = document.getElementById("videoForm");
const videoList = document.getElementById("videoList");

let editId = null;

/* =====================
목록
===================== */

async function loadVideos() {
  videoList.innerHTML = "";

  const snapshot = await getDocs(collection(db, "videos"));

  snapshot.forEach((docSnap) => {
    const video = docSnap.data();

    videoList.innerHTML += `
  <div class="board-item">

    <div>

      <strong>
        ${video.title}
      </strong>

      <div>
        ${video.preacher || "-"}
      </div>

      <div>
        ${video.date || "-"}
      </div>

    </div>

    <div class="board-actions">

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
    btn.onclick = () => {
      editVideo(btn.dataset.id);
    };
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.onclick = () => {
      deleteVideo(btn.dataset.id);
    };
  });
}

/* =====================
저장
===================== */

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const youtubeUrl = document.getElementById("youtubeUrl").value;

  let videoId = "";

  try {
    videoId = youtubeUrl.split("v=")[1]?.split("&")[0] || youtubeUrl.split("/").pop();
  } catch {
    videoId = "";
  }

  const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  const data = {
    title: document.getElementById("title").value,

    preacher: document.getElementById("preacher").value,

    scripture: document.getElementById("scripture").value,

    date: document.getElementById("date").value,

    youtubeUrl,

    thumbnail,

    updatedAt: Date.now(),
  };

  if (editId) {
    await updateDoc(doc(db, "videos", editId), data);

    alert("수정 완료");
  } else {
    await addDoc(collection(db, "videos"), {
      ...data,
      createdAt: Date.now(),
    });

    alert("저장 완료");
  }

  resetForm();

  loadVideos();
});

/* =====================
수정
===================== */

async function editVideo(id) {
  const snap = await getDoc(doc(db, "videos", id));

  if (!snap.exists()) return;

  const data = snap.data();

  editId = id;

  document.getElementById("title").value = data.title || "";

  document.getElementById("preacher").value = data.preacher || "";

  document.getElementById("scripture").value = data.scripture || "";

  document.getElementById("date").value = data.date || "";

  document.getElementById("youtubeUrl").value = data.youtubeUrl || "";
}

/* =====================
삭제
===================== */

async function deleteVideo(id) {
  if (!confirm("삭제하시겠습니까?")) return;

  await deleteDoc(doc(db, "videos", id));

  loadVideos();
}

/* =====================
초기화
===================== */

function resetForm() {
  form.reset();

  editId = null;
}

/* =====================
시작
===================== */

loadVideos();
