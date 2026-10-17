# Karar kaydı

Tasarım kararları burada tutulur. Kayıt bir izin süreci değildir; herkes kararı değiştirebilir, yalnızca neyin neden değiştiği görünsün diye satır eklenir. Karar değişirse eski satır silinmez; "Durum" sütunu **geçersiz** yapılır ve yeni satır eklenir.

| # | Tarih | Karar | Gerekçe | Karar veren | Durum |
|---|---|---|---|---|---|
| 1 | 09.2026 | Paletli yürüyüş (HTD 5M 25 mm, C = 520 mm) | Ağırlığı geniş şeride yayar, modül boşluklarını geçer; tekerlekte ıslak camda kayma bildirilmiş | Ekip | Geçerli – palet genişliği Faz-1 testine bağlı (40–60 mm) |
| 2 | 09.2026 | 12 V 60 rpm 16 kgf·cm sonsuz vidalı motor (sürüş + fırça aynı model) | Bataryayla doğrudan çalışır, enerjisizken kendinden kilitli, tek tip yedek | Ekip | Geçerli – tork payı ≈1,1; 24 V seçeneği açık |
| 3 | 09.2026 | Tek beyin ESP32-S3 + Arduino Nano harici watchdog + donanım E-stop | Kamera kalkınca Pi gereksiz; güvenlik yazılımdan bağımsız | Ekip | Geçerli |
| 4 | 10.2026 | Temizlik: su + rulo fırça | Nem/çiy tozu cama yapıştırır, kuru temizlik yetersiz | Ekip | Geçerli |
| 5 | 10.2026 | Kamera yok; kir tespiti sensörle | Maliyet, işlem gücü, güneşte görüntü sorunları | Ekip | Geçerli |
| 6 | 10.2026 | Pompa robotta (0,57 kg) | – | Ekip | **Geçersiz** → #7 |
| 7 | 10.2026 | Pompa depo/damacana yanında, basınç şalterli; robotta yalnız NC vana | Emiş yüksekliği sınırı (≈1,8 m) panel yüksekliğinde riskli; robot 0,42 kg hafifler; su kontrolü haberleşmeden bağımsız | Ekip | Geçerli |
| 8 | 10.2026 | Prototip deposu 19 L damacana | Basit prototip; ≈30–60 m² temizlik yeter | YTS | Geçerli |
| 9 | 10.2026 | Robot ↔ depo/istasyon ESP-NOW, 1 Hz yaşam sinyali, 3 s kayıpta pompa kapanır | Wi-Fi altyapısız, düşük gecikme; güvenlik kablolu kalır | Ekip | Geçerli |
| 10 | 10.2026 | Konum: yapılandırılmış harita + enkoder + manyetometresiz IMU, kenarda/istasyonda sıfırlama | Panel sırası sabit dikdörtgen; SLAM gereksiz | Ekip | Geçerli |
| 11 | 10.2026 | Şarj: Type-C atölye girişi | – | YTS | **Geçersiz** → #12 |
| 12 | 10.2026 | Şarj yalnız kontaklı istasyondan (IR işaret + V kılavuz + yaylı kontak, 14,6 V CC/CV); robotta ayrı soket yok | Açık havada soket su/toz alır; otomatik yerleşmede fişe girmek hassas hizalama ister | Ekip | Geçerli |
| 13 | 10.2026 | Ekipteki Keyence sensörler kullanılacak: CZ-V21A + CZ-H35S/H32 kir, LR-ZB250AN ön kenar, LV-S41 + LV-N12N yedek kenar | Elde mevcut, endüstriyel; kir tespiti boşluğunu kapatır | Ekip | Geçerli – kütle/güç etkisi cam testinden sonra hesaplara girecek |
| 14 | 10.2026 | Strateji: "kuru tırman, ıslak in" | Islak camda tırmanma çekişi yetersiz (oran 0,63) | Ekip | Geçerli – Faz-1 testiyle doğrulanacak |
| 15 | 18.10.2026 | Mobil uygulama ilk prototipe eklendi (R3'te "kapsam dışı" idi) | Bakım, su ve çalışma takibi; okul tanıtımı | Ekip | Geçerli |
| 16 | 18.10.2026 | Uygulama PWA (web uygulaması, "Ana Ekrana Ekle"); Apple Developer/App Store yok | Ücretsiz, iPhone + Android, kurulum kolay | YTS | Geçerli |
| 17 | 18.10.2026 | Veritabanı Firebase Realtime Database; istasyon ESP32 köprü | ESP32 desteği kolay, canlı veri, ücretsiz plan yeterli | Ekip | Geçerli |
| 18 | 18.10.2026 | Prototipte bağlantı telefon hotspot'u (2,4 GHz, sabit kanal); modem/4G yok | Okul ağı ESP32 için sorunlu; tanıtım için yeterli | Ekip | Geçerli – sahada 4G modem gerekebilir |
| 19 | 18.10.2026 | Su seviyesi damacana tartısıyla (yük hücresi + HX711); isteğe bağlı akış sensörü | Litre cinsinden doğrudan ölçüm | Ekip | Geçerli |
