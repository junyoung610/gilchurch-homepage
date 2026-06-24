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

  // 💡 YYMMDD 형태의 숫자이므로, 숫자가 클수록 최신 날짜입니다. 단순 뺄셈으로 정렬이 가능합니다.
  return (b.createdAt || 0) - (a.createdAt || 0);
});

/* =========================
   목록 화면 출력 (날짜 포맷 수동 변환)
   ========================= */
const tbody = document.getElementById("postList");
let no = posts.length;

const rowsHtml = posts
  .map((post) => {
    const postNo = post.notice ? "📌" : no--;

    let dateText = "-";
    if (post.createdAt) {
      const dateStr = String(post.createdAt).trim();

      // 💡 6자리 숫자(YYMMDD) 포맷일 때 처리 방법
      if (dateStr.length === 6) {
        const year = "20" + dateStr.substring(0, 2); // "20" + "26" = "2026"
        const month = parseInt(dateStr.substring(2, 4)); // "06" -> 6
        const day = parseInt(dateStr.substring(4, 6)); // "24" -> 24
        dateText = `${year}. ${month}. ${day}.`; // "2026. 6. 24."
      } else {
        // 일반 날짜 데이터가 들어올 경우를 대비한 백업 코드
        const date = post.createdAt.toDate ? post.createdAt.toDate() : new Date(post.createdAt);
        dateText = date.toLocaleDateString("ko-KR");
      }
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
