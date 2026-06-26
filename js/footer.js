import { db } from "./firebase.js";

import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

export async function loadFooter() {
  const footer = document.getElementById("footer");
  if (!footer) return;

  const snap = await getDoc(doc(db, "settings", "footer"));

  // 데이터베이스에 데이터가 없을 경우를 대비한 기본값 지정
  const data = snap.exists()
    ? snap.data()
    : {
        churchName: "길교회",
        address: "교회 주소를 입력해주세요.",
        phone: "02-123-4567",
        email: "info@gilchurch.com",
        copyright: "© 2026 길교회. All rights reserved.",
      };

  footer.innerHTML = `
    <div class="container footer-wrapper">
      <div class="footer-info">
        <h3>${data.churchName || "길교회"}</h3>
        <p class="footer-text">주소: ${data.address || ""}</p>
        <p class="footer-text">전화: ${data.phone || ""}</p>
        <p class="footer-text">이메일: ${data.email || ""}</p>
      </div>
      
      <div class="footer-links">
        <h4>바로가기</h4>
        <nav class="footer-nav">
          <a href="/gilchurch-homepage/index.html">홈으로 이동</a>
          <a href="/gilchurch-homepage/admin/login.html" class="admin-link">Church CMS 관리자 로그인 <b>⛪</b></a>
        </nav>
      </div>
    </div>
    
    <div class="footer-bottom">
      <div class="container">
        <p>${data.copyright || "© 2026 길교회. All rights reserved."}</p>
      </div>
    </div>
  `;
}
