# SSH Hardening & Key Authentication

- **Kategori:** Linux Security
- **Target OS:** Ubuntu / Debian Server
- **Metrik:** CIS Benchmark Baseline

---

## 1. Algoritma Kunci Kriptografi
Hindari penggunaan RSA lama (`1024/2048-bit`). Gunakan enkripsi kurva eliptik **Ed25519**:

```bash
ssh-keygen -t ed25519 -a 100 -C "andar@workstation"
```

Jangan pernah membagikan private key. Simpan public key dengan ekstensi `.pub`
dan lindungi private key dengan passphrase yang kuat.

## 2. Instalasi Public Key

Pasang public key ke akun server tanpa menyalin private key:

```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server
ssh -o PreferredAuthentications=publickey user@server
```

Pastikan koneksi key-based berhasil sebelum mengubah konfigurasi daemon.

## 3. Konfigurasi `sshd`

Edit drop-in configuration agar perubahan mudah diaudit:

```bash
sudo install -d -m 755 /etc/ssh/sshd_config.d
```

Isi file dengan baseline berikut, lalu sesuaikan dengan kebutuhan akun dan
operasional server:

```text
PubkeyAuthentication yes
PasswordAuthentication no
KbdInteractiveAuthentication no
PermitRootLogin no
MaxAuthTries 3
X11Forwarding no
AllowGroups sshusers
```

Nama file di atas harus tidak memiliki spasi. Perintah yang benar:

```bash
sudoedit /etc/ssh/sshd_config.d/hardening.conf
```

Validasi konfigurasi sebelum reload agar sesi yang sedang aktif tidak ikut
terputus:

```bash
sudo sshd -t
sudo systemctl reload ssh
sudo systemctl is-active --quiet ssh && echo "sshd active"
```

Jangan menonaktifkan password authentication sebelum sedikitnya satu sesi
public-key yang baru diuji tetap terbuka.

## 4. Pembatasan Akses Tambahan

Gunakan firewall dan rate limiting sebagai lapisan tambahan, bukan pengganti
autentikasi yang benar:

```bash
sudo ufw allow from 10.10.10.0/24 to any port 22 proto tcp
sudo ufw enable
```

Untuk akses dari internet, pertimbangkan VPN atau bastion host. Jangan
mengandalkan pemindahan port SSH sebagai kontrol keamanan utama.

## 5. Verifikasi dan Audit

Periksa konfigurasi efektif dan log autentikasi setelah perubahan:

```bash
sudo sshd -T | grep -E '^(passwordauthentication|permitrootlogin|pubkeyauthentication|maxauthtries) '
sudo journalctl -u ssh --since "1 hour ago" --no-pager
```

Checklist minimum:

1. Private key memiliki passphrase dan permission `600`.
2. Akun administrator memakai `sudo`, bukan login root langsung.
3. Password authentication dinonaktifkan setelah key authentication diuji.
4. Akses port 22 dibatasi oleh jaringan, VPN, atau firewall.
5. Log SSH dikirim ke sistem monitoring dan ditinjau secara berkala.

Konfigurasi keamanan harus diuji di lab terlebih dahulu. Simpan backup
konfigurasi dan sediakan akses console/out-of-band sebelum melakukan perubahan
yang dapat mengunci administrator dari server.
