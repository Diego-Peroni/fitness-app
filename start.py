"""
FitTrack - Servidor Local
Inicie com: python start.py
Acesse: http://localhost:8000
No iPhone: use o IP da sua rede (ex: http://192.168.x.x:8000)
"""
import http.server
import socketserver
import os
import socket

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Headers para PWA funcionar
        self.send_header('Cache-Control', 'no-cache')
        self.send_header('Service-Worker-Allowed', '/')
        super().end_headers()

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

if __name__ == "__main__":
    local_ip = get_local_ip()

    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"{'='*50}")
        print(f"  FitTrack - Servidor Local")
        print(f"{'='*50}")
        print(f"")
        print(f"  PC:     http://localhost:{PORT}")
        print(f"  iPhone: http://{local_ip}:{PORT}")
        print(f"")
        print(f"  Para instalar no iPhone:")
        print(f"  1. Abra o link acima no Safari")
        print(f"  2. Toque em 'Compartilhar' (icone)")
        print(f"  3. Selecione 'Adicionar a Tela Inicial'")
        print(f"")
        print(f"  Pressione Ctrl+C para parar")
        print(f"{'='*50}")

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor encerrado.")
