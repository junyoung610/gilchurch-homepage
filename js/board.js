import { db } from "./firebase.js";
import { loadHeader } from "./header.js";
import {
  collection,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// 헤더 로드
await loadHeader();

/* =========================
   URL Slug 확인
   ========================= */
const slug = new URLSearchParams(location.search).get("slug");

if (!slug) {
  location.href = "/";
}

/* =========================
   게시판 정보 조회 및 출력
   ========================= */
const boardQuery = query(collection(db, "boards"), where("slug", "==", slug));
const boardSnapshot = await getDocs(boardQuery);

if (boardSnapshot.empty) {
  document.getElementById("boardTitle").textContent = "게시판이 존재하지 않습니다.";
  throw new Error("게시판 없음");
}

const boardDoc = boardSnapshot.docs[0];
const board = boardDoc.data();

document.getElementById("boardTitle").textContent = board.name;
document.getElementById("boardDescription").textContent = board.description || "";

/* =========================
   게시글 조회 (대소문자 안전 장치 적용)
   ========================= */
const allPostSnapshot = await getDocs(collection(db, "posts"));
const posts = [];

const targetBoardId = String(boardDoc.id).trim().toLowerCase();

allPostSnapshot.forEach((docSnap) => {
  const post = docSnap.data();
  const currentPostBoardId = String(post.boardId).trim().toLowerCase();

  // 💡 대소문자 구별 없이 ID가 일치하면 목록에 추가합니다.
  if (targetBoardId === currentPostBoardId) {
    posts.push({
      id: docSnap.id,
      ...post,
    });
  }
});

/* =========================
   정렬 (공지글 우선 -> 최신순)
   ========================= */
posts.sort((a, b) => {
  if (a.notice && !b.notice) return -1;
  if (!a.notice && b.notice) return 1;

  // 타임스탬프 객체일 경우를 대비해 숫자로 안전하게 변환하여 정렬
  const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : a.createdAt || 0;
  const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : b.createdAt || 0;

  return timeB - timeA;
});

/* =========================
   목록 화면 출력 (날짜 버그 수정)
   ========================= */
const tbody = document.getElementById("postList");
let no = posts.length;

const rowsHtml = posts
  .map((post) => {
    const postNo = post.notice ? "📌" : no--;

    // 💡 파이어베이스 타임스탬프 객체와 일반 날짜 포맷을 둘 다 지원하도록 안전하게 처리
    let dateText = "-";
    if (post.createdAt) {
      const date = post.createdAt.toDate ? post.createdAt.toDate() : new Date(post.createdAt);
      dateText = date.toLocaleDateString("ko-KR");
    }

    return `
    <tr>
      <td>${postNo}</td>
      <td class="title-cell">
        <a href="./post.html?id=${post.id}">${post.title}</a>
      </td>
      <td>${post.writer || "-"}</td>
      <td>${dateText}</td>
      <td>${post.views || 0}</td>
    </tr>
  `;
  })
  .join("");

tbody.innerHTML = rowsHtml;
