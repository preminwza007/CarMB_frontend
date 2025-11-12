# Sent_DATA1669.py
import asyncio
from typing import List
from fastapi import FastAPI, WebSocket, WebSocketDisconnect

# สร้าง FastAPI app
app = FastAPI()

class ConnectionManager:
    """
    คลาสสำหรับจัดการการเชื่อมต่อ WebSocket
    - จัดการการเชื่อมต่อจาก Pi (มีได้แค่ 1)
    - จัดการการเชื่อมต่อจาก Browser (มีได้หลายอัน)
    """
    def __init__(self):
        self.pi_websocket: WebSocket | None = None
        self.browser_websockets: List[WebSocket] = []

    async def connect_pi(self, websocket: WebSocket):   
        """ยอมรับการเชื่อมต่อจาก Raspberry Pi"""
        await websocket.accept()
        self.pi_websocket = websocket
        print("✅ Raspberry Pi has connected.")

    def disconnect_pi(self):
        """จัดการเมื่อ Raspberry Pi ตัดการเชื่อมต่อ"""
        self.pi_websocket = None
        print("🛑 Raspberry Pi has disconnected.")

    async def connect_browser(self, websocket: WebSocket):
        """ยอมรับการเชื่อมต่อจาก Browser"""
        await websocket.accept()
        self.browser_websockets.append(websocket)
        print(f"✅ A new browser has connected. Total browsers: {len(self.browser_websockets)}")

    def disconnect_browser(self, websocket: WebSocket):
        """จัดการเมื่อ Browser ตัดการเชื่อมต่อ"""
        self.browser_websockets.remove(websocket)
        print(f"🛑 A browser has disconnected. Total browsers: {len(self.browser_websockets)}")

    async def send_to_pi(self, message: str):
        """ส่งข้อความ (คำสั่ง) ไปยัง Raspberry Pi"""
        if self.pi_websocket:
            await self.pi_websocket.send_text(message)
            print(f"Sent to Pi: {message}")

    async def broadcast_to_browsers(self, message: str):
        """ส่งข้อความ (ข้อมูลสถานะ) ไปยัง Browser ทุกตัวที่เชื่อมต่ออยู่"""
        print(f"Broadcasting to browsers: {message}")
        # สร้าง task list สำหรับการส่งข้อมูลพร้อมกัน
        tasks = [ws.send_text(message) for ws in self.browser_websockets]
        await asyncio.gather(*tasks)

# สร้าง instance ของ ConnectionManager
manager = ConnectionManager()

@app.websocket("/ws/pi")
async def websocket_pi_endpoint(websocket: WebSocket):
    """
    Endpoint สำหรับการเชื่อมต่อจาก Raspberry Pi
    """
    await manager.connect_pi(websocket)
    try:
        while True:
            # รอรับข้อมูลจาก Pi
            data_from_pi = await websocket.receive_text()
            # ส่งข้อมูลที่ได้รับไปยัง Browser ทั้งหมด
            await manager.broadcast_to_browsers(data_from_pi)
    except WebSocketDisconnect:
        manager.disconnect_pi()
    except Exception as e:
        print(f"Error in Pi websocket: {e}")
        manager.disconnect_pi()

@app.websocket("/ws/browser")
async def websocket_browser_endpoint(websocket: WebSocket):
    """
    Endpoint สำหรับการเชื่อมต่อจากหน้าเว็บ (Frontend)
    """
    await manager.connect_browser(websocket)
    try:
        while True:
            # รอรับข้อมูล (คำสั่ง) จาก Browser
            # หมายเหตุ: โค้ด master_sender.py ปัจจุบันไม่ได้รอรับคำสั่ง
            # แต่โค้ดส่วนนี้มีไว้เพื่อรองรับการขยายในอนาคต
            data_from_browser = await websocket.receive_text()
            # ส่งคำสั่งนั้นไปยัง Pi
            await manager.send_to_pi(data_from_browser)
    except WebSocketDisconnect:
        manager.disconnect_browser(websocket)
    except Exception as e:
        print(f"Error in browser websocket: {e}")
        manager.disconnect_browser(websocket)