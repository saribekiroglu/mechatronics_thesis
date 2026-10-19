"""Web kaynaklarından paket bağımlılığı olmadan tek HTML üretir."""
import base64
import hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent

def build():
    html = (ROOT / 'web/index.html').read_text(encoding='utf-8-sig')
    css = (ROOT / 'web/style.css').read_text(encoding='utf-8-sig')
    js = (ROOT / 'web/app.js').read_text(encoding='utf-8-sig')
    if '</script' in js.lower() or '</style' in css.lower():
        raise ValueError('Kaynakta HTML kapanış etiketi var; güvenli paketlenemedi.')
    digest = base64.b64encode(hashlib.sha256(js.encode('utf-8')).digest()).decode('ascii')
    html = html.replace("script-src 'self'", "script-src 'sha256-" + digest + "'")
    html = html.replace('<link rel="stylesheet" href="style.css">', '<style>' + css + '</style>')
    html = html.replace('<script src="app.js" defer></script>', '')
    html = html.replace('</body>', '<script>' + js + '</script></body>')
    target = ROOT / 'TelemetriDeneme.html'
    with target.open('w', encoding='utf-8', newline='\n') as output:
        output.write(html)
    print('Tek dosya üretildi: ' + target.name)
    return target

if __name__ == '__main__':
    build()
