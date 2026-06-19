import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

let allMembers = [];

async function loadMembers() {
  const snapshot = await getDocs(collection(db, "members"));

  allMembers = [];

  snapshot.forEach((docSnap) => {
    allMembers.push({
      id: docSnap.id,
      ...docSnap.data(),
    });
  });

  renderMembers();
}

function renderMembers() {
  const table = document.getElementById("memberTable");

  const keyword = document.getElementById("searchInput").value.toLowerCase();

  const department = document.getElementById("departmentFilter").value;

  table.innerHTML = "";

  allMembers
    .filter((member) => {
      const nameMatch = (member.name || "").toLowerCase().includes(keyword);

      const departmentMatch = !department || (member.departments || []).includes(department);

      return nameMatch && departmentMatch;
    })
    .forEach((member) => {
      table.innerHTML += `

        <tr>

          <td>${member.name || ""}</td>

          <td>
            ${(member.departments || []).join(", ")}
          </td>

          <td>
            ${(member.positions || []).join(", ")}
          </td>

          <td>${member.phone || ""}</td>

         <td>

  <a href="./edit-member.html?id=${member.id}">
    수정
  </a>

  <button
    class="delete-btn"
    data-id="${member.id}"
  >
    삭제
  </button>

</td>

        </tr>

      `;
    });
}

loadMembers();

document.getElementById("searchInput").addEventListener("input", renderMembers);

document.getElementById("departmentFilter").addEventListener("change", renderMembers);

document.querySelectorAll(".delete-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    await deleteDoc(doc(db, "members", btn.dataset.id));

    loadMembers();
  });
});

document.getElementById("birthdayBtn").addEventListener("click", () => {
  const month = new Date().getMonth() + 1;

  const result = allMembers.filter((member) => {
    if (!member.birth) return false;

    return Number(member.birth.split("-")[1]) === month;
  });

  alert(
    result
      .map(
        (m) =>
          `${m.name}
(${m.birth})`,
      )
      .join("\n"),
  );
});

document.getElementById("excelBtn").addEventListener("click", () => {
  const rows = allMembers.map((m) => ({
    이름: m.name,

    부서: (m.departments || []).join(", "),

    전화번호: m.phone || "",

    생일: m.birth || "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "교적부");

  XLSX.writeFile(workbook, "교적부.xlsx");
});
