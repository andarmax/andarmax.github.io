# Incident Response Basics

- **Kategori:** Blue Team / Defense
- **Fokus:** Triage, containment, dan dokumentasi insiden

---

## 1. Preservasi Sebelum Perubahan

Catat waktu, host, akun yang terlibat, dan sumber alert. Hindari menghapus file
atau merestart sistem sebelum bukti yang dibutuhkan diamankan.

```bash
date -Is
hostnamectl
who
sudo journalctl --since "1 hour ago" --no-pager > incident-journal.txt
```

Simpan hash dan chain of custody untuk artefak yang dipindahkan dari host:

```bash
sha256sum incident-journal.txt
```

## 2. Triage dan Containment

Validasi apakah aktivitas masih berlangsung, lalu batasi jalur serangan dengan
perubahan yang paling kecil dan dapat dibalik.

```bash
ps aux --sort=-%cpu | head
ss -tulpn
sudo last -a | head -20
```

Contoh containment adalah memutus host dari VLAN produksi melalui kontrol
jaringan. Jangan langsung menghapus malware karena tindakan tersebut dapat
merusak bukti dan menyulitkan analisis akar masalah.

## 3. Analisis dan Pemulihan

Bandingkan log dengan baseline, rotasi kredensial yang mungkin terekspos, dan
patch vektor masuk setelah bukti utama dikumpulkan. Pulihkan dari backup yang
terverifikasi, bukan dari snapshot yang belum diketahui statusnya.

Catat timeline berikut:

1. Waktu alert pertama dan siapa yang memvalidasi.
2. Sistem, akun, dan data yang terdampak.
3. Tindakan containment beserta hasilnya.
4. Bukti yang dikumpulkan dan lokasi penyimpanannya.
5. Perbaikan permanen dan langkah pencegahan berulang.

## 4. Aturan Praktis

- Jangan menebak dampak tanpa bukti; tandai asumsi secara eksplisit.
- Gunakan kanal komunikasi insiden yang terpisah dari host terdampak.
- Batasi akses artefak sesuai kebutuhan dan simpan checksum.
- Lakukan post-incident review dan ubah temuan menjadi kontrol atau deteksi.
