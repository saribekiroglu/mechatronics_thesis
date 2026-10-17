# GES Panel Temizleme Robotu – MKT403/MKT402 Bitirme Projesi

Güneş enerjisi santrali panellerini su ve rulo fırça ile temizleyen, ≈8,5 kg'lık otonom paletli robot.

**Ekip:** Muhammed Emir Tokaç (proje yöneticisi, elektrik) · Yusuf Serdar Yalçıner (mekanik) · Barış Berker Arslan (gömülü yazılım) · Yusuf Taha Sarıbekiroğlu (istasyon, su–pompa, esnek destek)

## Nereden başlamalı?

| Ne arıyorsun? | Nerede? |
|---|---|
| Kim ne üzerinde çalışıyor? | [`STATUS.md`](STATUS.md) ve GitHub Projects panosu |
| Tasarım kararları ve gerekçeleri | [`docs/karar_kaydi.md`](docs/karar_kaydi.md) |
| Görev listesi (R3) | [`docs/gorevler.md`](docs/gorevler.md) |
| Raporlar | [`docs/raporlar/`](docs/raporlar/) |
| Malzeme listesi ve hesaplar | [`bom/`](bom/), [`mekanik/hesaplar/`](mekanik/hesaplar/) |
| Literatür, makaleler, patentler | [`literatur/`](literatur/) |
| Yapay zeka ajanı kuralları | [`AGENTS.md`](AGENTS.md) |

## İlk kurulum (her üye bir kez)

1. [Git LFS](https://git-lfs.com) kur, sonra: `git lfs install`
2. Repoyu klonla: `git clone https://github.com/saribekiroglu/mechatronics_thesis.git`
3. Word/Excel/CAD dosyasını düzenlemeden önce: `git lfs lock <dosya>` – bitince `git lfs unlock <dosya>`

GitHub Desktop kullanıyorsan LFS'yi otomatik kurar; kilitleme için komut satırı gerekir.

> Bu repo **gizli (private)** kalmalıdır: tasarım patent açısından hassas, makale PDF'leri telifli.
