import { db } from "./firebase.js";

import {
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { loadHeader } from "./header.js";

await loadHeader();

/* ======================
   URL slug 읽기
====================== */

const slug = new URLSearchParams(location.search).get("slug");

if (!slug) {
  document.getElementById("pageContent").innerHTML = "<h2>페이지를 찾을 수 없습니다.</h2>";

  throw new Error("slug 없음");
}

/* ======================
   Firestore 조회
====================== */

const q = query(collection(db, "pages"), where("slug", "==", slug));

const snapshot = await getDocs(q);

if (snapshot.empty) {
  document.getElementById("pageContent").innerHTML = "<h2>존재하지 않는 페이지입니다.</h2>";
} else {
  const page = snapshot.docs[0].data();

  document.title = page.title;

  document.getElementById("title").textContent = page.title;

  document.getElementById("pageContent").innerHTML = page.content;
}

/* ======================
   게시판 연결
====================== */

if (page.boardId) {
  const boardSnap = await getDoc(doc(db, "boards", page.boardId));

  if (boardSnap.exists()) {
    const board = boardSnap.data();

    const postSnapshot = await getDocs(collection(db, "posts"));

    let boardHtml = `
      <div class="page-board">

        <h2>
          ${board.name}
        </h2>

        <table class="board-table">

          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
            </tr>
          </thead>

          <tbody>
    `;

    let no = 1;

    postSnapshot.forEach((docSnap) => {
      const post = docSnap.data();

      if (String(post.boardId).trim().toLowerCase() === String(page.boardId).trim().toLowerCase()) {
        boardHtml += `
          <tr>

            <td>
              ${no++}
            </td>

            <td>

              <a href="./post.html?id=${docSnap.id}">
                ${post.title}
              </a>

            </td>

            <td>
              ${post.writer || "-"}
            </td>

            <td>
              ${post.createdAt ? new Date(post.createdAt).toLocaleDateString("ko-KR") : "-"}
            </td>

          </tr>
        `;
      }
    });

    boardHtml += `
          </tbody>

        </table>

      </div>
    `;

    document.getElementById("pageContent").insertAdjacentHTML("beforeend", boardHtml);
  }
}

if (page.boardId) {
  const postQuery = query(collection(db, "posts"), where("boardId", "==", page.boardId));

  const postSnapshot = await getDocs(postQuery);

  let html = `
    <div class="board-area">

      <h2>게시판</h2>

      <table class="board-table">

        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
          </tr>
        </thead>

        <tbody>
  `;

  let no = postSnapshot.size;

  postSnapshot.forEach((docSnap) => {
    const post = docSnap.data();

    html += `
      <tr>

        <td>
          ${post.notice ? "📌" : no--}
        </td>

        <td>
          <a href="./post.html?id=${docSnap.id}">
            ${post.title}
          </a>
        </td>

        <td>
          ${post.writer || "-"}
        </td>

        <td>
          ${post.createdAt || "-"}
        </td>

      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </div>
  `;

  document.getElementById("boardSection").innerHTML = html;
}
