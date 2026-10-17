# Telemetri ve Firebase veri yapısı

Robot ve depo verilerini ESP-NOW ile istasyona yollar; istasyon ESP32 telefon hotspot'u üzerinden Firebase Realtime Database'e yazar. Uygulama (`uygulama/`) buradan okur. Bu yapı başlangıç önerisidir, ihtiyaca göre değiştirilebilir.

## Bağlantı
- Hotspot: **2,4 GHz**, kanal sabit (öneri: 6). ESP-NOW eşleri de aynı kanalda olmalı (istasyon STA modunda AP kanalını kullanır).
- İstasyon kimliği: Firebase Auth e-posta/şifre hesabı `istasyon@ges-robotu.local` (şifre `secrets.h`'de, repoya girmez). REST ile `idToken` alınır, `?auth=<idToken>` ile yazılır.
- Yazma sıklığı: `canli` 1 Hz (üzerine yazılır); `gunluk` 30 s'de bir; `gorevler`, `uyarilar` olay olduğunda.

## Yollar
| Yol | İçerik | Yazan |
|---|---|---|
| `canli` | Anlık durum (aşağıda) – tek kayıt, üzerine yazılır | İstasyon |
| `gunluk/YYYY-AA-GG` (yerel tarih, TR saati) | `{sure_s, alan_m2, su_l, enerji_wh}` | İstasyon |
| `gorevler/<id>` | `{bas, sure_s, alan_m2, su_l, enerji_wh, bitis_nedeni}` | İstasyon |
| `uyarilar/<id>` | `{ts, seviye: bilgi/uyari/kritik, mesaj, kod}` | İstasyon |
| `bakim/<parca>` | `{ad, sayac, esik, birim, son_degisim, not}` – sayaçları istasyon artırır, sıfırlamayı uygulama yapar | İstasyon + uygulama |
| `komut` | (v3) `{istek: BASLA/DON/DUR, ts, kim}` – robot ancak güvenli koşullarda uygular | Uygulama |

## `canli` alanları
| Alan | Birim | Kaynak |
|---|---|---|
| `durum` | BEKLEMEDE / TEMIZLIYOR / TIRMANIYOR / DONUYOR / SARJ / HATA / ACIL_STOP | Robot durum makinesi |
| `batarya_yuzde`, `batarya_v`, `akim_a` | %, V, A | INA226 (akım sayma) |
| `sicaklik_bat` | °C | DS18B20 |
| `su_litre`, `su_dk_kaldi` | L, dk | Damacana tartısı (yük hücresi + HX711); kalan = su / ortalama debi |
| `sira`, `konum_m` | –, m | Yapılandırılmış harita + enkoder |
| `kir_on`, `kir_arka` | ham değer | Keyence CZ-V21A (H35S fırça önü, H32 arkası) |
| `firca_akim_a` | A | Fırça motoru akımı (yıpranma trendi için) |
| `ts` | ms (Unix) | İstasyon saati (NTP) |

## Bakım sayaçları (başlangıç eşikleri – tahmini, testle güncellenecek)
| Parça | Sayaç | Eşik | Not |
|---|---|---|---|
| Rulo fırça | çalışma saati | 100 saat | Ayrıca aynı devir/baskıda fırça akımı trendi ve CZ temizlik kalitesi izlenir |
| Palet kayışları | km | 50 km | Enkoder mesafesi |
| Sürüş motorları | saat | 500 saat | |
| Pompa | saat | 300 saat | Depo kartı |
| Nozul/süzgeç temizliği | saat | 20 saat | |
| Batarya | döngü | 2000 döngü | LiFePO4 |

## Ek donanım
Damacana tartısı (50 kg yük hücresi + HX711) ve pompa çıkışına akış sensörü (YF-S201 tipi) – depo kartına bağlanır.
