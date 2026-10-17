# uygulama – GES Robotu mobil uygulaması (PWA)

Sorumlu: YTS. Apple Developer / App Store gerekmez: telefonda adres açılır → **Ana Ekrana Ekle** → uygulama gibi çalışır (iPhone ve Android).

## Mimari
```
Robot ESP32 ─┐ESP-NOW
Depo ESP32 ──┴──► İstasyon ESP32 ──(telefon hotspot'u, 2,4 GHz, sabit kanal)──► Firebase Realtime Database ──► PWA
```
Veri yapısı ve paket tanımı: [`../docs/telemetri.md`](../docs/telemetri.md)

## Hemen dene (demo modu)
`public/firebase-config.js` boşken uygulama sahte verilerle çalışır:
```
cd uygulama/public
python -m http.server 8000      # sonra tarayıcıda http://localhost:8000
```

## Firebase kurulumu (bir kez)
1. https://console.firebase.google.com → **Proje ekle** (ör. `ges-robotu`), Analytics gerekmez.
2. **Build → Realtime Database → Create database** (konum: europe-west1), "locked mode".
3. **Build → Authentication → Email/Password**'ü aç. Kullanıcılar: 4 ekip üyesi + `istasyon@ges-robotu.local` (istasyon kartının hesabı).
4. **Proje ayarları → Web uygulaması ekle** → çıkan değerleri `public/firebase-config.js`'e yapıştır.
5. Bilgisayara Firebase CLI: `npm install -g firebase-tools` → `firebase login` → bu klasörde `firebase use --add` (projeyi seç).
6. Kuralları ve uygulamayı yayınla: `firebase deploy` → adres: `https://<proje>.web.app`
7. Telefonda adresi aç → paylaş menüsü → **Ana Ekrana Ekle**.

> `firebase-config.js` içindeki değerler gizli değildir (web uygulamaları için normaldir); güvenliği `database.rules.json` sağlar. Şifreleri repoya yazmayın.

## Ekranlar
Ana (durum, batarya, damacana suyu, bugün, temizlik kalitesi) · Geçmiş (7 günlük grafik, görevler) · Bakım (parça sayaçları, "Değiştirildi") · Uyarılar.
Uzaktan komut (`komut/`) v3'te eklenecek; acil durdurma her zaman donanımda kalır.
