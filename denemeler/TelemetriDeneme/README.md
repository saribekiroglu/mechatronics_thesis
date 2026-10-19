# TelemetriDeneme

GES temizleme robotunun telemetri ekranlarını gösteren çevrimdışı şablon. Kaynak veri sözleşmesi: [docs/telemetri.md](../../docs/telemetri.md).

## En kolay açılış — kurulum gerektirmez

1. GitHub'dan **Code → Download ZIP** ile depoyu indirin veya `git clone` kullanın.
2. ZIP'i tamamen çıkarın. `denemeler/TelemetriDeneme` klasörüne gidin.
3. **`TelemetriDeneme.html` dosyasına çift tıklayın.** Güncel Chrome, Edge, Firefox veya Safari'de açın.

HTML; JavaScript ve CSS'yi kendi içinde taşır. İnternet, hesap, npm, Python veya Base44 üyeliği gerekmez. GitHub dosya önizlemesi uygulamayı çalıştırmaz; önce indirin. Dosyayı e-posta veya USB ile tek başına başka bilgisayara da taşıyabilirsiniz.

## Alternatif — yerel sunucu

Tarayıcınız yerel dosyalarda kayıt/indirme işlemlerini kısıtlıyorsa Python 3.9 veya üzeri ile yerel sunucu kullanın:

- **Windows:** `Baslat.cmd` dosyasına çift tıklayın. Python 3 PATH üzerinde veya `py` başlatıcısıyla bulunmalıdır.
- **macOS / Linux:** Bu klasörde terminal açıp `sh Baslat.sh` çalıştırın.
- **Tüm sistemler:** `python sunucu.py` (macOS/Linux'ta genellikle `python3 sunucu.py`).

Tarayıcı otomatik açılır: **http://127.0.0.1:8745/TelemetriDeneme.html**. Kapatmak için terminalde **Ctrl+C** kullanın. Port doluysa `python sunucu.py --port 8746` ile farklı port seçin. Sunucu yalnız kendi bilgisayarınızdan erişilir; yerel ağa veya internete açılmaz.

## Kullanım ve veri

- **Genel Bakış:** Batarya, su, alan, enerji; sıra şeması ve bütün `canli` alanları. Simülasyonu başlatıp Normal / Su az / Batarya az / Bağlantı yok / Arıza senaryolarını seçebilirsiniz.
- **Geçmiş ve Görevler:** 7 günlük sentetik özet, 8 görev; gün filtresi; JSON/CSV indirme.
- **Uyarılar:** Bilgi, uyarı ve kritik seviye filtreleri.
- **Bakım:** Altı örnek parça sayacı, tahmini başlangıç eşikleri ve onaylı sıfırlama.
- **Ayarlar ve Veriler:** Tam JSON yedeği, dosya/metin içe aktarımı ve örnekleri yenileme.

Tüm veriler **örnektir**. Donanım, Firebase, ESP-NOW veya Base44 SDK bağlantısı yoktur. Başla / Dön / Dur gerçek robota komut göndermez. Kir değerleri kalibre edilmemiş ham değerlerdir; sıra görünümü GPS değildir. Bakım eşikleri ve simülasyon sayıları gerçek donanım doğrulaması sayılmaz.

Veriler o tarayıcı profilinin localStorage alanındadır. Farklı bilgisayarlar/profiller ortak veritabanı paylaşmaz. Tarayıcı verileri silinirse kayıtlar kaybolabilir. Yerel `file://` adreslerindeki kayıt davranışı tarayıcıya bağlıdır; dosyayı taşıma/yeniden adlandırma kayıt alanını değiştirebilir. Kalıcı kullanım için aynı localhost adresini ve portu kullanın. Ayarlar'dan JSON yedeği alın; diğer bilgisayarda içe aktarın.

İçe aktarım için altı kök dal gerekir: `canli`, `gunluk`, `gorevler`, `uyarilar`, `bakim`, `komut`. `ornek_telemetri.json` tam örnektir. Geçersiz JSON verileri değiştirmez. Geçmiş ekranının JSON çıktısı yalnız geçmiş alt kümesidir; tam yedek değildir.

## Dosyalar ve geliştirme

| Dosya | Amaç |
|---|---|
| `TelemetriDeneme.html` | Başka bilgisayara tek başına taşınabilen hazır uygulama |
| `web/` | HTML, CSS ve JavaScript kaynakları |
| `paketle.py` | Kaynaklardan tek dosyayı yeniden üretir: `python paketle.py` |
| `sunucu.py`, `Baslat.cmd`, `Baslat.sh` | İsteğe bağlı platformlar arası yerel sunucu |
| `ornek_telemetri.json` | Örnek tam veri yedeği |

Kaynaklar değişince `python paketle.py` çalıştırın ve HTML dosyasını tarayıcıda yeniden açın/yenileyin. Tek dosyada gömülü betik için SHA-256 CSP özeti paketleme sırasında üretilir. Harici CDN/font/analitik kullanılmaz; veri istekleri CSP ile kapalıdır. Uygulama sunucusuz çalışırken de ağ bağlantısı istemez.

Base44'te aynı kapsama yönelik ilk taslak hazırlanmıştır. Ücretli ZIP dışa aktarma kısıtı nedeniyle buradaki kod Base44 kaynak ihracı değildir; ayrıca yazılmış bağımsız yerel şablondur. Mevcut `uygulama/` veya firmware mimarisini değiştirmez.
