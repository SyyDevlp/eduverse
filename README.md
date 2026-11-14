# EDUVERSE Web (tanpa Termux)

Website statis EDUVERSE untuk diunggah ke GitHub dan diterbitkan melalui Vercel.

## Isi
- `index.html` — struktur website
- `styles.css` — tampilan responsif
- `app.js` — Supabase Auth, profil, permintaan teman, chat, dan contoh materi/kuis

## Cara menggunakan lewat HP
1. Unduh ZIP ini dan ekstrak di HP.
2. Buka repository GitHub `eduverse`.
3. Pilih **Add file → Upload files**.
4. Unggah `index.html`, `styles.css`, dan `app.js` dari folder hasil ekstrak. Unggah `README.md` juga jika diinginkan.
5. Commit changes.
6. Buka https://vercel.com, masuk dengan GitHub, pilih **Add New → Project**, lalu import repository `eduverse`.
7. Framework Preset pilih **Other**, Root Directory `/`, Build Command kosong, Output Directory `.`. Deploy.

## Supabase
Konfigurasi URL dan publishable key berada di bagian atas `app.js`. Publishable key boleh berada di browser jika RLS database benar. Jangan pernah memasukkan `service_role` key atau secret key.

Pastikan project Supabase memiliki tabel dan policy yang dibuat melalui SQL Editor sebelumnya. Aktifkan verifikasi email untuk akun. Untuk chat realtime, buka Database → Replication/ Publications dan aktifkan Realtime untuk tabel `messages` jika belum aktif.

## Catatan penting
- Materi dan kuis dalam paket ini masih contoh statis.
- Fitur chat membutuhkan dua akun uji yang saling menerima permintaan pertemanan.
- Sebelum dipakai pelajar secara luas, tambahkan pelaporan, moderasi, batas pesan, kebijakan privasi, serta pengaturan keselamatan. Jangan mengumpulkan data pribadi yang tidak diperlukan.
- Supabase Auth email confirmation bisa membuat pendaftaran menunggu verifikasi email.
