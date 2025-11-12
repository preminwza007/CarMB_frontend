# cloud_relay_server.py
import socket
import threading
import time

# กำหนด Port สำหรับแต่ละ Client
JOYSTICK_CLIENT_PORT = 1150
PI_CLIENT_PORT = 1112

# ตัวแปรสำหรับเก็บการเชื่อมต่อของแต่ละ Client
joystick_conn = None
pi_conn = None
joystick_addr = None
pi_addr = None

def handle_joystick_client():
    """Thread สำหรับรอรับการเชื่อมต่อและข้อมูลจาก Joystick Client"""
    global joystick_conn, joystick_addr, pi_conn
    
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        s.bind(('0.0.0.0', JOYSTICK_CLIENT_PORT))
        s.listen()
        print(f"🎧 รอ Joystick Client ที่ Port {JOYSTICK_CLIENT_PORT}...")
        
        while True:
            joystick_conn, joystick_addr = s.accept()
            print(f"🤝 Joystick Client เชื่อมต่อแล้วจาก: {joystick_addr}")
            try:
                while True:
                    data = joystick_conn.recv(1024)
                    if not data:
                        break # Client หลุด
                    
                    # ถ้า Pi เชื่อมต่ออยู่ ให้ส่งข้อมูลต่อไปให้ Pi
                    if pi_conn:
                        try:
                            pi_conn.sendall(data)
                            # print(f"ส่งต่อข้อมูล '{data.decode()}' ไปยัง Pi") # Uncomment for debug
                        except socket.error:
                            print("❗️ ไม่สามารถส่งข้อมูลไปยัง Pi ได้ (อาจจะหลุดไปแล้ว)")
                            pi_conn = None # รีเซ็ตการเชื่อมต่อของ Pi
                
            except ConnectionResetError:
                print(f"❗️ Joystick Client {joystick_addr} หลุดการเชื่อมต่อ")
            finally:
                joystick_conn.close()
                joystick_conn = None
                print(f"🔌 ปิดการเชื่อมต่อจาก Joystick Client {joystick_addr}")


def handle_pi_client():
    """Thread สำหรับรอรับการเชื่อมต่อจาก Raspberry Pi Client"""
    global pi_conn, pi_addr
    
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        s.bind(('0.0.0.0', PI_CLIENT_PORT))
        s.listen()
        print(f"🤖 รอ Raspberry Pi Client ที่ Port {PI_CLIENT_PORT}...")
        
        while True:
            pi_conn, pi_addr = s.accept()
            print(f"✅ Raspberry Pi เชื่อมต่อแล้วจาก: {pi_addr}")
            # Loop นี้มีไว้เพื่อเช็คว่า Pi ยังเชื่อมต่ออยู่หรือไม่
            try:
                while True:
                    # รอเฉยๆ ถ้า Pi ส่งอะไรมาแสดงว่าผิดปกติ แต่ส่วนใหญ่จะเงียบ
                    data = pi_conn.recv(1) 
                    if not data:
                        print(f"❗️ Raspberry Pi {pi_addr} หลุดการเชื่อมต่อ")
                        pi_conn = None
                        break
            except (ConnectionResetError, socket.error):
                 print(f"❗️ Raspberry Pi {pi_addr} หลุดการเชื่อมต่อ")
            finally:
                pi_conn.close()
                pi_conn = None
                print(f"🔌 ปิดการเชื่อมต่อจาก Raspberry Pi {pi_addr}")


# เริ่มต้นทั้งสอง Thread
print("🚀 Cloud Relay Server เริ่มทำงาน...")
threading.Thread(target=handle_joystick_client, daemon=True).start()
threading.Thread(target=handle_pi_client, daemon=True).start()

# Loop หลักเพื่อให้โปรแกรมทำงานไปเรื่อยๆ
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("\n🛑 หยุดการทำงานของเซิร์ฟเวอร์")