import { db, auth } from "./firebase.js";

import {
  doc,
  getDoc,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

/* 통계 */
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

/* 로그인 상태 확인 */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    location.href = "/gilchurch-homepage/admin/login.html";

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
        ${data.name}
      </div>

      <div class="user-role">
        ${data.role}
      </div>

    </div>

  </div>

  <button id="logoutBtn">
    로그아웃
  </button>

</div>

`;

    await loadStats();
  } catch (error) {
    console.error(error);
  }
});

/* 로그아웃 */
document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    await signOut(auth);

    location.href = "./login.html";
  } catch (error) {
    console.error(error);
  }
});
