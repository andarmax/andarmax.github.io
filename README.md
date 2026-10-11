# andarmax.github.io

Personal website, dokumentasi homelab, dan catatan belajar cyber security. Dibangun murni menggunakan arsitektur statis tanpa CMS atau build tool yang rumit.

Live site: https://andarmax.github.io/

## Arsitektur & Struktur Direktori

```text
├── .github/workflows/ci.yml # Validasi berkas otomatis via GitHub Actions
├── .well-known/security.txt # RFC 9116 security disclosure policy
├── assets/
│   ├── css/main.css         # Desain global terpusat & komponen UI
│   └── js/matrix.js         # Canvas engine + pause toggle + prefers-reduced-motion
├── posts/
│   └── ssh-hardening.md     # Berkas catatan teknis berbasis Markdown murni
├── index.html               # Profil, technical specs, diagram homelab, & shell
├── roadmap.html             # Pelacak sasaran dan target materi
├── writeups.html            # Dynamic Markdown renderer (Marked.js) + live search
├── 404.html                 # Halaman error kustom terminal
├── andar.asc                # PGP Public Key
├── robots.txt               # Aturan crawling search engine
└── sitemap.xml              # Indeks halaman situs
