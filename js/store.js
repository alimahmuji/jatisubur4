import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";
let items=[];
const money=n=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(Number(n)||0);
function render(){
 const q=document.querySelector("#search").value.toLowerCase();
 const list=items.filter(x=>(x.name+" "+x.category+" "+x.description).toLowerCase().includes(q));
 document.querySelector("#status").textContent=list.length?`${list.length} produk`:"Produk tidak ditemukan";
 document.querySelector("#products").innerHTML=list.map(x=>`<article class="card"><div class="photo">${x.image?`<img src="${x.image}" alt="${x.name||""}">`:"<span>JATI SUBUR4</span>"}</div><div class="cardbody"><small>${x.category||"Furniture"}</small><h3>${x.name||"Tanpa nama"}</h3><p>${x.description||""}</p><strong>${money(x.price)}</strong><button onclick="order('${String(x.name||"").replaceAll("'","\'")}')">Pesan via WhatsApp</button></div></article>`).join("");
}
window.order=name=>{const phone="6285640282336";location.href=`https://wa.me/${phone}?text=${encodeURIComponent("Halo Jati Subur4 Furniture, saya ingin memesan: "+name)}`};
async function load(){
 try {
   const snap=await getDocs(collection(db,"products"));
   items=snap.docs.map(d=>({id:d.id,...d.data()})).filter(x=>x.active!==false);
   render();
 } catch(e){ document.querySelector("#status").textContent="Gagal mengambil produk dari Firebase."; console.error("Firestore index error:",e); }
}
document.querySelector("#search").addEventListener("input",render); load();
