import { db, auth } from "./firebase.js";

import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

/* =========================
   기존 홈페이지 통계
========================= */
async function loadStats() {
  try {
    const pageCount = (await getDocs(collection(db, "pages"))).size;
    const postCount = (await getDocs(collection(db, "posts"))).size;
    const videoCount = (await getDocs(collection(db, "videos"))).size;
    const menuCount = (await getDocs(collection(db, "menus"))).size;

    document.getElementById("pageCount").textContent = pageCount;
    document.getElementById("postCount").textContent = postCount;
    document.getElementById("videoCount").textContent = videoCount;
    document.getElementById("menuCount").textContent = menuCount;
  } catch (error) {
    console.error("통계 로드 실패", error);
  }
}

/* =========================
   전체 교인 수
========================= */
async function loadMemberCount() {
  try {
    const snapshot = await getDocs(collection(db, "members"));

    const el = document.getElementById("memberCount");

    if (el) {
      el.textContent = snapshot.size;
    }
  } catch (error) {
    console.error("교인 수 로드 실패", error);
  }
}

/* =========================
   새가족 수
========================= */
async function loadNewcomersCount() {
  try {
    const snapshot = await getDocs(collection(db, "newcomers"));

    const el = document.getElementById("newcomers");

    if (el) {
      el.textContent = snapshot.size;
    }
  } catch (error) {
    console.error("새가족 수 로드 실패", error);
  }
}

/* =========================
   승인 대기 회원 수
========================= */
async function loadPendingUsers() {
  try {
    const q = query(collection(db, "users"), where("approved", "==", false));

    const snapshot = await getDocs(q);

    const el = document.getElementById("pendingUsers");

    if (el) {
      el.textContent = snapshot.size;
    }
  } catch (error) {
    console.error("승인대기 회원 로드 실패", error);
  }
}

/* =========================
   오늘 출석
========================= */
async function loadTodayAttendance() {
  try {
    const today = new Date().toISOString().split("T")[0];

    const docRef = doc(db, "attendance", today);

    const snap = await getDoc(docRef);

    const el = document.getElementById("todayAttendance");

    if (!el) return;

    if (!snap.exists()) {
      el.textContent = 0;
      return;
    }

    const data = snap.data();

    el.textContent = data.members?.length || 0;
  } catch (error) {
    console.error("출석 통계 로드 실패", error);
  }
}

/* =========================
   로그인 확인
========================= */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    location.href = "./login.html";
    return;
  }

  try {
    const userRef = doc(db, "users", user.uid);

    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("권한이 없습니다.");
      location.href = "./login.html";
      return;
    }

    const data = userSnap.data();

    document.getElementById("userInfo").innerHTML = `
      <div class="user-panel">

        <div class="user-box">

          <div class="avatar">
            👤
          </div>

          <div>
            <div class="user-name">
              ${data.name || "관리자"}
            </div>

            <div class="user-role">
              ${data.role || ""}
            </div>
          </div>

        </div>

        <button id="logoutBtn">
          로그아웃
        </button>

      </div>
    `;

    /* 로그아웃 */
    document.getElementById("logoutBtn").addEventListener("click", async () => {
      try {
        await signOut(auth);
        location.href = "./login.html";
      } catch (error) {
        console.error(error);
      }
    });

    /* 통계 로드 */
    await loadStats();

    await loadMemberCount();

    await loadNewcomersCount();

    await loadPendingUsers();

    await loadTodayAttendance();
  } catch (error) {
    console.error(error);
  }
});
