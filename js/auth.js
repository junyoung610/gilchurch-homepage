loginBtn.addEventListener("click", async () => {
  try {
    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(auth, provider);

    const user = result.user;

    await setDoc(
      doc(db, "users", user.uid),
      {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        role: "superAdmin",
      },
      { merge: true },
    );

    alert("로그인 성공");

    location.href = "/gilchurch-homepage/admin/dashboard.html";
  } catch (error) {
    console.error(error);

    alert(error.message);
  }
});
