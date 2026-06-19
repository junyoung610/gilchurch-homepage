import { db } from "./firebase.js";

import {
  collection,
  getDocs,
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

            <a
              href="./edit-member.html?id=${member.id}"
            >
              수정
            </a>

          </td>

        </tr>

      `;
    });
}

loadMembers();

document.getElementById("searchInput").addEventListener("input", renderMembers);

document.getElementById("departmentFilter").addEventListener("change", renderMembers);
