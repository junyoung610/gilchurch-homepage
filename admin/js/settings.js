import { storage } from "../../js/firebase.js";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

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

// 파일요소가져오기
const logoFile = document.getElementById("logoFile");

const faviconFile = document.getElementById("faviconFile");

const ogFile = document.getElementById("ogFile");

// 업로드함수만들기
async function uploadFile(file, path) {
  if (!file) return null;

  const storageRef = ref(storage, path);

  await uploadBytes(storageRef, file);

  return await getDownloadURL(storageRef);
}

// 저장버튼
saveBtn.addEventListener("click", async () => {
  let logoUrl = null;
  let faviconUrl = null;
  let ogUrl = null;

  if (logoFile.files[0]) {
    logoUrl = await uploadFile(logoFile.files[0], "logos/logo.png");
  }

  if (faviconFile.files[0]) {
    faviconUrl = await uploadFile(faviconFile.files[0], "favicon/favicon.ico");
  }

  if (ogFile.files[0]) {
    ogUrl = await uploadFile(ogFile.files[0], "og-images/og-image.jpg");
  }

  const updateData = {
    siteName: siteName.value,
    description: description.value,
  };

  if (logoUrl) updateData.logo = logoUrl;

  if (faviconUrl) updateData.favicon = faviconUrl;

  if (ogUrl) updateData.ogImage = ogUrl;

  await updateDoc(doc(db, "settings", "site"), updateData);

  alert("저장 완료");
});
