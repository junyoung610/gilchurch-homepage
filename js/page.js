import { db } from "./firebase.js";
import { loadHeader } from "./header.js";

import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

await loadHeader();

/* ======================
   URL slug
====================== */

const slug = new URLSearchParams(location.search).get("slug");

if (!slug) {
  document.getElementById("pageContent").innerHTML = "<h2>페이지를 찾을 수 없습니다.</h2>";

  throw new Error("slug 없음");
}

/* ======================
   페이지 조회
====================== */

const pageQuery = query(collection(db, "pages"), where("slug", "==", slug));

const pageSnapshot = await getDocs(pageQuery);

if (pageSnapshot.empty) {
  document.getElementById("pageContent").innerHTML = "<h2>존재하지 않는 페이지입니다.</h2>";

  throw new Error("페이지 없음");
}

const page = pageSnapshot.docs[0].data();

document.title = page.title;

document.getElementById("title").textContent = page.title;

document.getElementById("pageContent").innerHTML = page.content;

/* ======================
   게시판 연결
====================== */

if (page.boardId) {
  const boardSnap = await getDoc(doc(db, "boards", page.boardId));

  if (!boardSnap.exists()) {
    console.warn("게시판 없음");
  } else {
    const board = boardSnap.data();

    const allPostSnapshot = await getDocs(collection(db, "posts"));

    const posts = [];

    allPostSnapshot.forEach((docSnap) => {
      const post = docSnap.data();

      if (String(post.boardId).trim().toLowerCase() === String(page.boardId).trim().toLowerCase()) {
        posts.push({
          id: docSnap.id,
          ...post,
        });
      }
    });

    /* 공지 우선 */

    posts.sort((a, b) => {
      if (a.notice && !b.notice) return -1;
      if (!a.notice && b.notice) return 1;

      const timeA = a.createdAt?.seconds ? a.createdAt.seconds : 0;

      const timeB = b.createdAt?.seconds ? b.createdAt.seconds : 0;

      return timeB - timeA;
    });

    let html = `
      <div class="page-board">

        <h2>${board.name}</h2>

        <table class="board-table">

          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>조회수</th>
            </tr>
          </thead>

          <tbody>
    `;

    let no = posts.length;

    posts.forEach((post) => {
      let dateText = "-";

      if (post.createdAt) {
        const date = post.createdAt.toDate ? post.createdAt.toDate() : new Date(post.createdAt);

        dateText = date.toLocaleDateString("ko-KR");
      }

      html += `
        <tr>

          <td>
            ${post.notice ? "📌" : no--}
          </td>

          <td class="title-cell">
            <a href="./post.html?id=${post.id}">
              ${post.title}
            </a>
          </td>

          <td>
            ${post.writer || "-"}
          </td>

          <td>
            ${dateText}
          </td>

          <td>
            ${post.views || 0}
          </td>

        </tr>
      `;
    });

    html += `
          </tbody>

        </table>

      </div>
    `;

    document.getElementById("pageContent").insertAdjacentHTML("beforeend", html);
  }
}
