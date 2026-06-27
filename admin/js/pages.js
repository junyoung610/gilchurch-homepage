import { db } from "./firebase.js";

import {
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const pageList = document.getElementById("pageList");
const searchInput = document.getElementById("searchInput");

let pages = [];

async function loadPages() {
  pageList.innerHTML = "";

  const snapshot = await getDocs(collection(db, "pages"));

  pages = [];

  snapshot.forEach((docSnap) => {
    pages.push({
      id: docSnap.id,

      ...docSnap.data(),
    });
  });

  renderPages(pages);
}

function renderPages(data) {
  pageList.innerHTML = "";

  data.forEach((page) => {
    pageList.innerHTML += `

        <div class="page-item">

            <div class="page-left">

                <h3>${page.title}</h3>

                <p>/${page.slug}</p>

            </div>

            <div class="page-right">

                <button
                    class="edit-btn"
                    onclick="location.href='page-editor.html?id=${page.id}'">

                    수정

                </button>

            </div>

        </div>

        `;
  });
}

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();

  renderPages(
    pages.filter(
      (page) =>
        page.title.toLowerCase().includes(keyword) || page.slug.toLowerCase().includes(keyword),
    ),
  );
});

document.getElementById("newPageBtn").onclick = () => {
  location.href = "page-editor.html";
};

loadPages();
