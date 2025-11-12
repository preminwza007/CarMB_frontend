# websocket_server_with_logging.py
import asyncio
from typing import List
from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()

class ConnectionManager:
    def __init__(self):
        self.pi_websocket: WebSocket | None = None
        self.browser_websockets: List[WebSocket] = []

    async def connect_pi(self, websocket: WebSocket):
        await websocket.accept()
        self.pi_websocket = websocket
        print("✅ Pi connected.")

    def disconnect_pi(self):
        self.pi_websocket = None
        print("🛑 Pi disconnected.")

    async def connect_browser(self, websocket: WebSocket):
        await websocket.accept()
        self.browser_websockets.append(websocket)
        print(f"✅ Browser connected. Total: {len(self.browser_websockets)}")

    def disconnect_browser(self, websocket: WebSocket):
        self.browser_websockets.remove(websocket)
        print(f"🛑 Browser disconnected. Total: {len(self.browser_websockets)}")

    async def send_to_pi(self, message: str):
        if self.pi_websocket:
            await self.pi_websocket.send_text(message)
        else:
            print("⚠️ Pi not connected, cannot forward message.")
    
    async def broadcast_to_browsers(self, message: str):
        if self.browser_websockets:
            tasks = [ws.send_text(message) for ws in self.browser_websockets]
            await asyncio.gather(*tasks)

manager = ConnectionManager()

# --- Endpoint สำหรับ Pi ---
@app.websocket("/ws/pi")
async def websocket_pi_endpoint(websocket: WebSocket):
    await manager.connect_pi(websocket)
    try:
        while True:
            data_from_pi = await websocket.receive_text()
            
            # --- จุดที่เพิ่ม: แจ้งเตือนข้อมูลที่ได้รับจาก Pi ---
            print(f"📩 Received from Pi: '{data_from_pi}' -> Forwarding to Browsers")
            
            await manager.broadcast_to_browsers(data_from_pi)

    except WebSocketDisconnect:
        manager.disconnect_pi()
    except Exception as e:
        print(f"Error in Pi websocket: {e}")
        manager.disconnect_pi()


# --- Endpoint สำหรับ Frontend ---
@app.websocket("/ws/browser")
async def websocket_browser_endpoint(websocket: WebSocket):
    await manager.connect_browser(websocket)
    try:
        while True:
            data_from_browser = await websocket.receive_text()

            # --- จุดที่เพิ่ม: แจ้งเตือนข้อมูลที่ได้รับจาก Browser ---
            print(f"🕹️ Received from Browser: '{data_from_browser}' -> Forwarding to Pi")
            
            await manager.send_to_pi(data_from_browser)

    except WebSocketDisconnect:
        manager.disconnect_browser(websocket)
    except Exception as e:
        print(f"Error in browser websocket: {e}")
        manager.disconnect_browser(websocket)