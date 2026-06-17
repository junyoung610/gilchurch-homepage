import { db } from "../../js/firebase.js";

import {
  doc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// 요소
const title = document.getElementById("title");

const slug = document.getElementById("slug");

const content = document.getElementById("content");

const saveBtn = document.getElementById("saveBtn");

const pageList = document.getElementById("pageList");

// 저장
saveBtn.addEventListener("click", async () => {
  if (!slug.value) {
    alert("Slug 입력");

    return;
  }

  await setDoc(doc(db, "pages", slug.value), {
    title: title.value,
    slug: slug.value,
    content: content.value,
    visible: true,
    updatedAt: new Date(),
  });

  alert("저장 완료");

  loadPages();
});

// 페이지목록
async function loadPages() {
  pageList.innerHTML = "";

  const snapshot = await getDocs(collection(db, "pages"));

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    const div = document.createElement("div");

    div.innerHTML = `
      <p>
        ${data.title}
        (${data.slug})

        <button
         data-id="${docSnap.id}">
         삭제
        </button>
      </p>
    `;

    pageList.appendChild(div);
  });
}

// 삭제
pageList.addEventListener("click", async (e) => {
  if (e.target.tagName === "BUTTON") {
    await deleteDoc(doc(db, "pages", e.target.dataset.id));

    loadPages();
  }
});

// 실행
loadPages();
