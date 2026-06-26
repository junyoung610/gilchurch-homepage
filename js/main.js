import { db } from "./firebase.js";

import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { loadHeader } from "./header.js";
import { loadFooter } from "./footer.js";

/* 사이트 기본 정보 */
async function loadSite() {
  const snap = await getDoc(doc(db, "settings", "site"));

  if (!snap.exists()) return;

  const data = snap.data();

  document.title = data.siteName || "교회 홈페이지";
}

/* Hero 영역 */
/* 슬라이드 제어를 위한 전역 변수 설정 */
let currentSlideIndex = 0;
let slideImages = [];
let slideTimer = null;

async function loadHero() {
  const snap = await getDoc(doc(db, "homepage", "main"));
  if (!snap.exists()) return;

  const data = snap.data();

  const heroTitle = document.getElementById("heroTitle");
  const heroDescription = document.getElementById("heroDescription");
  const heroBtn1 = document.getElementById("heroBtn1");
  const heroBtn2 = document.getElementById("heroBtn2");
  const hero = document.getElementById("hero");

  if (heroTitle) heroTitle.textContent = data.heroTitle || "";
  if (heroDescription) heroDescription.textContent = data.heroDescription || "";

  if (heroBtn1) {
    heroBtn1.textContent = data.heroButton1 || "";
    heroBtn1.href = data.heroButton1Link || "#";
  }

  if (heroBtn2) {
    heroBtn2.textContent = data.heroButton2 || "";
    heroBtn2.href = data.heroButton2Link || "#";
  }

  /* 1. 슬라이드에 사용할 이미지 배열 구성 */
  // 어드민에서 등록한 메인 이미지를 첫 번째로 넣고, 나머지는 기본 예시 이미지로 채웁니다.
  slideImages = [
    data.heroImage || "https://images.unsplash.com/photo-1548625361-155deee259f2?w=1600", // 어드민 등록 이미지 혹은 예시 교회 인테리어
    "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1600", // 예시 예배당 모습
    "https://images.unsplash.com/photo-1515516969-d4008cc6241a?w=1600" /* 예시 따뜻한 공동체 느낌 */,
  ];

  /* 2. 하단 도트(점) 버튼 생성 */
  const dotsContainer = document.getElementById("slideDots");
  if (dotsContainer) {
    dotsContainer.innerHTML = "";
    slideImages.forEach((_, index) => {
      const dot = document.createElement("div");
      dot.className = `dot ${index === 0 ? "active" : ""}`;
      dot.addEventListener("click", () => {
        changeSlide(index);
        resetTimer();
      });
      dotsContainer.appendChild(dot);
    });
  }

  /* 3. 첫 번째 슬라이드 이미지 적용 및 자동 슬라이드 시작 */
  if (hero && slideImages.length > 0) {
    hero.style.backgroundImage = `url(${slideImages[0]})`;
    startTimer();
  }

  /* 4. 좌우 화살표 버튼 이벤트 연결 */
  document.getElementById("prevBtn")?.addEventListener("click", () => {
    let nextIndex = currentSlideIndex - 1;
    if (nextIndex < 0) nextIndex = slideImages.length - 1;
    changeSlide(nextIndex);
    resetTimer();
  });

  document.getElementById("nextBtn")?.addEventListener("click", () => {
    let nextIndex = (currentSlideIndex + 1) % slideImages.length;
    changeSlide(nextIndex);
    resetTimer();
  });
}

/* 슬라이드 전환 함수 */
function changeSlide(index) {
  const hero = document.getElementById("hero");
  if (!hero || slideImages.length === 0) return;

  currentSlideIndex = index;
  hero.style.backgroundImage = `url(${slideImages[currentSlideIndex]})`;

  // 도트 활성화 상태 업데이트
  const dots = document.querySelectorAll(".slide-dots .dot");
  dots.forEach((dot, idx) => {
    if (idx === currentSlideIndex) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

/* 4초마다 자동으로 슬라이드가 넘어가도록 설정 */
function startTimer() {
  slideTimer = setInterval(() => {
    let nextIndex = (currentSlideIndex + 1) % slideImages.length;
    changeSlide(nextIndex);
  }, 4000);
}

/* 사용자가 버튼을 직접 클릭했을 때는 타이머를 초기화하여 부자연스러운 전환을 방지 */
function resetTimer() {
  clearInterval(slideTimer);
  startTimer();
}

/* 예배안내 */
async function loadWorships() {
  const container = document.getElementById("worshipList");

  if (!container) return;

  const snapshot = await getDocs(query(collection(db, "worships"), orderBy("order")));

  container.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    container.innerHTML += `
      <div class="worship-card">
        <h3>${data.title}</h3>
        <p>${data.time}</p>
        <p>${data.location}</p>
      </div>
    `;
  });
}

/* 최근 설교 (최신순 4개) */
async function loadSermons() {
  const container = document.getElementById("sermonList");

  if (!container) return;

  const q = query(collection(db, "videos"), orderBy("createdAt", "desc"), limit(4));
  const snapshot = await getDocs(q);

  container.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    container.innerHTML += `
      <a
        class="sermon-card"
        href="${data.youtubeUrl}"
        target="_blank"
      >
        <img
          src="${data.thumbnail}"
          alt="${data.title}"
        >
        <div class="sermon-content">
          <h3>${data.title}</h3>
          <p>${data.date || ""}</p>
        </div>
      </a>
    `;
  });
}

/* 교회 소식 (최신순 5개) */
async function loadNews() {
  const container = document.getElementById("newsList");

  if (!container) return;

  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(5));
  const snapshot = await getDocs(q);

  container.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    container.innerHTML += `
      <div class="news-item">
        <a href="./post.html?id=${docSnap.id}">
          ${data.title}
        </a>
      </div>
    `;
  });
}
/* ✨ 메인 공지사항 팝업 제어 (다중 이미지 슬라이드) ✨ */
let noticeImagesArray = [];
let currentNoticeIdx = 0;

async function loadNotice() {
  const hideNotice = localStorage.getItem("hideNoticeToday");
  if (hideNotice) {
    const hideDate = new Date(hideNotice);
    const today = new Date();
    if (hideDate.toDateString() === today.toDateString()) return;
  }

  // 임시로 3장의 포스터 이미지가 있다고 가정합니다.
  // (추후 Firebase에서 '여러 장 올리기' 데이터를 불러오면 됩니다.)
  noticeImagesArray = [
    "https://images.unsplash.com/photo-1544208076-7871bfa82946?w=600&h=800&fit=crop", // 공지 1
    "https://images.unsplash.com/photo-1519834785169-98be25ce3f27?w=600&h=800&fit=crop", // 공지 2
    "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=600&h=800&fit=crop", // 공지 3
  ];

  if (noticeImagesArray.length > 0) {
    const modal = document.getElementById("noticeModal");
    const noticeImg = document.getElementById("noticeImg");
    const prevBtn = document.getElementById("noticePrev");
    const nextBtn = document.getElementById("noticeNext");
    const dotsContainer = document.getElementById("noticeDots");

    // 첫 번째 이미지 띄우기
    noticeImg.src = noticeImagesArray[0];
    modal.style.display = "block";

    // 이미지가 여러 장일 경우 화살표와 도트 표시
    if (noticeImagesArray.length > 1) {
      prevBtn.style.display = "flex";
      nextBtn.style.display = "flex";

      // 도트 생성
      noticeImagesArray.forEach((_, idx) => {
        const dot = document.createElement("div");
        dot.className = `dot ${idx === 0 ? "active" : ""}`;
        dot.addEventListener("click", () => changeNoticeSlide(idx));
        dotsContainer.appendChild(dot);
      });

      // 화살표 이벤트
      prevBtn.onclick = () => {
        let nextIdx = currentNoticeIdx - 1;
        if (nextIdx < 0) nextIdx = noticeImagesArray.length - 1;
        changeNoticeSlide(nextIdx);
      };

      nextBtn.onclick = () => {
        let nextIdx = (currentNoticeIdx + 1) % noticeImagesArray.length;
        changeNoticeSlide(nextIdx);
      };
    }

    // 닫기 버튼 이벤트
    document.getElementById("closeNotice").addEventListener("click", () => {
      if (document.getElementById("hideToday").checked) {
        localStorage.setItem("hideNoticeToday", new Date().toISOString());
      }
      modal.style.display = "none";
    });
  }
}

// 공지사항 이미지 변경 함수
function changeNoticeSlide(idx) {
  currentNoticeIdx = idx;
  const noticeImg = document.getElementById("noticeImg");
  noticeImg.src = noticeImagesArray[idx];

  // 도트 색상 업데이트
  const dots = document.querySelectorAll("#noticeDots .dot");
  dots.forEach((dot, i) => {
    if (i === idx) dot.classList.add("active");
    else dot.classList.remove("active");
  });
}

/* 실행 */
async function init() {
  await loadHeader();
  await loadFooter();
  await loadSite();
  await loadHero();
  await loadWorships();

  await loadSermons();
  await loadNews();

  // init 함수 맨 마지막에 공지사항 팝업 호출 추가
  await loadNotice();
}

init();
