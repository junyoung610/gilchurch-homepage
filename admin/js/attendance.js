import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const attendanceList = document.getElementById("attendanceList");

const dateInput = document.getElementById("attendanceDate");

dateInput.value = new Date().toISOString().split("T")[0];

document.getElementById("loadBtn").addEventListener("click", loadAttendance);

document.getElementById("saveBtn").addEventListener("click", saveAttendance);

async function loadAttendance() {
  attendanceList.innerHTML = "";

  const membersSnapshot = await getDocs(collection(db, "members"));

  const selectedDate = dateInput.value;

  const attendanceSnapshot = await getDocs(
    query(collection(db, "attendance"), where("date", "==", selectedDate)),
  );

  const attendanceMap = {};

  attendanceSnapshot.forEach((docSnap) => {
    const data = docSnap.data();

    attendanceMap[data.memberId] = data.present;
  });

  membersSnapshot.forEach((docSnap) => {
    const member = docSnap.data();

    const checked = attendanceMap[docSnap.id] ? "checked" : "";

    attendanceList.innerHTML += `

      <label
        class="attendance-item"
      >

        <input
          type="checkbox"
          class="attendance-checkbox"
          data-id="${docSnap.id}"
          data-name="${member.name}"
          ${checked}
        >

        ${member.name}

      </label>

    `;
  });
}

async function saveAttendance() {
  const selectedDate = dateInput.value;

  const oldDocs = await getDocs(
    query(collection(db, "attendance"), where("date", "==", selectedDate)),
  );

  for (const item of oldDocs.docs) {
    await deleteDoc(item.ref);
  }

  const checkboxes = document.querySelectorAll(".attendance-checkbox");

  for (const checkbox of checkboxes) {
    await addDoc(collection(db, "attendance"), {
      memberId: checkbox.dataset.id,

      name: checkbox.dataset.name,

      date: selectedDate,

      present: checkbox.checked,
    });
  }

  alert("출석 저장 완료");
}

loadAttendance();
