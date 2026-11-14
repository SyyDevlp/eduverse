// EDUVERSE frontend. Publishable key is intended for browser use; never put a service_role key here.
const SUPABASE_URL = "https://pgbftsrvhhpadrcxyxlm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_NtL5VICp7Drweiy-lfR9zA_Xg3H8uD2";
const { createClient } = window.supabase;
const db = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

let currentUser = null, profile = null, authMode = "login", selectedFriend = null, realtimeChannel = null;
const $ = id => document.getElementById(id);
const curriculum = {
 SD: {
  "Matematika":["Bilangan dan operasi hitung","Pecahan dalam kehidupan","Pengukuran dan bangun datar","Keliling dan luas","Pola bilangan","Data sederhana"],
  "Bahasa Indonesia":["Ide pokok dan informasi penting","Teks deskripsi","Cerita dan unsur cerita","Puisi anak","Petunjuk dan prosedur","Menyampaikan pendapat"],
  "IPAS":["Tubuh dan kesehatan","Makhluk hidup dan habitat","Ekosistem dan rantai makanan","Wujud dan perubahan benda","Gaya dan energi","Bumi dan lingkungan"],
  "Pendidikan Pancasila":["Nilai-nilai Pancasila","Aturan dan tanggung jawab","Hak dan kewajiban","Hidup rukun dalam keberagaman","Musyawarah","Cinta lingkungan"],
  "Bahasa Inggris":["Greetings and introductions","Numbers, days, and time","Things around us","Family and friends","Daily activities","Simple descriptions"],
  "Seni Budaya":["Unsur seni rupa","Warna dan komposisi","Pola irama","Mengenal alat musik","Gerak dan tari","Karya dari bahan sekitar"],
  "PJOK":["Gerak dasar","Permainan bola besar","Permainan bola kecil","Kebugaran jasmani","Kesehatan diri","Keselamatan saat beraktivitas"],
  "Informatika":["Mengenal perangkat digital","Berpikir komputasional","Urutan instruksi","Data dan informasi","Etika digital","Keamanan akun"],
  "Pendidikan Agama dan Budi Pekerti":["Bersikap jujur dan amanah","Menghormati sesama","Syukur dan kepedulian","Disiplin dalam keseharian","Menjaga kebersihan","Berbuat baik di lingkungan"]
 },
 SMP: {
  "Matematika":["Bilangan bulat dan pecahan","Perbandingan dan skala","Aljabar dasar","Persamaan linear","Bangun datar dan ruang","Statistika dan peluang"],
  "Bahasa Indonesia":["Teks deskripsi dan laporan","Teks prosedur","Teks eksplanasi","Cerita fantasi dan cerpen","Puisi dan majas","Teks persuasi dan diskusi"],
  "Bahasa Inggris":["Descriptive text","Recount text","Procedure text","Present and past tense","Expressions and conversations","Reading comprehension"],
  "IPA":["Organisasi kehidupan","Zat dan perubahannya","Gerak dan gaya","Energi dan pesawat sederhana","Sistem tubuh manusia","Ekologi dan bumi"],
  "IPS":["Interaksi sosial","Kegiatan ekonomi","Kondisi geografis Indonesia","Sejarah Nusantara","Mobilitas sosial","Perdagangan dan globalisasi"],
  "Pendidikan Pancasila":["Pancasila sebagai dasar negara","Norma dan konstitusi","Bhinneka Tunggal Ika","Hak asasi dan kewajiban","Demokrasi dan musyawarah","Persatuan Indonesia"],
  "Informatika":["Berpikir komputasional","Sistem komputer","Jaringan dan internet","Data dan representasi","Algoritma dan pemrograman","Dampak sosial informatika"],
  "Pendidikan Agama dan Budi Pekerti":["Keimanan dan rasa syukur","Ibadah dan kedisiplinan","Akhlak dalam pergaulan","Toleransi dan kepedulian","Sejarah dan keteladanan","Menjaga alam"],
  "PJOK":["Permainan bola besar","Permainan bola kecil","Atletik dasar","Kebugaran jasmani","Aktivitas ritmik","Pola hidup sehat"],
  "Seni Budaya":["Menggambar dan desain","Ragam hias","Musik dan irama","Ansambel sederhana","Seni tari daerah","Apresiasi karya"],
  "Prakarya":["Kerajinan bahan lunak","Kerajinan bahan keras","Budidaya sederhana","Pengolahan pangan","Rekayasa sederhana","Wirausaha kreatif"]
 },
 SMA: {
  "Matematika": ["Persamaan dan pertidaksamaan","Fungsi dan grafik","Trigonometri","Limit fungsi","Turunan dan penerapan","Statistika dan peluang"],
  "Bahasa Indonesia":["Teks laporan hasil observasi","Teks eksposisi dan argumentasi","Teks negosiasi","Cerita sejarah dan cerpen","Kritik dan esai","Karya ilmiah"],
  "Bahasa Inggris":["Analytical exposition","Narrative and recount","Discussion text","Conditional sentences","Passive voice","Academic reading"],
  "Fisika":["Pengukuran dan vektor","Gerak lurus dan melingkar","Hukum Newton","Usaha dan energi","Gelombang dan bunyi","Listrik dan magnet"],
  "Kimia":["Struktur atom","Sistem periodik unsur","Ikatan kimia","Stoikiometri","Larutan dan asam basa","Reaksi redoks"],
  "Biologi":["Keanekaragaman hayati","Struktur dan fungsi sel","Sistem organ manusia","Genetika dasar","Evolusi","Ekosistem dan perubahan lingkungan"],
  "Ekonomi":["Konsep dasar ekonomi","Permintaan dan penawaran","Pasar dan harga","Lembaga keuangan","Kebijakan fiskal dan moneter","Akuntansi dasar"],
  "Sejarah":["Konsep berpikir sejarah","Peradaban awal dunia","Kerajaan Nusantara","Kolonialisme dan perlawanan","Pergerakan nasional","Indonesia merdeka"],
  "Geografi":["Konsep dan prinsip geografi","Peta dan penginderaan jauh","Dinamika litosfer","Atmosfer dan iklim","Kependudukan","Mitigasi bencana"],
  "Sosiologi":["Individu dan masyarakat","Interaksi sosial","Nilai dan norma","Kelompok sosial","Konflik dan integrasi","Perubahan sosial"],
  "Informatika":["Algoritma dan pemrograman","Struktur data","Basis data","Jaringan komputer","Keamanan dan privasi digital","Kecerdasan artifisial"],
  "Pendidikan Pancasila":["Pancasila dalam kehidupan","Konstitusi dan UUD 1945","Demokrasi Indonesia","Hak dan kewajiban warga","Bhinneka Tunggal Ika","Tantangan kebangsaan"],
  "PJOK":["Strategi permainan olahraga","Kebugaran dan latihan","Atletik dan keterampilan gerak","Aktivitas ritmik","Kesehatan remaja","Pencegahan cedera"],
  "Seni Budaya":["Unsur dan prinsip seni rupa","Desain dan karya visual","Musik dan komposisi","Seni tari dan ekspresi","Teater dan pertunjukan","Kritik dan apresiasi seni"],
  "Prakarya dan Kewirausahaan":["Peluang usaha","Riset kebutuhan pengguna","Perencanaan produk","Produksi dan kualitas","Pemasaran digital","Evaluasi usaha"]
 }
};
const levels = Object.keys(curriculum);
let selectedSubject = "", selectedLevel = "SD", selectedChapter = 0, selectedMode = "seru";
const lessonQuestions = [
 {q:"Apa gagasan utama yang paling penting dari materi ini?",a:["Konsep inti yang dijelaskan","Contoh yang tidak berkaitan","Informasi tambahan yang tidak dibahas"],correct:0},
 {q:"Mengapa konsep ini berguna dalam kehidupan atau pelajaran berikutnya?",a:["Tidak memiliki kegunaan","Membantu memahami dan menerapkan konsep","Hanya untuk dihafalkan"],correct:1}
];
function makeChapters(level,subject){return curriculum[level][subject].map((title,i)=>({title,content:`Pada bab ${i+1}, kita mempelajari ${title.toLowerCase()}. Mulailah dengan memahami pengertian dan tujuan pembahasannya. Perhatikan istilah penting, hubungan antar gagasan, serta contoh yang diberikan guru atau buku pelajaran.`,points:[`Kenali pengertian utama dari ${title.toLowerCase()}.`,`Hubungkan konsep dengan contoh sederhana dalam kehidupan sehari-hari.`,`Catat satu hal yang masih ingin kamu tanyakan atau diskusikan.`],activity:`Tuliskan ringkasan tiga kalimat tentang ${title.toLowerCase()}, lalu ceritakan satu contoh yang kamu temukan.`}))}
function renderMaterials(target,level="SD",subject="Semua"){
 selectedLevel=level;const names=Object.keys(curriculum[level]||{}).filter(n=>subject==="Semua"||n===subject);
 $(target).innerHTML=names.map(name=>`<article class="material-card"><span class="subject-index">${String(Object.keys(curriculum[level]).indexOf(name)+1).padStart(2,"0")}</span><h3>${esc(name)}</h3><p>${curriculum[level][name].length} bab pembelajaran tersedia untuk jenjang ${level}.</p><button class="button button-secondary" data-subject="${esc(name)}" data-level="${level}">Belajar materi ini</button></article>`).join("");
 $(target).querySelectorAll("[data-subject]").forEach(b=>b.onclick=()=>openSubject(b.dataset.level,b.dataset.subject));
}
function openSubject(level,subject){selectedLevel=level;selectedSubject=subject;const chapters=makeChapters(level,subject);$("subjectHeading").textContent=subject;$("subjectIntro").textContent=`${level} · ${chapters.length} bab tersedia. Pilih bab yang ingin kamu pelajari.`;$("chapterList").innerHTML=chapters.map((c,i)=>`<button class="chapter-row" data-chapter="${i}"><span class="chapter-number">BAB ${String(i+1).padStart(2,"0")}</span><span class="chapter-name">${esc(c.title)}</span><span class="chapter-arrow">Buka</span></button>`).join("");$("chapterList").querySelectorAll("[data-chapter]").forEach(b=>b.onclick=()=>openLesson(Number(b.dataset.chapter)));showPage("subject")}
function openLesson(index){selectedChapter=index;const c=makeChapters(selectedLevel,selectedSubject)[index];$("lessonHeading").textContent=c.title;$("lessonBreadcrumb").textContent=`${selectedLevel} / ${selectedSubject} / Bab ${index+1}`;$("lessonContent").innerHTML=`<p>${esc(c.content)}</p><h3>Hal penting untuk diingat</h3><ul>${c.points.map(x=>`<li>${esc(x)}</li>`).join("")}</ul><div class="activity-note"><b>Aktivitas singkat</b><p>${esc(c.activity)}</p></div>`;$("modeSeru").classList.toggle("selected",selectedMode==="seru");$("modeSantai").classList.toggle("selected",selectedMode==="santai");$("modeTeman").classList.toggle("selected",selectedMode==="teman");$("lessonModeInfo").textContent=selectedMode==="seru"?"Belajar aktif: baca bagian penting, lalu buat contoh sendiri.":selectedMode==="santai"?"Belajar santai: baca perlahan, berhenti sejenak, lalu tulis ringkasan dengan bahasamu sendiri.":"Belajar bersama: ajak teman yang kamu kenal, baca bergantian, lalu kerjakan soal masing-masing dan diskusikan alasannya.";$("questionArea").classList.add("hidden");showPage("lesson")}
function showQuestions(){const title=makeChapters(selectedLevel,selectedSubject)[selectedChapter].title;const qs=[{q:`Apa fokus utama yang dipelajari dalam bab "${title}"?`,a:[title,"Topik yang tidak berkaitan","Hanya menghafal istilah tanpa memahami"],correct:0},{q:`Cara belajar mana yang paling membantu memahami "${title}"?`,a:["Melewati bacaan dan langsung menebak","Memahami konsep, melihat contoh, lalu mencoba latihan","Menghafal judul tanpa membaca isi"],correct:1}];$("questionArea").classList.remove("hidden");$("questionArea").innerHTML=`<h2>Latihan setelah membaca</h2><p class="muted">Dua soal disediakan: soal pertama untuk kamu dan soal kedua untuk teman belajarmu.</p>${qs.map((q,i)=>`<div class="question-card"><span class="tag">${i===0?"SOAL KAMU":"SOAL TEMAN"}</span><h3>${esc(q.q)}</h3><div class="answer-options">${q.a.map((a,j)=>`<button data-q="${i}" data-a="${j}">${esc(a)}</button>`).join("")}</div><p class="answer-feedback" id="feedback${i}"></p></div>`).join("")}<p class="muted">Jika belajar bersama, minta teman memilih jawabannya sendiri. Diskusikan alasan setelah keduanya menjawab.</p>`;$("questionArea").insertAdjacentHTML("beforeend",`<div class="study-room-tools"><h3>Belajar tersinkron dengan teman</h3><p class="muted">Buat ruang bersama teman yang sudah menjadi teman EDUVERSE. Jawaban dan status akan diperbarui langsung.</p><button id="createStudyRoom" class="button button-primary">Buat ruang dan undang teman</button><button id="refreshStudyInvites" class="button button-secondary">Lihat undangan masuk</button><div id="studyRoomStatus" class="muted"></div><div id="studyInviteList"></div><div id="studyRoomAnswers"></div></div>`);$("createStudyRoom").onclick=createStudyRoom;$("refreshStudyInvites").onclick=loadStudyInvites;loadStudyInvites();$("questionArea").querySelectorAll("[data-q]").forEach(b=>b.onclick=()=>{const q=Number(b.dataset.q),correct=qs[q].correct;const all=$("questionArea").querySelectorAll(`[data-q="${q}"]`);all.forEach(x=>x.disabled=true);$("feedback"+q).textContent=Number(b.dataset.a)===correct?"Jawaban tepat. Bagus, lanjutkan!":"Belum tepat. Baca kembali materi dan diskusikan alasannya.";$("feedback"+q).classList.toggle("correct",Number(b.dataset.a)===correct)})}


let studyRoomChannel=null, activeStudyRoom=null;
async function createStudyRoom(){
 const username=prompt("Masukkan username teman EDUVERSE yang sudah menerima permintaan pertemanan:");if(!username)return;
 const {data:friend,error:findError}=await db.from("profiles").select("id,display_name").eq("username",username.replace(/^@/,"")).maybeSingle();
 if(findError||!friend){toast("Teman tidak ditemukan.");return}if(friend.id===currentUser.id){toast("Pilih akun teman, bukan akun sendiri.");return}
 const {data:links,error:linkError}=await db.from("friendships").select("id").eq("status","accepted").or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${friend.id}),and(sender_id.eq.${friend.id},receiver_id.eq.${currentUser.id})`).limit(1);
 if(linkError||!links?.length){toast("Kalian harus berteman terlebih dahulu.");return}
 const chapter=makeChapters(selectedLevel,selectedSubject)[selectedChapter].title;
 const code=Math.random().toString(36).slice(2,8).toUpperCase();
 const {data:room,error}=await db.from("study_rooms").insert({room_code:code,host_id:currentUser.id,guest_id:friend.id,level:selectedLevel,subject:selectedSubject,chapter_title:chapter}).select("*").single();
 if(error){toast("Gagal membuat ruang: "+error.message);return}
 activeStudyRoom=room;$("studyRoomStatus").textContent=`Undangan dibuat untuk ${friend.display_name}. Kode ruang: ${code}. Teman dapat membuka bab yang sama dan memilih Lihat undangan masuk.`;
 subscribeStudyRoom(room.id);await renderStudyRoomAnswers();
}
async function loadStudyInvites(){
 const box=$("studyInviteList");if(!box)return;
 const {data,error}=await db.from("study_rooms").select("*").eq("guest_id",currentUser.id).eq("status","active").order("created_at",{ascending:false}).limit(10);
 if(error){box.textContent="Tidak dapat memuat undangan: "+error.message;return}
 box.innerHTML=(data||[]).map(r=>`<div class="user-row"><div><b>${esc(r.subject)} — ${esc(r.chapter_title)}</b><small>${esc(r.level)} · Kode ${esc(r.room_code)}</small></div><button class="button button-secondary" data-join-room="${r.id}">Gabung</button></div>`).join("")||'<small class="muted">Belum ada undangan belajar.</small>';
 box.querySelectorAll("[data-join-room]").forEach(b=>b.onclick=()=>joinStudyRoom(b.dataset.joinRoom));
}
async function joinStudyRoom(id){const {data:room,error}=await db.from("study_rooms").select("*").eq("id",id).single();if(error||!room){toast("Ruang belajar tidak ditemukan.");return}activeStudyRoom=room;selectedLevel=room.level;selectedSubject=room.subject;const chapters=makeChapters(room.level,room.subject);selectedChapter=Math.max(0,chapters.findIndex(c=>c.title===room.chapter_title));$("studyRoomStatus").textContent=`Terhubung ke ruang ${room.room_code}. Jawaban akan tersinkron otomatis.`;subscribeStudyRoom(room.id);await renderStudyRoomAnswers()}
function subscribeStudyRoom(id){if(studyRoomChannel)db.removeChannel(studyRoomChannel);studyRoomChannel=db.channel("study-room-"+id).on("postgres_changes",{event:"*",schema:"public",table:"study_room_answers",filter:"room_id=eq."+id},()=>renderStudyRoomAnswers()).on("postgres_changes",{event:"UPDATE",schema:"public",table:"study_rooms",filter:"id=eq."+id},payload=>{activeStudyRoom=payload.new;renderStudyRoomAnswers()}).subscribe()}
async function renderStudyRoomAnswers(){if(!activeStudyRoom)return;const box=$("studyRoomAnswers");if(!box)return;const {data:answers,error}=await db.from("study_room_answers").select("*").eq("room_id",activeStudyRoom.id).order("question_no");if(error){box.textContent=error.message;return}const rows=answers||[];const users=[{id:activeStudyRoom.host_id,label:"Peserta 1"},{id:activeStudyRoom.guest_id,label:"Peserta 2"}];box.innerHTML=`<h3>Status jawaban</h3>`+users.map((u,i)=>{const a=rows.find(x=>x.user_id===u.id);return `<p>${u.label}: ${a?`Sudah menjawab soal ${a.question_no} · ${a.is_correct?"Benar":"Perlu dipelajari lagi"}`:"Belum menjawab"}</p>`}).join("")+`<p class="muted">Ruang: ${esc(activeStudyRoom.room_code)} · Bab: ${esc(activeStudyRoom.chapter_title)}</p>`;
 const myNo=currentUser.id===activeStudyRoom.host_id?1:2;const existing=rows.find(x=>x.user_id===currentUser.id&&x.question_no===myNo);const questionTitle=activeStudyRoom.chapter_title;const choices=[questionTitle,"Topik yang tidak berkaitan","Menghafal judul tanpa memahami isi"];
 if(!existing){box.insertAdjacentHTML("beforeend",`<h4>Soal untuk kamu</h4><p>Apa fokus utama yang dipelajari dalam bab ${esc(questionTitle)}?</p><div class="answer-options">${choices.map((a,i)=>`<button data-room-answer="${i}">${esc(a)}</button>`).join("")}</div>`);box.querySelectorAll("[data-room-answer]").forEach(b=>b.onclick=()=>submitRoomAnswer(myNo,Number(b.dataset.roomAnswer)))}else{box.insertAdjacentHTML("beforeend",`<p>Jawabanmu sudah tersimpan. ${existing.is_correct?"Jawaban tepat.":"Silakan diskusikan kembali materi dengan teman."}</p>`)}
}
async function submitRoomAnswer(no,index){const {error}=await db.from("study_room_answers").upsert({room_id:activeStudyRoom.id,user_id:currentUser.id,question_no:no,answer_index:index,is_correct:index===0,updated_at:new Date().toISOString()},{onConflict:"room_id,user_id,question_no"});if(error){toast("Jawaban gagal disimpan: "+error.message);return}await renderStudyRoomAnswers()}

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
function showPage(page){document.querySelectorAll(".page").forEach(p=>p.classList.add("hidden"));$("page-"+page).classList.remove("hidden");document.querySelectorAll(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.page===page));if(page==="friends")loadFriends();if(page==="chat")loadChatContacts()}
document.querySelectorAll(".nav-item").forEach(n=>n.onclick=()=>showPage(n.dataset.page));
document.querySelectorAll("[data-goto]").forEach(n=>n.onclick=()=>showPage(n.dataset.goto));
document.querySelectorAll(".level-card").forEach(n=>n.onclick=()=>{$("levelFilter").value=n.dataset.level;showPage("materials");renderMaterials("materialsList",n.dataset.level)});
$("levelFilter").onchange=()=>renderMaterials("materialsList",$("levelFilter").value);
$("backToCatalog").onclick=()=>showPage("materials");$("backToSubject").onclick=()=>openSubject(selectedLevel,selectedSubject);
["modeSeru","modeSantai","modeTeman"].forEach(id=>$(id).onclick=()=>{selectedMode=id==="modeSeru"?"seru":id==="modeSantai"?"santai":"teman";openLesson(selectedChapter)});
$("startQuestions").onclick=showQuestions;
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
