import asyncio
import websockets
import json
import logging
from typing import Set, Dict, Any

# --- Configuration ---
HOST = "0.0.0.0"
GPS_WS_PORT = 5000       # สำหรับ WebSocket GPS Data Relay (Pi -> Web UI)
PATH_WS_PORT = 5001      # สำหรับ WebSocket Path Command (Web UI -> Pi Client)
LOG_FORMAT = '%(asctime)s - %(levelname)s - %(message)s'

logging.basicConfig(level=logging.INFO, format=LOG_FORMAT)

# --- Global State ---
# กลุ่ม Clients สำหรับ GPS Data (Pi -> Web UI)
GPS_RECEIVERS: Set[websockets.WebSocketServerProtocol] = set() 
# กลุ่ม Clients สำหรับ Path Command (Web UI -> Pi)
PATH_COMMAND_LISTENERS: Set[websockets.WebSocketServerProtocol] = set()

# =======================================================
# 1. GPS WebSocket Server (Port 5000) - Data Relay
# =======================================================

async def gps_server_handler(websocket: websockets.WebSocketServerProtocol):
    """Handles connections, receives GPS data from ROS Client, and broadcasts it to Web UIs."""
    GPS_RECEIVERS.add(websocket)
    logging.info(f"[PORT 5000/GPS] New client connected: {websocket.remote_address}. Total: {len(GPS_RECEIVERS)}")
    
    try:
        # Client Pi (GPS Node) ส่งข้อมูลมาที่นี่
        async for message in websocket:
            logging.debug(f"[PORT 5000/GPS] Received GPS Data: {message[:50]}...")
            
            # Broadcast GPS Data ไปยัง Web UI ทั้งหมด
            websockets.broadcast(GPS_RECEIVERS, message)
            
    except websockets.exceptions.ConnectionClosed:
        logging.warning(f"[PORT 5000/GPS] Client disconnected: {websocket.remote_address}")
    finally:
        GPS_RECEIVERS.discard(websocket)
        logging.info(f"[PORT 5000/GPS] Client removed. Remaining: {len(GPS_RECEIVERS)}")

# =======================================================
# 2. Path WebSocket Server (Port 5001) - Command Receiver/Relay
# =======================================================

async def path_server_handler(websocket: websockets.WebSocketServerProtocol):
    """
    Handles connections on PORT 5001. 
    1. Receives path command from Web UI. 
    2. Broadcasts the path command to ALL connected listeners (including ROS Pi Client).
    """
    PATH_COMMAND_LISTENERS.add(websocket)
    logging.info(f"[PORT 5001/PATH] New Path Commander/Listener connected: {websocket.remote_address}. Total: {len(PATH_COMMAND_LISTENERS)}")

    try:
        # Loop 1: Web UI Client ส่ง Path JSON มาที่นี่
        async for message in websocket:
            logging.info(f"[PORT 5001/PATH] 🟢 RECEIVED PATH COMMAND: {message[:100]}...")
            
            # 🚀 FIX: Broadcast Path Command ไปยัง Clients ทั้งหมดที่เชื่อมต่ออยู่
            # ข้อมูลนี้จะถูกส่งไปถึง Pi Client (external_path_client_node) ที่ listen อยู่
            websockets.broadcast(PATH_COMMAND_LISTENERS, message)
            
            logging.info(f"✅ Relayed path command to {len(PATH_COMMAND_LISTENERS)} listeners.")
            
    except websockets.exceptions.ConnectionClosed:
        logging.warning(f"[PORT 5001/PATH] Client disconnected: {websocket.remote_address}")
    finally:
        PATH_COMMAND_LISTENERS.discard(websocket)
        logging.info(f"[PORT 5001/PATH] Client removed. Remaining: {len(PATH_COMMAND_LISTENERS)}")

# =======================================================
# 3. Main Orchestrator
# =======================================================

async def server_heartbeat():
    """Prints status to confirm the server is still running."""
    while True:
        await asyncio.sleep(30)
        logging.info( 
            f"[HEARTBEAT] 💖 Active. GPS clients: {len(GPS_RECEIVERS)}, Path Listeners: {len(PATH_COMMAND_LISTENERS)}"
        )

async def main():
    try:
        # Start both servers and heartbeat task
        await asyncio.gather(
            websockets.serve(gps_server_handler, HOST, GPS_WS_PORT),
            websockets.serve(path_server_handler, HOST, PATH_WS_PORT),
            asyncio.create_task(server_heartbeat())
        )
    except Exception as e:
        logging.error(f"FATAL ERROR during server startup: {e}")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logging.info("Server stopped by user (Ctrl+C).")