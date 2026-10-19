#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"
if command -v python3 >/dev/null 2>&1; then
    exec python3 sunucu.py
fi
printf '%s\n' 'Python 3 bulunamadi. TelemetriDeneme.html dosyasini dogrudan acabilirsiniz.'
exit 1
