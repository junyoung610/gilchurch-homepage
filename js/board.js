import { db } from "./firebase.js";
import { loadHeader } from "./header.js";

import {
  collection,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

await loadHeader();

/* =========================
URL slug
========================= */

const slug = new URLSearchParams(location.search).get("slug");

if (!slug) {
  location.href = "/";
}

/* =========================
게시판 조회
========================= */

const boardQuery = query(collection(db, "boards"), where("slug", "==", slug));

const boardSnapshot = await getDocs(boardQuery);

if (boardSnapshot.empty) {
  document.getElementById("boardTitle").textContent = "게시판이 존재하지 않습니다.";

  throw new Error("게시판 없음");
}

const boardDoc = boardSnapshot.docs[0];
const board = boardDoc.data();

/* =========================
게시판 정보 출력
========================= */

document.getElementById("boardTitle").textContent = board.name;

document.getElementById("boardDescription").textContent = board.description || "";

const allPosts = await getDocs(collection(db, "posts"));

allPosts.forEach((docSnap) => {
  console.log("게시글:", docSnap.data().title, "boardId:", docSnap.data().boardId);
});

/* =========================
게시글 조회
========================= */

const postQuery = query(collection(db, "posts"), where("boardId", "==", boardDoc.id));

const postSnapshot = await getDocs(postQuery);

/* =========================
게시글 배열화
========================= */

const posts = [];

postSnapshot.forEach((docSnap) => {
  posts.push({
    id: docSnap.id,
    ...docSnap.data(),
  });
});

/* =========================
공지글 우선
최신글 순
========================= */

posts.sort((a, b) => {
  if (a.notice && !b.notice) return -1;
  if (!a.notice && b.notice) return 1;

  return (b.createdAt || 0) - (a.createdAt || 0);
});

/* =========================
화면 출력
========================= */

const tbody = document.getElementById("postList");

tbody.innerHTML = "";

let no = posts.length;

posts.forEach((post) => {
  tbody.innerHTML += ` <tr>


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
    ${post.createdAt ? new Date(post.createdAt).toLocaleDateString("ko-KR") : "-"}
  </td>

  <td>
    ${post.views || 0}
  </td>

</tr>


`;
});

/* =========================
디버그
========================= */

console.log("slug =", slug);
console.log("게시판 ID =", boardDoc.id);
console.log("게시글 개수 =", posts.length);
