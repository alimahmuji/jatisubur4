import { auth } from "./firebase.js";
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

const form = document.getElementById("loginForm");
const msg = document.getElementById("msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  msg.textContent = "Sedang login...";
  try {
    await signInWithEmailAndPassword(auth, email, password);
    msg.textContent = "Login berhasil...";
    window.location.href = "admin.html";
  } catch (error) {
    console.error(error);
    const map = {
      "auth/invalid-credential": "Email atau password salah.",
      "auth/invalid-email": "Format email tidak valid.",
      "auth/operation-not-allowed": "Login Email/Password belum diaktifkan di Firebase.",
      "auth/api-key-not-valid.-please-pass-a-valid-api-key.": "API Key Firebase tidak valid. Periksa firebase-config.js."
    };
    msg.textContent = map[error.code] || (error.code + " - " + error.message);
  }
});

onAuthStateChanged(auth, (user) => {
  if (user && location.pathname.endsWith("login.html")) window.location.href = "admin.html";
});
