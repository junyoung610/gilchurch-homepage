import { db } from "./firebase.js";
import { loadHeader } from "./header.js";

import {
  collection,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

await loadHeader();

const slug = new URLSearchParams(location.search).get("slug");

if (!slug) {
  location.href = "/";
}

const boardQuery = query(collection(db, "boards"), where("slug", "==", slug));

const boardSnapshot = await getDocs(boardQuery);

if (boardSnapshot.empty) {
  document.getElementById("boardTitle").textContent = "게시판 없음";

  throw new Error();
}

const boardDoc = boardSnapshot.docs[0];

const board = boardDoc.data();

document.getElementById("boardTitle").textContent = board.name;

document.getElementById("boardDescription").textContent = board.description;

const postQuery = query(collection(db, "posts"), where("boardId", "==", boardDoc.id));

const postSnapshot = await getDocs(postQuery);

const tbody = document.getElementById("postList");

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
