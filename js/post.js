import { db } from "./firebase.js";

import { loadHeader } from "./header.js";

import {
  doc,
  getDoc,
  updateDoc,
  increment,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

await loadHeader();

/* =====================
   게시글 ID
===================== */

const id = new URLSearchParams(location.search).get("id");

if (!id) {
  document.body.innerHTML = "<h2>잘못된 접근입니다.</h2>";

  throw new Error();
}

/* =====================
   게시글 조회
===================== */

const docRef = doc(db, "posts", id);

const snap = await getDoc(docRef);

if (!snap.exists()) {
  document.body.innerHTML = "<h2>게시글이 없습니다.</h2>";

  throw new Error();
}

const post = snap.data();

/* =====================
   조회수 증가
===================== */

await updateDoc(docRef, {
  views: increment(1),
});

/* =====================
   화면 출력
===================== */

document.title = post.title;

document.getElementById("title").textContent = post.title;

document.getElementById("writer").textContent = post.writer || "관리자";

document.getElementById("date").textContent = new Date(post.createdAt).toLocaleDateString();

document.getElementById("views").textContent = (post.views || 0) + 1;

document.getElementById("content").innerHTML = post.content;
