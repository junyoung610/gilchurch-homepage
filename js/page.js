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

const slug = new URLSearchParams(location.search).get("slug");
const pageContentEl = document.getElementById("pageContent");

if (!slug) {
  pageContentEl.innerHTML = "<h2>페이지를 찾을 수 없습니다.</h2>";
  throw new Error("slug 없음");
}

/* ======================
   페이지 조회 및 렌더링
====================== */
const pageQuery = query(collection(db, "pages"), where("slug", "==", slug));
const pageSnapshot = await getDocs(pageQuery);

if (pageSnapshot.empty) {
  pageContentEl.innerHTML = "<h2>존재하지 않는 페이지입니다.</h2>";
  throw new Error("페이지 없음");
}

const page = pageSnapshot.docs[0].data();
document.title = page.title;
document.getElementById("title").textContent = page.title;

// 디자인 템플릿 엔진 시작
if (page.pageType === "board" && page.boardId) {
  // 게시판형 페이지일 경우
  renderBoard(page.boardId);
} else {
  // 일반 페이지일 경우 (about, intro 등)
  // 템플릿 디자인을 적용하여 렌더링
  renderPageTemplate(page);
}

/* ======================
   디자인 템플릿 함수들
====================== */

// 일반 페이지 템플릿 (about, 소개 등 디자인 적용)
/* renderPageTemplate 함수 수정 */
function renderPageTemplate(page) {
  // 이미지가 있으면 해당 이미지를 사용, 없으면 기본 Unsplash 이미지 사용
  const bannerImage =
    page.imageUrl || "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800";

  if (page.slug === "about") {
    pageContentEl.innerHTML = `
      <div class="about-container">
        <div class="greeting-container">
            <div class="greeting-text">${page.content}</div>
            <div class="greeting-image">
                <img src="${bannerImage}" alt="${page.title}">
            </div>
        </div>
      </div>
    `;
  } else {
    // 일반 페이지는 내용을 출력하되, 상단에 이미지를 넣고 싶다면 아래처럼 추가 가능
    pageContentEl.innerHTML = `
      <div class="page-default">
        <img src="${bannerImage}" class="page-banner" alt="${page.title}">
        <div class="page-body">${page.content}</div>
      </div>
    `;
  }
}

// 게시판 렌더링 함수
async function renderBoard(boardId) {
  const boardSnap = await getDoc(doc(db, "boards", boardId));
  if (!boardSnap.exists()) return;

  const board = boardSnap.data();
  const postSnapshot = await getDocs(collection(db, "posts"));
  const posts = [];

  postSnapshot.forEach((docSnap) => {
    const post = docSnap.data();
    if (String(post.boardId).trim() === String(boardId).trim()) {
      posts.push({ id: docSnap.id, ...post });
    }
  });

  // 정렬 로직
  posts.sort((a, b) => {
    const timeA = a.createdAt?.seconds || 0;
    const timeB = b.createdAt?.seconds || 0;
    return timeB - timeA;
  });

  // 게시판 디자인 템플릿
  let html = `
    <div class="page-board">
      <h2>${board.name}</h2>
      <table class="board-table">
        <thead>
          <tr><th>번호</th><th>제목</th><th>작성자</th><th>작성일</th><th>조회수</th></tr>
        </thead>
        <tbody id="boardBody">
          ${posts
            .map(
              (post, index) => `
            <tr>
              <td>${post.notice ? "📌" : posts.length - index}</td>
              <td class="title-cell"><a href="./post.html?id=${post.id}">${post.title}</a></td>
              <td>${post.writer || "관리자"}</td>
              <td>${post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleDateString() : "-"}</td>
              <td>${post.views || 0}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
  pageContentEl.insertAdjacentHTML("beforeend", html);
}
