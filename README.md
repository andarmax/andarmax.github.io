# andarmax.github.io

Personal website dan catatan belajar cyber security. Dibangun murni menggunakan vanilla HTML, CSS, dan JavaScript tanpa framework maupun library pihak ketiga.

Live site: https://andarmax.github.io/

## Struktur
- `index.html` — Halaman utama (profil, fokus, keahlian teknis, dan project/lab).
- `roadmap.html` — Pelacak progres belajar dan target materi.
- `writeups.html` — Catatan ringkas seputar Linux, jaringan, dan keamanan sistem.

## Catatan Teknis
- Animasi matrix rain dirender via HTML5 Canvas dengan `requestAnimationFrame` agar hemat resource saat tab di latar belakang.
- Layout responsive menggunakan CSS native (CSS variables, Flexbox, CSS Grid).
- Zero dependencies.

## Menjalankan Lokal
Buka `index.html` langsung di browser, atau jalankan local server:

```bash
git clone [https://github.com/andarmax/andarmax.github.io.git](https://github.com/andarmax/andarmax.github.io.git)
cd andarmax.github.io
python3 -m http.server 8000
