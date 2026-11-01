# Linux Permissions & Special Bits

- **Kategori:** Linux Security
- **Target OS:** Ubuntu / Debian Server
- **Fokus:** Least privilege dan audit hak akses

---

## 1. Membaca Permission File

Permission Linux terdiri dari hak akses **owner**, **group**, dan **others**:

```bash
ls -l /etc/ssh/sshd_config
stat -c '%A %a %U:%G %n' /etc/ssh/sshd_config
```

Nilai `r`, `w`, dan `x` masing-masing bernilai `4`, `2`, dan `1`. Contohnya,
`640` berarti owner dapat membaca/menulis, group hanya membaca, dan pengguna
lain tidak memiliki akses.

## 2. Mengubah Hak Akses dengan Aman

Gunakan mode numerik atau simbolik sesuai kebutuhan, lalu verifikasi hasilnya:

```bash
sudo chown root:root /etc/ssh/sshd_config
sudo chmod 640 /etc/ssh/sshd_config
stat -c '%A %a %U:%G %n' /etc/ssh/sshd_config
```

Hindari `chmod -R 777`. Permission tersebut memberikan hak tulis kepada semua
pengguna dan dapat mengubah direktori aplikasi menjadi jalur eskalasi hak akses.

## 3. Special Bits

### SUID

SUID membuat executable berjalan dengan identitas owner-nya. Audit file SUID
yang tidak diperlukan:

```bash
find / -xdev -perm -4000 -type f -printf '%m %u:%g %p\n' 2>/dev/null
```

Setiap binary yang ditemukan perlu dibandingkan dengan baseline distribusi dan
dicatat alasan bisnisnya.

### SGID

SGID pada direktori membuat file baru mewarisi group direktori. Ini berguna
untuk direktori kolaborasi, tetapi group tersebut harus berisi anggota minimum:

```bash
find / -xdev -type d -perm -2000 -printf '%m %u:%g %p\n' 2>/dev/null
```

### Sticky Bit

Sticky bit membatasi penghapusan file di direktori bersama hanya kepada owner
file, owner direktori, atau root. `/tmp` biasanya memiliki mode `1777`:

```bash
stat -c '%A %a %n' /tmp
```

## 4. Checklist Audit

1. Pastikan file konfigurasi sensitif dimiliki `root` atau service account yang
   tepat.
2. Cari permission world-writable pada filesystem yang relevan.
3. Tinjau binary SUID/SGID terhadap baseline dan perubahan terbaru.
4. Gunakan ACL hanya jika permission standar tidak cukup, lalu dokumentasikan
   setiap pengecualian.

```bash
find /etc /opt /var/www -xdev -type f -perm -0002 -ls 2>/dev/null
getfacl -p /path/to/resource 2>/dev/null
```

Audit permission adalah proses verifikasi, bukan alasan untuk mengubah file
secara massal. Uji perubahan di lingkungan lab dan simpan hasil sebelum/sesudah
agar regresi mudah dilacak.
