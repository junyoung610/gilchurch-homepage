import { db } from "../../js/firebase.js";

import {
  doc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const siteName = document.getElementById("siteName");

const description = document.getElementById("description");

const saveBtn = document.getElementById("saveBtn");

//Firestore 읽기
async function loadSettings() {
  const docRef = doc(db, "settings", "site");

  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();

    siteName.value = data.siteName || "";

    description.value = data.description || "";
  }
}

loadSettings();

//저장기능
saveBtn.addEventListener("click", async () => {
  await updateDoc(doc(db, "settings", "site"), {
    siteName: siteName.value,
    description: description.value,
  });

  alert("저장 완료");
});
