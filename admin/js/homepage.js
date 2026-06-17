import { db, storage } from "../../js/firebase.js";

import {
  doc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

// 요소
const heroTitle = document.getElementById("heroTitle");

const heroDescription = document.getElementById("heroDescription");

const heroButton1 = document.getElementById("heroButton1");

const heroButton1Link = document.getElementById("heroButton1Link");

const heroButton2 = document.getElementById("heroButton2");

const heroButton2Link = document.getElementById("heroButton2Link");

const heroImage = document.getElementById("heroImage");

const saveBtn = document.getElementById("saveBtn");

// 기존 데이터 가져오기
async function loadHomepage() {
  const snap = await getDoc(doc(db, "homepage", "main"));

  if (!snap.exists()) return;

  const data = snap.data();

  heroTitle.value = data.heroTitle || "";

  heroDescription.value = data.heroDescription || "";

  heroButton1.value = data.heroButton1 || "";

  heroButton1Link.value = data.heroButton1Link || "";

  heroButton2.value = data.heroButton2 || "";

  heroButton2Link.value = data.heroButton2Link || "";
}

loadHomepage();

// 이미지 업로드
async function uploadHeroImage(file) {
  if (!file) return null;

  const storageRef = ref(storage, "homepage/hero.jpg");

  await uploadBytes(storageRef, file);

  return await getDownloadURL(storageRef);
}

// 저장
saveBtn.addEventListener("click", async () => {
  let imageUrl = "";

  if (heroImage.files[0]) {
    imageUrl = await uploadHeroImage(heroImage.files[0]);
  }

  const data = {
    heroTitle: heroTitle.value,

    heroDescription: heroDescription.value,

    heroButton1: heroButton1.value,

    heroButton1Link: heroButton1Link.value,

    heroButton2: heroButton2.value,

    heroButton2Link: heroButton2Link.value,
  };

  if (imageUrl) {
    data.heroImage = imageUrl;
  }

  await setDoc(doc(db, "homepage", "main"), data, { merge: true });

  alert("저장 완료");
});
