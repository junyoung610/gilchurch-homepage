import { db } from "./firebase.js";

import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

export async function loadFooter() {
  const footer = document.getElementById("footer");

  const snap = await getDoc(doc(db, "settings", "footer"));

  if (!snap.exists()) return;

  const data = snap.data();

  footer.innerHTML = `
 <div class="container">

   <h3>${data.churchName || ""}</h3>

   <p>${data.address || ""}</p>

   <p>${data.phone || ""}</p>

   <p>${data.email || ""}</p>

   <p>${data.copyright || ""}</p>

 </div>
 `;
}
