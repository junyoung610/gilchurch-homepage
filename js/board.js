const boardDoc = boardSnapshot.docs[0];
const board = boardDoc.data();

document.getElementById("boardTitle").textContent = board.name;
document.getElementById("boardDescription").textContent = board.description;

const postQuery = query(collection(db, "posts"), where("boardId", "==", boardDoc.id));

const postSnapshot = await getDocs(postQuery);

const tbody = document.getElementById("postList");

let no = 1;

postSnapshot.forEach((docSnap) => {
  const post = docSnap.data();

  tbody.innerHTML += `
    <tr>
      <td>${no++}</td>
      <td>
        <a href="./post.html?id=${docSnap.id}">
          ${post.title}
        </a>
      </td>
      <td>${post.writer || "-"}</td>
      <td>${post.createdAt || "-"}</td>
    </tr>
  `;
});
