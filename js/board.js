import { db } from "./firebase.js";
import { loadHeader } from "./header.js";

import {
  collection,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

await loadHeader();

/* 게시판 slug */
const slug = new URLSearchParams(location.search).get("slug");

if (!slug) {
  location.href = "/";
}

/* 게시판 조회 */
const boardQuery = query(collection(db, "boards"), where("slug", "==", slug));

const boardSnapshot = await getDocs(boardQuery);

if (boardSnapshot.empty) {
  document.getElementById("boardTitle").textContent = "게시판 없음";
  throw new Error("게시판 없음");
}

const boardDoc = boardSnapshot.docs[0];
const board = boardDoc.data();

/* 게시판 정보 */
document.getElementById("boardTitle").textContent = board.name;
document.getElementById("boardDescription").textContent = board.description || "";

/* 게시글 조회 */
const postQuery = query(collection(db, "posts"));
const postQuery = where("boardId", "==", boardDoc.id);

const postSnapshot = await getDocs(postQuery);

const tbody = document.getElementById("postList");

tbody.innerHTML = "";

let no = 1;

postSnapshot.forEach((docSnap) => {
  const post = docSnap.data();

  tbody.innerHTML += `
    <tr>
      <td>${no++}</td>

      <td>
        <a href="./post.html?id=${docSnap.id}">
          ${post.title}
        </a>
      </td>

      <td>${post.writer || "-"}</td>

      <td>
        ${post.createdAt ? new Date(post.createdAt).toLocaleDateString("ko-KR") : "-"}
      </td>
    </tr>
  `;
});

console.log("slug =", slug);
console.log("게시판 ID =", boardDoc.id);
console.log("게시글 개수 =", postSnapshot.size);
