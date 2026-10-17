# AGENTS.md – Yapay zeka ajanları için proje kuralları

Bu dosya, ekip üyelerinin yapay zeka ajanlarının (Claude Code, Codex, Gemini CLI, Copilot, Cursor vb.) bu repoda nasıl çalışacağını tanımlar. Bu araçlar dosyayı repo açıldığında kendiliğinden okur.

## Temel ilke: plan değişebilir, karar ekip üyesinindir

Bu repodaki plan, görev dağılımı, tasarım tablosu ve hesaplar **bir başlangıç noktasıdır, kesin talimat değildir.** Ekip üyeleri projeyi geliştirirken robotun herhangi bir parçasına, plana veya programa farklı bir yaklaşım getirebilir.

- Ajan, kullanıcıya **ne yapması gerektiğini söylemez**, görev atamaz, sıradaki işi dayatmaz. Kullanıcı ne istiyorsa ona yardım eder.
- Kullanıcı mevcut bir kararı, planı veya başka birinin alanındaki bir tasarımı değiştirmek isterse ajan bunu **engellemez**; değişikliği yapar. Yalnızca etkilediği yerleri (hesaplar, BOM, diğer alt sistemler) bilgi olarak belirtir ve karar kaydına not düşer.
- Ajan kendi görüşünü sorulursa söyler; sorulmazsa önerilerini kısa tutar.

## Oturum başlangıcı

1. Kullanıcıyı tanı: `git config user.name` / GitHub kullanıcı adından (tablo aşağıda). Bulamazsan gerekirse sor.
2. Bağlamı sessizce oku: bu dosya, `STATUS.md`, `docs/karar_kaydi.md`, ilgili klasörün `README.md`'si; `git pull` ile son hâli al.
3. Kullanıcının isteğine doğrudan geç. Özet veya yapılacaklar listesi yalnızca kullanıcı isterse verilir.
4. Değişiklik yaptıysan: kendi dalında commit at, PR aç; tasarım kararı değiştiyse karar kaydına bir satır ekle; kullanıcı isterse `STATUS.md`'yi güncelle.

| GitHub kullanıcı adı | Kısaltma |
|---|---|
| EmirTokac | MET |
| yusufserdary | YSY |
| BerkerBArslan | BBA |
| saribekiroglu | YTS |

## Proje özeti

MKT403/MKT402 bitirme projesi: **GES (güneş enerjisi santrali) panellerini su ve rulo fırça ile temizleyen, otonom, hafif paletli robot.**

Güncel tasarım (Rev. 3) – başlangıç noktasıdır, ekip üyeleri değiştirebilir; geçmişi `docs/karar_kaydi.md`'de:

| Konu | Karar |
|---|---|
| Boyut / kütle | 700 × 500 × 190 mm, ≈8,45 kg (hedef ≤ 10 kg) |
| Panel eğimi | 20° |
| Yürüyüş | 2 × HTD 5M 25 mm palet, kasnak ekseni 520 mm; 12 V 60 rpm 16 kgf·cm sonsuz vidalı motor (NFP-5840) |
| Temizlik | Ø90 × 470 mm rulo fırça, ≈120 rpm, aynı motor; su + fırça ("kuru tırman, ıslak in") |
| Su | Pompa robotta **değil**, depo (prototipte 19 L damacana) yanında; basınç şalterli 12 V diyafram pompa. Robotta yalnız NC selenoid vana + 4 yassı fan nozul. 0,3–0,6 L/m² |
| Enerji | 12,8 V 12 Ah LiFePO4; ≈2,75 saat çalışma (hesap) |
| Beyin | Tek ESP32-S3; Arduino Nano harici watchdog; donanım E-stop rölesi |
| Sensörler | 4 × VL53L0X (TCA9548A), BNO055 (manyetometresiz), enkoderler, INA226, DS18B20, limit switch; ekipte mevcut Keyence LR-ZB250AN (ön kenar), LV-S41 + LV-N12N (yedek kenar), CZ-V21A + CZ-H35S/H32 (kir tespiti) |
| Kamera | **Yok.** Kir tespiti sensörle |
| Haberleşme | Robot ↔ depo/istasyon ESP-NOW, 1 Hz yaşam sinyali, 3 s kayıpta pompa kapanır. Güvenlik işlevleri kablolu |
| Şarj | Sıra sonunda kontaklı istasyon: IR 38 kHz kodlu işaret + V kılavuz + yaylı kontaklar; kontaklar robot doğrulanmadan enerjisiz; 14,6 V CC/CV. **Type-C yok** |
| Konum | Yapılandırılmış harita (sıra boyu/modül sayısı), enkoder + IMU, kenarda ve istasyonda sıfırlama |

## Ekip ve sorumluluk alanları

Sorumluluk alanı "kim bu konuyu en iyi biliyor / kime haber verilmeli" demektir; **kimse başkasının alanında değişiklik yapmaktan men edilmez.**

| Kısaltma | Kişi | Alan | Sahip olduğu klasörler |
|---|---|---|---|
| MET | Muhammed Emir Tokaç | **Proje yöneticisi**, elektrik | `docs/`, `elektrik/` |
| YSY | Yusuf Serdar Yalçıner | Mekanik | `mekanik/` |
| BBA | Barış Berker Arslan | Gömülü yazılım | `firmware/` |
| YTS | Yusuf Taha Sarıbekiroğlu | İstasyon, su–pompa; esnek (flex) destek | `istasyon/`, `bom/`, `literatur/` |

`testler/` ortak alandır.

## Çalışma kuralları (ajanlar dahil herkes için)

1. **Dal kullan:** İş kendi dalında yapılır (`kisaltma/kisa-aciklama`, örn. `yts/istasyon-v-kilavuz`) ve PR ile birleştirilir. Bu bir onay zorunluluğu değil, herkesin değişikliği görebilmesi içindir; `CODEOWNERS` yalnızca ilgili kişiye bildirim gönderir.
2. **Başkasının alanında** değişiklik serbesttir; PR'da o kişiyi etiketlemek yeterlidir.
3. **İkili dosyalar birleştirilemez** (`.docx`, `.xlsx`, `.SLDPRT`, `.SLDASM`, `.SLDDRW`, `.pdf`). Düzenlemeden önce kilitle: `git lfs lock <dosya>`, bitince `git lfs unlock <dosya>`. Kilitli dosyayı düzenleme.
4. **Tasarım kararı değişiyorsa** `docs/karar_kaydi.md`'ye bir satır ekle (tarih, karar, gerekçe, kim). Bu bir izin süreci değil, ekibin neyin neden değiştiğini görmesi içindir. Eski kararı silme, "geçersiz" diye işaretle.
5. **`STATUS.md`** isteğe bağlı bir pano; kullanıcı isterse güncellenir.
6. **Sayı uydurma.** Hesaplar `mekanik/hesaplar/hesaplar_rev3.py` ve `bom/GES_Robotu_BOM_v2.xlsx` (Hesaplar sayfası) ile tutarlı olmalı. Literatürden bir bilgi kullanıyorsan `literatur/GES_Robotu_Literatur_Taramasi.xlsx`'teki kayda dayan; kaynağı olmayan rakam yazma.
7. **Şifre, API anahtarı, Wi-Fi bilgisi commit etme.** Bunlar `secrets.h` / `.env` içinde tutulur (git'e girmez); örnek için `firmware/secrets.example.h`.
8. **Büyük dosyalar:** 50 MB üstü (videolar, ham test kayıtları) repoya girmez; Drive'a koy, linkini ilgili klasöre `LINKLER.md` olarak ekle.
9. **Dil:** Raporlar ve dokümantasyon Türkçe; kod içi değişken adları İngilizce, yorumlar Türkçe veya İngilizce olabilir.
10. **Commit mesajı:** `[alan] kısa açıklama` (örn. `[firmware] ESP-NOW yaşam sinyali eklendi`).

## Klasör düzeni

```
docs/        raporlar (R1–R4, final), karar kaydı, görev listesi, Gantt
mekanik/     CAD (SolidWorks), teknik resim, hesaplar
elektrik/    şemalar, güç bütçesi, kablaj
firmware/    robot/, istasyon/, depo/ – ESP32 kodları
istasyon/    şarj istasyonu ve su–pompa sistemi tasarımı
bom/         malzeme listesi, sipariş takibi
literatur/   literatür matrisi, makale PDF'leri (makaleler/), TÜRKPATENT, rakip analizi
testler/     deney planları ve sonuçları (her deney ayrı klasör: YYYY-AA-GG_konu/)
scripts/     yardımcı scriptler (örn. Issue oluşturma)
```

## Teslim takvimi (H1 = 21.09.2026)

R1 Literatür – H4 (18.10) · R2 Problem tanımı – H5 (25.10) · R3 Proje planı – H6 (01.11) · R4 Kavramsal tasarım – H12 (13.12) · MKT403 final – H14 (27.12) · MKT402: imalat ve test (bahar).

## Açık riskler (bilgi amaçlı)

- Tork payı ≈1,1 ve kuru çekiş oranı sınırda; ıslak camda tırmanılamıyor → Faz-1 rampa testi bekleniyor (palet 40–60 mm, 12/24 V kararı).
- Hortum çekme yükü yönetilmezse motor yetersiz kalıyor.
- BNO055 üreticide "yeni tasarımlarda önerilmez" durumunda.
- ZEMZEM pompa değerleri doğrulanmadı; BOM'da "TAHMİNİ" fiyatlar var.
- Keyence sensörlerin kütle/güç etkisi (≈0,6–0,7 kg, ≈5–6 W) henüz hesaplara girmedi.
