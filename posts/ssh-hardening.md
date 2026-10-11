# SSH Hardening & Key Authentication

- **Kategori:** Linux Security
- **Target OS:** Ubuntu / Debian Server
- **Metrik:** CIS Benchmark Baseline

---

## 1. Algoritma Kunci Kriptografi
Hindari penggunaan RSA lama (`1024/2048-bit`). Gunakan enkripsi kurva eliptik **Ed25519**:

```bash
ssh-keygen -t ed25519 -a 100 -C "andar@workstation"
