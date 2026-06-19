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
