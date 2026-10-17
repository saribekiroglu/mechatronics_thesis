// GES Robotu – PWA. Veri yapısı: docs/telemetri.md
import { firebaseConfig } from './firebase-config.js';

const SDK = 'https://www.gstatic.com/firebasejs/10.12.2/';
const DAMACANA_L = 19;
const DURUM = {
  BEKLEMEDE: ['Beklemede', 'Göreve hazır'],
  TEMIZLIYOR: ['Temizliyor', 'Su açık, fırça dönüyor'],
  TIRMANIYOR: ['Tırmanıyor', 'Kuru şeritte yukarı çıkıyor'],
  DONUYOR: ['İstasyona dönüyor', 'Görev bitti veya enerji eşiği'],
  SARJ: ['Şarj oluyor', 'İstasyonda, kontaklar aktif'],
  HATA: ['Hata', 'Uyarılar sekmesine bakın'],
  ACIL_STOP: ['Acil durdurma', 'E-stop basılı'],
};
const $ = id => document.getElementById(id);

// ---------- sayfa geçişi ----------
document.querySelectorAll('nav.alt button').forEach(b => b.onclick = () => {
  document.querySelectorAll('nav.alt button').forEach(x => x.classList.toggle('aktif', x === b));
  document.querySelectorAll('.sayfa').forEach(s => s.classList.toggle('aktif', s.id === b.dataset.s));
});
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});

// ---------- yardımcılar ----------
const sure = s => { s = Math.round(s || 0); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60); return h ? `${h} sa ${m} dk` : `${m} dk`; };
const saat = ts => new Date(ts).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
const gunKey = d => d.toLocaleDateString('sv-SE'); // yerel tarih, YYYY-AA-GG
const bugunKey = () => gunKey(new Date());
function barRenk(el, yuzde) { el.style.width = Math.max(0, Math.min(100, yuzde)) + '%'; el.className = yuzde < 20 ? 'dusuk' : yuzde < 40 ? 'orta-seviye' : ''; }

// ---------- çiziciler ----------
function cizCanli(c) {
  if (!c) return;
  const [ad, alt] = DURUM[c.durum] || [c.durum, ''];
  $('durum').textContent = ad;
  $('durumAlt').textContent = `${alt}${c.sira != null ? ` · Sıra ${c.sira}, ${c.konum_m?.toFixed(1)} m` : ''}`;
  $('bat').textContent = Math.round(c.batarya_yuzde);
  barRenk($('batBar'), c.batarya_yuzde);
  $('batAlt').textContent = `${c.batarya_v?.toFixed(1)} V · ${c.akim_a?.toFixed(1)} A · ${c.sicaklik_bat?.toFixed(0)} °C`;
  $('su').textContent = c.su_litre?.toFixed(1);
  barRenk($('suBar'), c.su_litre / DAMACANA_L * 100);
  $('suAlt').textContent = c.su_dk_kaldi != null ? `≈${Math.round(c.su_dk_kaldi)} dk yeter` : '—';
  $('kirOn').textContent = c.kir_on ?? '—';
  $('kirArka').textContent = c.kir_arka ?? '—';
  const yas = (Date.now() - c.ts) / 1000;
  baglanti(yas < 10 ? 'ok' : 'kotu', yas < 10 ? 'Canlı' : `Son veri ${sure(yas)} önce`);
}
function cizGunluk(g) {
  const b = g?.[bugunKey()] || {};
  $('bugunSure').textContent = sure(b.sure_s);
  $('bugunAlan').textContent = `${Math.round(b.alan_m2 || 0)} m²`;
  $('bugunSu').textContent = `${(b.su_l || 0).toFixed(1)} L`;
  const gunler = [...Array(7)].map((_, i) => gunKey(new Date(Date.now() - (6 - i) * 864e5)));
  const maks = Math.max(1, ...gunler.map(k => g?.[k]?.alan_m2 || 0));
  $('grafik').innerHTML = gunler.map(k => { const v = g?.[k]?.alan_m2 || 0;
    return `<div><b style="height:${v / maks * 110}px"></b>${k.slice(8)}.${k.slice(5, 7)}<br>${Math.round(v)}</div>`; }).join('');
}
function cizGorevler(gs) {
  const l = Object.values(gs || {}).sort((a, b) => b.bas - a.bas).slice(0, 10);
  $('gorevListe').innerHTML = l.map(g => `<div class="kart"><div class="satir"><b>${saat(g.bas)}</b><span class="muted">${sure(g.sure_s)}</span></div>
    <div class="muted">${Math.round(g.alan_m2)} m² · ${g.su_l.toFixed(1)} L su · ${Math.round(g.enerji_wh)} Wh · bitiş: ${g.bitis_nedeni}</div></div>`).join('')
    || '<p class="muted">Henüz görev yok.</p>';
}
function cizBakim(bk) {
  $('bakimListe').innerHTML = Object.entries(bk || {}).map(([k, p]) => {
    const y = Math.min(100, p.sayac / p.esik * 100), kalan = Math.max(0, p.esik - p.sayac);
    return `<div class="kart"><div class="satir"><b>${p.ad}</b><button class="btn" data-parca="${k}">Değiştirildi</button></div>
      <div class="bar"><i style="width:${y}%" class="${y > 90 ? 'dusuk' : y > 70 ? 'orta-seviye' : ''}"></i></div>
      <div class="muted">${p.sayac.toFixed(1)} / ${p.esik} ${p.birim} · ≈${kalan.toFixed(0)} ${p.birim} kaldı${p.not ? ' · ' + p.not : ''}</div></div>`;
  }).join('');
  document.querySelectorAll('[data-parca]').forEach(b => b.onclick = () => {
    if (confirm(`${bk[b.dataset.parca].ad} değiştirildi mi? Sayaç sıfırlanacak.`)) veri.sifirla(b.dataset.parca);
  });
}
function cizUyarilar(u) {
  const l = Object.values(u || {}).sort((a, b) => b.ts - a.ts).slice(0, 30);
  const yeni = l.filter(x => Date.now() - x.ts < 864e5 && x.seviye !== 'bilgi');
  $('uyariSayi').hidden = !yeni.length; $('uyariSayi').textContent = yeni.length;
  $('uyariListe').innerHTML = l.map(x => `<div class="kart"><div class="satir"><span class="seviye ${x.seviye}">${x.seviye.toUpperCase()}</span><span class="muted">${saat(x.ts)}</span></div><div>${x.mesaj}</div></div>`).join('')
    || '<p class="muted">Uyarı yok.</p>';
  const son = yeni[0];
  $('sonUyari').hidden = !son; if (son) $('sonUyari').innerHTML = `<div class="etiket">Son uyarı · ${saat(son.ts)}</div>${son.mesaj}`;
}
function baglanti(d, t) { $('baglanti').className = 'dot ' + d; $('baglantiYazi').textContent = t; }

// ---------- veri katmanı ----------
let veri;
if (!firebaseConfig.databaseURL) {
  veri = demoVeri();
  $('modEtiket').hidden = false;
} else {
  veri = await firebaseVeri();
}

async function firebaseVeri() {
  const { initializeApp } = await import(SDK + 'firebase-app.js');
  const { getAuth, onAuthStateChanged, signInWithEmailAndPassword } = await import(SDK + 'firebase-auth.js');
  const { getDatabase, ref, onValue, query, limitToLast, update } = await import(SDK + 'firebase-database.js');
  const app = initializeApp(firebaseConfig), auth = getAuth(app), db = getDatabase(app);
  onAuthStateChanged(auth, u => {
    if (!u) { $('giris').showModal(); return; }
    $('giris').close();
    onValue(ref(db, 'canli'), s => cizCanli(s.val()));
    onValue(query(ref(db, 'gunluk'), limitToLast(7)), s => cizGunluk(s.val()));
    onValue(query(ref(db, 'gorevler'), limitToLast(10)), s => cizGorevler(s.val()));
    onValue(ref(db, 'bakim'), s => cizBakim(s.val()));
    onValue(query(ref(db, 'uyarilar'), limitToLast(30)), s => cizUyarilar(s.val()));
    onValue(ref(db, '.info/connected'), s => { if (!s.val()) baglanti('kotu', 'Bağlantı yok'); });
  });
  $('girisForm').onsubmit = async e => {
    e.preventDefault();
    try { await signInWithEmailAndPassword(auth, $('eposta').value, $('sifre').value); }
    catch (err) { $('girisHata').textContent = 'Giriş başarısız: ' + err.code; }
  };
  return { sifirla: p => update(ref(db, 'bakim/' + p), { sayac: 0, son_degisim: Date.now() }) };
}

function demoVeri() {
  const s = {
    canli: { durum: 'TEMIZLIYOR', batarya_yuzde: 78, batarya_v: 13.1, akim_a: 3.4, su_litre: 14.2, su_dk_kaldi: 9, sira: 1, konum_m: 6.4, kir_on: 412, kir_arka: 688, sicaklik_bat: 31, ts: Date.now() },
    gunluk: {}, gorevler: {},
    bakim: {
      firca: { ad: 'Rulo fırça', sayac: 61.5, esik: 100, birim: 'saat', not: 'akım trendi: −%6' },
      palet: { ad: 'Palet kayışları', sayac: 12.4, esik: 50, birim: 'km' },
      surus_motor: { ad: 'Sürüş motorları', sayac: 74, esik: 500, birim: 'saat' },
      pompa: { ad: 'Pompa', sayac: 38, esik: 300, birim: 'saat' },
      nozul: { ad: 'Nozul ve süzgeç temizliği', sayac: 18, esik: 20, birim: 'saat' },
      batarya: { ad: 'Batarya', sayac: 46, esik: 2000, birim: 'döngü' },
    },
    uyarilar: {
      a: { ts: Date.now() - 35 * 60e3, seviye: 'uyari', mesaj: 'Damacanada su %25’in altına indi.' },
      b: { ts: Date.now() - 3 * 3600e3, seviye: 'bilgi', mesaj: 'Görev tamamlandı, istasyona dönüldü.' },
      c: { ts: Date.now() - 26 * 3600e3, seviye: 'kritik', mesaj: 'Sağ ön kenar sensörü: kenar algılandı, robot durdu.' },
    },
  };
  for (let i = 0; i < 7; i++) {
    const d = gunKey(new Date(Date.now() - i * 864e5));
    s.gunluk[d] = { sure_s: 3600 + Math.random() * 4000, alan_m2: 120 + Math.random() * 160, su_l: 30 + Math.random() * 40 };
    s.gorevler['g' + i] = { bas: Date.now() - i * 864e5 - 4 * 3600e3, sure_s: s.gunluk[d].sure_s, alan_m2: s.gunluk[d].alan_m2, su_l: s.gunluk[d].su_l, enerji_wh: 80 + Math.random() * 60, bitis_nedeni: i % 3 ? 'görev bitti' : 'su bitti' };
  }
  const ciz = () => { cizCanli(s.canli); cizGunluk(s.gunluk); cizGorevler(s.gorevler); cizBakim(s.bakim); cizUyarilar(s.uyarilar); };
  setInterval(() => { // sahte canlı veri
    const c = s.canli; c.ts = Date.now();
    c.konum_m = (c.konum_m + 0.15) % 24; c.su_litre = Math.max(0, c.su_litre - 0.025); c.su_dk_kaldi = c.su_litre / 1.5;
    c.batarya_yuzde = Math.max(5, c.batarya_yuzde - 0.01); c.akim_a = 3 + Math.random(); c.kir_arka = 660 + Math.round(Math.random() * 40);
    const g = s.gunluk[bugunKey()]; g.sure_s += 1; g.alan_m2 += 0.054; g.su_l += 0.025;
    cizCanli(c); cizGunluk(s.gunluk);
  }, 1000);
  ciz();
  return { sifirla: p => { s.bakim[p].sayac = 0; cizBakim(s.bakim); } };
}
