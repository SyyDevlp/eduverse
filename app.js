// EDUVERSE frontend. Publishable key is intended for browser use; never put a service_role key here.
const SUPABASE_URL = "https://pgbftsrvhhpadrcxyxlm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_NtL5VICp7Drweiy-lfR9zA_Xg3H8uD2";
const { createClient } = window.supabase;
const db = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

let currentUser = null, profile = null, authMode = "login", selectedFriend = null, realtimeChannel = null;
const $ = id => document.getElementById(id);
const materials = [
  ["Matematika","🔢","Pola bilangan dan operasi hitung","SD"],["IPA","🌿","Mengenal ekosistem dan makhluk hidup","SD"],
  ["Bahasa Indonesia","📚","Ide pokok dan teks deskripsi","SD"],["Matematika","📐","Perbandingan dan persentase","SMP"],
  ["IPA","⚗️","Sistem tata surya dan energi","SMP"],["Informatika","💻","Algoritma dan berpikir komputasional","SMP"],
  ["Matematika","📈","Fungsi dan persamaan kuadrat","SMA"],["Bahasa Inggris","🌍","Reading comprehension","SMA"],
  ["Informatika","🧠","Dasar data dan pemrograman","SMA"]
];
function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2600)}
function esc(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function showAuthMessage(msg,error=false){$("authMessage").textContent=msg;$("authMessage").style.color=error?"#ff9baf":"#78f0c1"}
function setMode(mode){authMode=mode;$("loginTab").classList.toggle("active",mode==="login");$("signupTab").classList.toggle("active",mode==="signup");$("nameLabel").classList.toggle("hidden",mode==="login");$("authTitle").textContent=mode==="login"?"Selamat datang kembali":"Buat akun EDUVERSE";$("authSubtitle").textContent=mode==="login"?"Masuk untuk melanjutkan perjalanan belajarmu.":"Daftar dengan email dan nama panggilan."; $("authSubmit").textContent=mode==="login"?"Masuk ke EDUVERSE":"Buat akun";$("password").autocomplete=mode==="login"?"current-password":"new-password";showAuthMessage("")}
$("loginTab").onclick=()=>setMode("login");$("signupTab").onclick=()=>setMode("signup");
$("authForm").addEventListener("submit",async e=>{e.preventDefault();const email=$("email").value.trim(),password=$("password").value,display_name=$("displayName").value.trim();$("authSubmit").disabled=true;showAuthMessage("Memproses...");
 try{
  if(authMode==="signup"){
   if(!display_name)throw Error("Isi nama tampilan.");
   const {data,error}=await db.auth.signUp({email,password,options:{data:{display_name}}});if(error)throw error;
   if(data.session){await activateSession(data.user);toast("Akun berhasil dibuat!")}
   else{showAuthMessage("Pendaftaran diterima. Verifikasi email, lalu kembali ke sini dan masuk dengan email serta password.");return}
  } else {
   const {data,error}=await db.auth.signInWithPassword({email,password});if(error)throw error;
   await activateSession(data.user);
  }
 }catch(err){showAuthMessage(err.message||"Terjadi kesalahan.",true)}finally{$("authSubmit").disabled=false}
});
$("logoutBtn").onclick=async()=>{await db.auth.signOut();location.reload()};
function renderMaterials(target,level="SD",subject="Semua"){const list=materials.filter(m=>(m[3]===level)&&(subject==="Semua"||m[0]===subject));$(target).innerHTML=list.map(m=>`<article class="material-card"><span class="emoji">${m[1]}</span><h3>${esc(m[0])}</h3><p>${esc(m[2])}</p><span class="tag">${m[3]}</span></article>`).join("")||'<p class="muted">Belum ada materi untuk pilihan ini.</p>'}
function showPage(page){document.querySelectorAll(".page").forEach(p=>p.classList.add("hidden"));$("page-"+page).classList.remove("hidden");document.querySelectorAll(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.page===page));if(page==="friends")loadFriends();if(page==="chat")loadChatContacts()}
document.querySelectorAll(".nav-item").forEach(n=>n.onclick=()=>showPage(n.dataset.page));
document.querySelectorAll("[data-goto]").forEach(n=>n.onclick=()=>showPage(n.dataset.goto));
document.querySelectorAll(".level-card").forEach(n=>n.onclick=()=>{$("levelFilter").value=n.dataset.level;showPage("materials");renderMaterials("materialsList",n.dataset.level,$("subjectFilter").value)});
$("levelFilter").onchange=()=>renderMaterials("materialsList",$("levelFilter").value,$("subjectFilter").value);
$("subjectFilter").onchange=()=>renderMaterials("materialsList",$("levelFilter").value,$("subjectFilter").value);
function showApp(){ $("authView").classList.add("hidden");$("appView").classList.remove("hidden");$("headerUser").classList.remove("hidden");$("headerName").textContent=profile?.display_name||"Pelajar";$("welcomeName").textContent=profile?.display_name||"Pelajar";$("profileUsername").value=profile?.username||"";$("profileDisplay").value=profile?.display_name||"";$("profileBio").value=profile?.bio||"";$("profileAvatar").textContent=(profile?.display_name||"P").slice(0,1).toUpperCase();renderMaterials("homeMaterials","SD");renderMaterials("materialsList","SD")}
async function loadProfile(){
 let {data,error}=await db.from("profiles").select("*").eq("id",currentUser.id).maybeSingle();
 if(error)throw error;
 if(!data){
  const display_name=currentUser.user_metadata?.display_name||currentUser.email?.split("@")[0]||"Pelajar";
  const username="pelajar_"+currentUser.id.replace(/-/g,"").slice(0,10);
  const created=await db.from("profiles").insert({id:currentUser.id,username,display_name,bio:""}).select("*").single();
  if(created.error)throw created.error;data=created.data;
 }
 profile=data;showApp();
}
let profileActivation=null;
async function activateSession(user){
 if(!user)return;
 if(currentUser?.id===user.id&&profile)return;
 if(profileActivation)return profileActivation;
 currentUser=user;
 profileActivation=loadProfile().catch(err=>{showAuthMessage("Gagal memuat profil: "+(err.message||"kesalahan tidak diketahui"),true);throw err}).finally(()=>{profileActivation=null});
 return profileActivation;
}
$("profileForm").onsubmit=async e=>{e.preventDefault();const display_name=$("profileDisplay").value.trim(),bio=$("profileBio").value.trim();const {error}=await db.from("profiles").update({display_name,bio}).eq("id",currentUser.id);if(error){$("profileMessage").textContent=error.message;return}profile={...profile,display_name,bio};$("headerName").textContent=display_name;$("welcomeName").textContent=display_name;$("profileAvatar").textContent=display_name.slice(0,1).toUpperCase();$("profileMessage").textContent="Profil berhasil disimpan."};
async function loadFriends(){const {data,error}=await db.from("friendships").select("*").or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`);if(error){toast(error.message);return}const rows=data||[],incoming=rows.filter(r=>r.receiver_id===currentUser.id&&r.status==="pending"),accepted=rows.filter(r=>r.status==="accepted");$("friendCount").textContent=accepted.length;
 const ids=[...new Set(accepted.map(r=>r.sender_id===currentUser.id?r.receiver_id:r.sender_id).concat(incoming.map(r=>r.sender_id)))];let people={};if(ids.length){const p=await db.from("profiles").select("id,username,display_name").in("id",ids);(p.data||[]).forEach(x=>people[x.id]=x)}
 $("incomingRequests").innerHTML=incoming.map(r=>{const p=people[r.sender_id]||{};return `<div class="user-row"><div class="user-meta"><div class="mini-avatar">${esc((p.display_name||"P")[0])}</div><div><b>${esc(p.display_name||"Pelajar")}</b><small>@${esc(p.username||"")}</small></div></div><button class="button button-primary" data-accept="${r.id}">Terima</button></div>`}).join("")||'<small class="muted">Belum ada permintaan.</small>';
 $("friendsList").innerHTML=accepted.map(r=>{const id=r.sender_id===currentUser.id?r.receiver_id:r.sender_id,p=people[id]||{};return `<div class="user-row"><div class="user-meta"><div class="mini-avatar">${esc((p.display_name||"P")[0])}</div><div><b>${esc(p.display_name||"Pelajar")}</b><small>@${esc(p.username||"")}</small></div></div><button class="button button-secondary" data-chat="${id}">Chat</button></div>`}).join("")||'<small class="muted">Belum ada teman.</small>';
 document.querySelectorAll("[data-accept]").forEach(b=>b.onclick=()=>acceptRequest(b.dataset.accept));document.querySelectorAll("[data-chat]").forEach(b=>b.onclick=()=>{selectedFriend=b.dataset.chat;showPage("chat");loadChatContacts()})}
async function acceptRequest(id){const {error}=await db.from("friendships").update({status:"accepted"}).eq("id",id);if(error){toast(error.message);return}toast("Permintaan diterima.");loadFriends()}
$("searchBtn").onclick=async()=>{const q=$("userSearch").value.trim().replace(/^@/,"");if(q.length<3){toast("Masukkan minimal 3 karakter username.");return}const {data,error}=await db.from("profiles").select("id,username,display_name").ilike("username",`%${q}%`).neq("id",currentUser.id).limit(10);if(error){toast(error.message);return}$("searchResults").innerHTML=(data||[]).map(p=>`<div class="user-row"><div class="user-meta"><div class="mini-avatar">${esc((p.display_name||"P")[0])}</div><div><b>${esc(p.display_name)}</b><small>@${esc(p.username)}</small></div></div><button class="button button-primary" data-add="${p.id}">Tambah</button></div>`).join("")||'<small class="muted">Pengguna tidak ditemukan.</small>';document.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>sendRequest(b.dataset.add))};
async function sendRequest(id){const {error}=await db.from("friendships").insert({sender_id:currentUser.id,receiver_id:id});if(error){toast(error.code==="23505"?"Permintaan sudah pernah dibuat.":error.message);return}toast("Permintaan pertemanan terkirim.");}
async function loadChatContacts(){const {data,error}=await db.from("friendships").select("*").eq("status","accepted").or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`);if(error){toast(error.message);return}const ids=(data||[]).map(r=>r.sender_id===currentUser.id?r.receiver_id:r.sender_id);if(!ids.length){$("chatContacts").innerHTML='<small class="muted">Belum ada teman.</small>';return}const {data:people}=await db.from("profiles").select("id,display_name,username").in("id",ids);$("chatContacts").innerHTML=(people||[]).map(p=>`<button class="contact ${selectedFriend===p.id?"active":""}" data-contact="${p.id}">${esc(p.display_name)}<small>@${esc(p.username)}</small></button>`).join("");document.querySelectorAll("[data-contact]").forEach(b=>b.onclick=()=>{selectedFriend=b.dataset.contact;loadChatContacts();openConversation()});if(!selectedFriend||!ids.includes(selectedFriend))selectedFriend=ids[0];openConversation()}
async function openConversation(){if(!selectedFriend)return;const {data:p}=await db.from("profiles").select("display_name").eq("id",selectedFriend).single();$("chatTitle").textContent=p?.display_name||"Teman";$("chatInput").disabled=false;$("sendMessage").disabled=false;await loadMessages();if(realtimeChannel)db.removeChannel(realtimeChannel);realtimeChannel=db.channel("messages-"+[currentUser.id,selectedFriend].sort().join("-")).on("postgres_changes",{event:"INSERT",schema:"public",table:"messages"},payload=>{const m=payload.new;if((m.sender_id===currentUser.id&&m.receiver_id===selectedFriend)||(m.sender_id===selectedFriend&&m.receiver_id===currentUser.id))loadMessages()}).subscribe()}
async function loadMessages(){const {data,error}=await db.from("messages").select("*").or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${selectedFriend}),and(sender_id.eq.${selectedFriend},receiver_id.eq.${currentUser.id})`).order("created_at",{ascending:true}).limit(100);if(error){$("chatMessages").innerHTML=`<p class="message">${esc(error.message)}</p>`;return}$("chatMessages").innerHTML=(data||[]).map(m=>`<div class="bubble ${m.sender_id===currentUser.id?"mine":""}">${esc(m.content)}<small>${new Date(m.created_at).toLocaleString("id-ID",{hour:"2-digit",minute:"2-digit"})}</small></div>`).join("")||'<p class="muted">Belum ada pesan. Mulai dengan sapaan yang sopan.</p>';$("chatMessages").scrollTop=$("chatMessages").scrollHeight}
$("chatForm").onsubmit=async e=>{e.preventDefault();const content=$("chatInput").value.trim();if(!content||!selectedFriend)return;const {error}=await db.from("messages").insert({sender_id:currentUser.id,receiver_id:selectedFriend,content});if(error){toast(error.message);return}$("chatInput").value="";loadMessages()};
document.querySelectorAll(".quiz-options button").forEach(b=>b.onclick=()=>{const correct=b.dataset.answer==="96";$("quizFeedback").textContent=correct?"Benar! 12 × 8 = 96. Hebat!":"Belum tepat. Coba hitung 12 × 8 sekali lagi."; $("quizFeedback").style.color=correct?"#78f0c1":"#ffb2c0";$("nextQuiz").classList.remove("hidden");document.querySelectorAll(".quiz-options button").forEach(x=>x.disabled=true)});
$("nextQuiz").onclick=()=>{document.querySelectorAll(".quiz-options button").forEach(x=>x.disabled=false);$("quizFeedback").textContent="";$("nextQuiz").classList.add("hidden")};
async function boot(){
 try{const {data:{session}}=await db.auth.getSession();if(session){await activateSession(session.user)}}
 catch(e){showAuthMessage("Sesi ditemukan, tetapi profil gagal dimuat: "+(e.message||"silakan masuk kembali"),true)}
 db.auth.onAuthStateChange((event,session)=>{
  // Do not run Supabase queries inside this callback: it can wait on the auth lock.
  if(session){setTimeout(()=>{if(!currentUser||currentUser.id!==session.user.id)activateSession(session.user).catch(()=>{})},0)}
  else if(event==="SIGNED_OUT"){currentUser=null;profile=null;profileActivation=null;$("appView").classList.add("hidden");$("authView").classList.remove("hidden");$("headerUser").classList.add("hidden")}
 });
}
boot();
