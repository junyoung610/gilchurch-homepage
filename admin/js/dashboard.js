import { auth, db } from "../../js/firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    location.href = "/gilchurch-homepage/admin/login.html";

    return;
  }

  const userRef = doc(db, "users", user.uid);

  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    alert("권한 없음");

    return;
  }

  const data = userSnap.data();

  document.getElementById("userInfo").innerHTML = `

  <div class="user-name">
    ${data.name}
  </div>

  <div class="user-role">
    ${data.role}
  </div>

`;
});

const pageCount = (await getDocs(collection(db, "pages"))).size;

document.getElementById("pageCount").textContent = pageCount;

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);

  location.href = "./login.html";
});
