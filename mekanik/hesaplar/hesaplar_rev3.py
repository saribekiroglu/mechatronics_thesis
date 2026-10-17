"""Rev-3: pompa damacana/varil yanında, robotta NC vana; kamerasız. BOM v2 Hesaplar ile aynı yöntem."""
import math
g = 9.81; th = math.radians(20); s, c = math.sin(th), math.cos(th)
MASS = [
 ('Şasi (20×20 sigma profil, köşebent, bağlantılar)', 1.60, 'değişmedi'),
 ('3 × sonsuz vidalı motor', 1.20, 'değişmedi'),
 ('2 × palet modülü', 1.30, 'değişmedi'),
 ('Batarya 12,8 V 12 Ah LiFePO4', 1.50, 'değişmedi'),
 ('Fırça + yaylı taşıyıcı + kapak + kayış', 0.90, 'değişmedi'),
 ('Elektronik kutusu (ESP32-S3, sürücüler, DC/DC, şarj modülü)', 0.85, 'Pi 5 + soğutucu + 5 V/5 A DC/DC çıktı (−0,15)'),
 ('Sensörler, E-stop, IR alıcılar, braketler, kablolama', 0.45, 'kamera ve FPC kablo çıktı (−0,05)'),
 ('Robot üstü su sistemi (NC vana, nozul çubuğu, rakor, hortum ucu, sıçrama koruması)', 0.65, 'YENİ – vana 0,15 + nozul/rakor 0,20 + hortum ucu ve su 0,15 + koruma 0,10 + bağlantı 0,05 (tahmini)'),
]
m = round(sum(x[1] for x in MASS), 2)
W = m*g; Fs = W*s; N = W*c
Frr = 0.03*N; Fa = m*0.2; Fn = 20; mub = 0.4; Ff = Fn*mub
Fh = 9.3; Fh15 = 22.8
r = 30*5/(2*math.pi)/1000; eta_p = 0.85
def torque(F): return 2*F/2*r/eta_p/0.0980665
Ftop = Fs + Frr + Fa + Ff + Fh
Ftop15 = Fs + Frr + Fa + Ff + Fh15
T = torque(Ftop); T15 = torque(Ftop15); Tlow = torque(Ftop - Ff + 10*mub)
trac_dry = 0.8*N/Ftop; trac_wet = 0.4*N/Ftop; mu_req = Ftop/N
mu_desc = (Fs - Ff)/N; desc_ratio = 0.4/mu_desc
hold = Fs/2*r/0.0980665
# güç (BOM v2 Hesaplar ile aynı)
v = 0.15; eta_m = 0.35
P_drive = Ftop*v/(eta_p*eta_m)
P_brush = Fn*mub*0.045*(120*2*math.pi/60)/(0.95*eta_m)
P_elec = (3 + 1 + 0.5 + 1)/0.9           # vana ort. 3 W + ESP32 + sensör + servo
P_avg = P_drive + P_brush + P_elec
C_req = 2*P_avg/(0.8*12.8); t_run = 153.6*0.8/P_avg
I_peak = 3*5 + P_elec/12.8
rate = 0.47*0.9*v*3600*0.85
Qlo, Qhi = rate*0.3/60, rate*0.6/60                  # L/dk
dam = 19; t_dam_lo, t_dam_hi = dam/Qhi, dam/Qlo      # dakika
A_dam_lo, A_dam_hi = dam/0.6, dam/0.3
area_charge = rate*t_run
# basınç tarafı hidrolik
def hf(Qlpm, D, L):
    Q = Qlpm/60000; A = math.pi*D**2/4; vv = Q/A; Re = vv*D/1e-6
    f = 0.316*Re**-0.25 if Re > 2300 else 64/Re
    return f*(L/D)*vv**2/(2*g)*9810/1e5          # bar
H_static = 1.6*9810/1e5
dp_hose = hf(2.0, 0.0125, 20)
p_nozzle = 1.5
p_need = H_static + dp_hose + p_nozzle
p_pump = 40*0.0689476
# rüzgâr
def wind(mu):
    F = (mu*N - Fs)/(1+mu)
    return (F, math.sqrt(2*F/(1.225*0.35))) if F > 0 else (0, 0)
wl = {mu: wind(mu) for mu in (0.8, 0.6, 0.4)}
h_cg = 0.070
tip_long = math.degrees(math.atan(0.26/h_cg)); tip_lat = math.degrees(math.atan(0.2375/h_cg))
p_contact = N/0.026; p_avg = N/(2.279*1.134)
F_teth = 2*W
if __name__ == '__main__':
    for k, val in sorted(globals().items()):
        if isinstance(val, float): print(k, round(val, 3))
    print(wl)
