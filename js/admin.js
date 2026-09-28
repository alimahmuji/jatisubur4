import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const form = document.getElementById("productForm");
const tableWrap = document.getElementById("tableWrap");
const msg = document.getElementById("msg");
const newBtn = document.getElementById("newBtn");
const cancel = document.getElementById("cancel");

onAuthStateChanged(auth, user => {
  if (!user) { location.href = "login.html"; return; }
  loadProducts();
});

document.getElementById("logout").addEventListener("click", async () => { await signOut(auth); location.href = "login.html"; });
newBtn.addEventListener("click", () => { form.classList.remove("hidden"); form.reset(); document.getElementById("pid").value = ""; });
cancel.addEventListener("click", () => { form.reset(); form.classList.add("hidden"); });

form.addEventListener("submit", async e => {
  e.preventDefault();
  const id = document.getElementById("pid").value;
  const data = {
    name: document.getElementById("name").value.trim(),
    category: document.getElementById("category").value.trim(),
    price: Number(document.getElementById("price").value) || 0,
    stock: Number(document.getElementById("stock").value) || 0,
    image: document.getElementById("image").value.trim(),
    description: document.getElementById("description").value.trim(),
    active: true,
    updatedAt: serverTimestamp()
  };
  try {
    if (id) await updateDoc(doc(db, "products", id), data);
    else await addDoc(collection(db, "products"), { ...data, createdAt: serverTimestamp() });
    msg.textContent = "Produk berhasil disimpan.";
    form.reset(); form.classList.add("hidden");
    await loadProducts();
  } catch (error) { console.error(error); msg.textContent = error.code + " - " + error.message; }
});

async function loadProducts() {
  try {
    const snap = await getDocs(collection(db, "products"));
    const rows = snap.docs.map(d => ({id:d.id, ...d.data()}));
    if (!rows.length) { tableWrap.innerHTML = "<p>Belum ada produk.</p>"; return; }
    tableWrap.innerHTML = `<table><thead><tr><th>Produk</th><th>Kategori</th><th>Harga</th><th>Stok</th><th>Status</th><th>Aksi</th></tr></thead><tbody>${rows.map(p => `<tr><td>${esc(p.name)}</td><td>${esc(p.category)}</td><td>Rp ${Number(p.price||0).toLocaleString("id-ID")}</td><td>${p.stock||0}</td><td>${p.active === false ? "Nonaktif" : "Aktif"}</td><td><button data-edit="${p.id}">Edit</button> <button data-del="${p.id}" class="secondary">Hapus</button></td></tr>`).join("")}</tbody></table>`;
    tableWrap.querySelectorAll("[data-edit]").forEach(b => b.onclick = () => editProduct(rows.find(p => p.id === b.dataset.edit)));
    tableWrap.querySelectorAll("[data-del]").forEach(b => b.onclick = () => removeProduct(b.dataset.del));
  } catch (error) { console.error(error); tableWrap.innerHTML = `<p class="error">${error.code} - ${error.message}</p>`; }
}

function editProduct(p) {
  form.classList.remove("hidden");
  document.getElementById("pid").value = p.id;
  document.getElementById("name").value = p.name || "";
  document.getElementById("category").value = p.category || "";
  document.getElementById("price").value = p.price || 0;
  document.getElementById("stock").value = p.stock || 0;
  document.getElementById("image").value = p.image || "";
  document.getElementById("description").value = p.description || "";
  window.scrollTo({top:0, behavior:"smooth"});
}

async function removeProduct(id) {
  if (!confirm("Hapus produk ini?")) return;
  try { await deleteDoc(doc(db,"products",id)); msg.textContent="Produk dihapus."; await loadProducts(); }
  catch(error) { console.error(error); msg.textContent=error.code+" - "+error.message; }
}

function esc(v){ return String(v ?? "").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c])); }
