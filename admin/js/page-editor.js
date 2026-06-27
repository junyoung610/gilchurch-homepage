import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/* ===================================
   상태
=================================== */

let sortable = null;
let editor = null;
let editId = null;
let sections = [];

/* ===================================
   DOM
=================================== */

const title = document.getElementById("title");
const slug = document.getElementById("slug");
const thumbnail = document.getElementById("thumbnail");

const pageType = document.getElementById("pageType");
const boardArea = document.getElementById("boardArea");
const boardSelect = document.getElementById("boardSelect");

const published = document.getElementById("published");
const showMenu = document.getElementById("showMenu");
const showBanner = document.getElementById("showBanner");
const showTitle = document.getElementById("showTitle");

const saveBtn = document.getElementById("saveBtn");

const sectionList = document.getElementById("sectionList");
const addSectionBtn = document.getElementById("addSectionBtn");

const sectionModal = document.getElementById("sectionModal");

/* ===================================
   URL
=================================== */

const params = new URLSearchParams(location.search);

editId = params.get("id");

/* ===================================
   시작
=================================== */

window.addEventListener("DOMContentLoaded", init);

async function init() {
  await createEditor();

  await loadBoards();

  if (editId) {
    await loadPage(editId);
  }

  bindEvents();
}

/* ===================================
   CKEditor
=================================== */

async function createEditor() {
  const target = document.querySelector("#content");

  if (!target) return;

  editor = await ClassicEditor.create(target);
}

/* ===================================
   이벤트
=================================== */

function bindEvents() {
  pageType.addEventListener("change", toggleBoard);

  saveBtn.addEventListener("click", savePage);

  addSectionBtn.addEventListener("click", () => {
    sectionModal.classList.add("show");
  });

  sectionModal.addEventListener("click", (e) => {
    if (e.target === sectionModal) {
      sectionModal.classList.remove("show");
    }
  });

  document.querySelectorAll(".section-grid button").forEach((btn) => {
    btn.addEventListener("click", () => {
      createSection(btn.dataset.type);

      sectionModal.classList.remove("show");
    });
  });
}

/* ===================================
   게시판 표시
=================================== */

function toggleBoard() {
  if (pageType.value === "board") {
    boardArea.style.display = "block";
  } else {
    boardArea.style.display = "none";
  }
}

/* ===================================
   게시판 목록
=================================== */

async function loadBoards() {
  boardSelect.innerHTML = `
    <option value="">게시판 선택</option>
  `;

  const snapshot = await getDocs(collection(db, "boards"));

  snapshot.forEach((docSnap) => {
    const board = docSnap.data();

    boardSelect.innerHTML += `
      <option value="${docSnap.id}">
        ${board.name}
      </option>
    `;
  });
}

/* ===================================
   페이지 불러오기
=================================== */

async function loadPage(id) {
  const snap = await getDoc(doc(db, "pages", id));

  if (!snap.exists()) return;

  const page = snap.data();

  title.value = page.title || "";

  slug.value = page.slug || "";

  thumbnail.value = page.thumbnail || "";

  pageType.value = page.pageType || "normal";

  boardSelect.value = page.boardId || "";

  published.checked = page.published !== false;

  showMenu.checked = page.showMenu !== false;

  showBanner.checked = page.showBanner !== false;

  showTitle.checked = page.showTitle !== false;

  toggleBoard();

  if (editor) {
    editor.setData(page.content || "");
  }

  sections = page.sections || [];

  renderSections();
}

/* ===================================
   섹션 생성
=================================== */

function createSection(type) {
  sections.push({
    id: crypto.randomUUID(),

    type: type,

    data: {},
  });

  renderSections();
}

/* ===================================
   섹션 삭제
=================================== */

function removeSection(id) {
  sections = sections.filter((section) => section.id !== id);

  renderSections();
}

/* ===================================
   섹션 출력
=================================== */

function renderSections() {
  sectionList.innerHTML = "";

  sections.forEach((section) => {
    let html = "";

    switch (section.type) {
      case "text":
        html = `
        <div class="section-card" data-id="${section.id}">

          <div class="section-card-header">

            <span>📝 텍스트</span>

            <button
              type="button"
              class="delete-section"
              data-id="${section.id}">
              삭제
            </button>

          </div>

          <div class="section-card-body">

            <textarea
              class="section-text"
              data-id="${section.id}"
              placeholder="내용을 입력하세요...">${section.data.content || ""}</textarea>

          </div>

        </div>
        `;

        break;

      case "image":
        html = `
        <div class="section-card" data-id="${section.id}">

          <div class="section-card-header">

            <span>🖼 이미지</span>

            <button
              type="button"
              class="delete-section"
              data-id="${section.id}">
              삭제
            </button>

          </div>

          <div class="section-card-body">

            <input
              type="text"
              class="section-image"
              data-id="${section.id}"
              placeholder="이미지 URL"
              value="${section.data.url || ""}">

          </div>

        </div>
        `;

        break;

      case "board":
        html = `
        <div class="section-card" data-id="${section.id}">

          <div class="section-card-header">

            <span>📋 게시판</span>

            <button
              type="button"
              class="delete-section"
              data-id="${section.id}">
              삭제
            </button>

          </div>

          <div class="section-card-body">

            <select
              class="section-board"
              data-id="${section.id}">

              ${boardSelect.innerHTML}

            </select>

          </div>

        </div>
        `;

        break;

      case "hero":
        html = `

<div class="section-card">

<div class="section-card-header">

🖼 메인 배너

<button
class="delete-section"
data-id="${section.id}">
삭제
</button>

</div>

<div class="section-card-body">

<input
class="hero-title"
placeholder="메인 제목">

<input
class="hero-sub"
placeholder="부제목">

<input
class="hero-image"
placeholder="배경 이미지">

</div>

</div>

`;

        break;

      case "imageText":
        html = `

<div class="section-card">

<div class="section-card-header">

📄 이미지 + 텍스트

<button
class="delete-section"
data-id="${section.id}">
삭제
</button>

</div>

<div class="section-card-body">

<input
placeholder="이미지 URL">

<textarea
placeholder="내용"></textarea>

</div>

</div>

`;

        break;

      case "gallery":
        html = `

<div class="section-card">

<div class="section-card-header">

📷 갤러리

<button
class="delete-section"
data-id="${section.id}">
삭제
</button>

</div>

<div class="section-card-body">

<button>

이미지 추가

</button>

</div>

</div>

`;

        break;

      case "slider":
        html = `

<div class="section-card">

<div class="section-card-header">

🎞 슬라이더

<button
class="delete-section"
data-id="${section.id}">
삭제
</button>

</div>

<div class="section-card-body">

슬라이드 선택

</div>

</div>

`;

        break;

      case "youtube":
        html = `

<div class="section-card">

<div class="section-card-header">

▶ 유튜브

<button
class="delete-section"
data-id="${section.id}">
삭제
</button>

</div>

<div class="section-card-body">

<input
placeholder="유튜브 주소">

</div>

</div>

`;

        break;

      case "map":
        html = `

<div class="section-card">

<div class="section-card-header">

🗺 지도

<button
class="delete-section"
data-id="${section.id}">
삭제
</button>

</div>

<div class="section-card-body">

<input
placeholder="주소">

</div>

</div>

`;

        break;

      case "worship":
        html = `

<div class="section-card">

<div class="section-card-header">

🕒 예배시간

<button
class="delete-section"
data-id="${section.id}">
삭제
</button>

</div>

<div class="section-card-body">

<textarea
placeholder="주일예배\n수요예배"></textarea>

</div>

</div>

`;

        break;

      case "pastor":
        html = `

<div class="section-card">

<div class="section-card-header">

👤 담임목사

<button
class="delete-section"
data-id="${section.id}">
삭제
</button>

</div>

<div class="section-card-body">

<input
placeholder="목사님 이름">

<input
placeholder="사진 URL">

<textarea
placeholder="인사말"></textarea>

</div>

</div>

`;

        break;
    }

    sectionList.insertAdjacentHTML("beforeend", html);
  });

  bindSectionEvents();

  initSortable();
}

function initSortable() {
  if (sortable) {
    sortable.destroy();
  }

  sortable = new Sortable(sectionList, {
    animation: 200,

    ghostClass: "dragging",

    handle: ".section-card-header",

    onEnd: function (evt) {
      const moved = sections.splice(evt.oldIndex, 1)[0];

      sections.splice(evt.newIndex, 0, moved);
    },
  });
}

/* ===================================
   섹션 이벤트
=================================== */

function bindSectionEvents() {
  document.querySelectorAll(".delete-section").forEach((btn) => {
    btn.onclick = () => {
      removeSection(btn.dataset.id);
    };
  });

  document.querySelectorAll(".section-text").forEach((textarea) => {
    textarea.oninput = () => {
      const section = sections.find((s) => s.id === textarea.dataset.id);

      if (!section) return;

      section.data.content = textarea.value;
    };
  });

  document.querySelectorAll(".section-image").forEach((input) => {
    input.oninput = () => {
      const section = sections.find((s) => s.id === input.dataset.id);

      if (!section) return;

      section.data.url = input.value;
    };
  });

  document.querySelectorAll(".section-board").forEach((select) => {
    const section = sections.find((s) => s.id === select.dataset.id);

    if (section && section.data.boardId) {
      select.value = section.data.boardId;
    }

    select.onchange = () => {
      const section = sections.find((s) => s.id === select.dataset.id);

      if (!section) return;

      section.data.boardId = select.value;
    };
  });
}

/* ===================================
   저장
=================================== */

async function savePage() {
  const data = {
    title: title.value.trim(),

    slug: slug.value.trim(),

    thumbnail: thumbnail.value.trim(),

    pageType: pageType.value,

    boardId: pageType.value === "board" ? boardSelect.value : null,

    published: published.checked,

    showMenu: showMenu.checked,

    showBanner: showBanner.checked,

    showTitle: showTitle.checked,

    content: editor ? editor.getData() : "",

    sections: sections,

    updatedAt: serverTimestamp(),
  };

  try {
    if (editId) {
      await updateDoc(doc(db, "pages", editId), data);

      alert("수정되었습니다.");
    } else {
      data.createdAt = serverTimestamp();

      await addDoc(collection(db, "pages"), data);

      alert("저장되었습니다.");
    }

    location.href = "./pages.html";
  } catch (err) {
    console.error(err);

    alert("저장 실패");
  }
}
