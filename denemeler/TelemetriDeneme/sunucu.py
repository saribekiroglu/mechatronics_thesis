"""Yalnız 127.0.0.1 üzerinde çalışan, paket bağımlılığı olmayan demo sunucusu."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Timer
import webbrowser

ROOT = Path(__file__).resolve().parent

class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=8745)
    parser.add_argument('--no-browser', action='store_true')
    args = parser.parse_args()
    if not 1 <= args.port <= 65535:
        parser.error('Port 1 ile 65535 arasında olmalı.')
    try:
        server = ThreadingHTTPServer(('127.0.0.1', args.port), partial(Handler, directory=str(ROOT)))
    except OSError:
        parser.exit(1, 'Sunucu açılamadı. Port kullanımda olabilir; --port 8746 ile farklı port seçin.\n')
    url = f'http://127.0.0.1:{args.port}/TelemetriDeneme.html'
    print('TelemetriDeneme: ' + url, flush=True)
    print('Kapatmak için bu pencerede Ctrl+C kullanın.', flush=True)
    if not args.no_browser:
        timer = Timer(0.4, webbrowser.open, args=(url,))
        timer.daemon = True
        timer.start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()

if __name__ == '__main__':
    main()
