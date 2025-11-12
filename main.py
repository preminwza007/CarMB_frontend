# --- 1. IMPORT LIBRARIES ---
import asyncio
import base64
from typing import Set, Union

import cv2
import numpy as np
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from ultralytics import YOLO

# --- 2. INITIALIZE FastAPI APP ---
app = FastAPI()

# --- 3. LOAD YOLO MODEL ---
print("🧠 Loading YOLOv10n (Nano) model for maximum speed...")
try:
    model = YOLO('yolov10n')
    print("✅ YOLOv10n model loaded successfully.")
except Exception as e:
    print(f"❌ Failed to load YOLO model. Error: {e}")
    model = None

# --- 4. YOLO CONFIGURATION ---
TARGET_CLASSES = {
    0: 'person', 2: 'car', 16: 'dog', 9: 'traffic light', 11: 'stop sign',
}
TARGET_IDS = list(TARGET_CLASSES.keys())
CONFIDENCE_THRESHOLD = 0.2

# --- 5. GLOBAL VARIABLES FOR WEBSOCKET MANAGEMENT ---
pi_websocket: Union[WebSocket, None] = None
react_clients: Set[WebSocket] = set()
latest_image: Union[str, None] = None

# --- 6. WEBSOCKET ENDPOINTS ---

@app.websocket("/pi_stream")
async def pi_stream_endpoint(websocket: WebSocket):
    """
    Endpoint for Raspberry Pi to send raw image streams for processing.
    Now with frame skipping to reduce server load.
    """
    global pi_websocket, latest_image

    await websocket.accept()
    if pi_websocket is not None:
        print("⚠️ A Pi is already connected. Disconnecting the new one.")
        await websocket.close(code=1008, reason="Another Pi is already connected.")
        return

    pi_websocket = websocket
    print(f"✅ Raspberry Pi connected: {websocket.client}")
    
    # ⭐️ 1. สร้างตัวแปรสำหรับนับเฟรม เริ่มจาก 0
    frame_counter = 0
    trigger = 0 
    label = ""
    conf = 0.0
    x1, y1, w, h = 0, 0, 0, 0

    try:
        trigger = 0
        while True:
            base64_string = await websocket.receive_text()

            # ⭐️ 2. เพิ่มค่าตัวนับทุกครั้งที่ได้รับเฟรมใหม่
            frame_counter += 1

            try:
                img_bytes = base64.b64decode(base64_string)
                nparr = np.frombuffer(img_bytes, np.uint8)
                frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                if frame is None: continue
            except Exception:
                continue
            
            
            # ⭐️ 3. สร้างเงื่อนไข: ประมวลผลด้วย YOLO เฉพาะเมื่อตัวนับ
            if frame_counter % 7 == 0:
                # --- นี่คือเฟรมที่จะถูกประมวลผล ---
                
                if model:
                    trigger=1
                    results = model(frame, conf=CONFIDENCE_THRESHOLD, classes=TARGET_IDS, verbose=False)[0]
                    
                    # รีเซ็ตค่าก่อนวนลูป (ป้องกันกล่องเก่าค้าง)
                    label = ""
                    conf = 0.0
                    x1, y1, w, h = 0, 0, 0, 0

                    for box in results.boxes:
                        label = TARGET_CLASSES[int(box.cls)]
                        conf = float(box.conf)
                        x1_box, y1_box, x2_box, y2_box = map(int, box.xyxy[0])
                        
                        # คำนวณค่าสำหรับวาดป้ายชื่อ
                        (w, h), _ = cv2.getTextSize(f"{label} {conf:.2f}", cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
                        
                        # อัปเดตค่า x1, y1 สำหรับวาดป้าย (ใช้ค่าจาก box)
                        x1, y1 = x1_box, y1_box 
                        
                        # Draw bounding box and label
                        cv2.rectangle(frame, (x1_box, y1_box), (x2_box, y2_box), (0, 255, 0), 2) # <-- วาดกล่อง
                        cv2.rectangle(frame, (x1, y1 - 20), (x1 + w, y1), (0, 255, 0), -1)
                        cv2.putText(frame, f"{label} {conf:.2f}", (x1, y1 - 5),
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 0), 2)
            else:
                # --- นี่คือเฟรมที่จะถูกข้าม (ไม่ประมวลผล) ---
                # เราจะวาดกล่อง "เก่า" ค้างไว้
                if trigger == 1 and label: # ตรวจสอบว่ามี label (เคยเจอ)
                    cv2.rectangle(frame, (x1, y1 - 20), (x1 + w, y1), (0, 255, 0), -1)
                    cv2.putText(frame, f"{label} {conf:.2f}", (x1, y1 - 5),
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 0), 2)
                pass
            
            # --- การเข้ารหัสและส่งข้อมูลจะทำทุกเฟรม ---
            _, buffer = cv2.imencode('.jpg', frame, [int(cv2.IMWRITE_JPEG_QUALITY), 75])
            latest_image = base64.b64encode(buffer).decode('utf-8')

            if latest_image and react_clients:
                tasks = [client.send_text(latest_image) for client in react_clients]
                await asyncio.gather(*tasks, return_exceptions=True)

            await websocket.send_text("ACK")

    except WebSocketDisconnect:
        print(f"⚠️ Raspberry Pi disconnected: {websocket.client}")
    except Exception as e:
        print(f"❌ Error with Pi connection: {e}")
    finally:
        pi_websocket = None
        print("Pi connection closed.")


@app.websocket("/react_stream")
async def react_stream_endpoint(websocket: WebSocket):
    """
    Endpoint for React/Vue clients to receive the processed video stream.
    (No changes needed here)
    """
    await websocket.accept()
    react_clients.add(websocket)
    print(f"✅ React client connected: {websocket.client}")

    try:
        if latest_image:
            await websocket.send_text(latest_image)
        while True:
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        print(f"⚠️ React client disconnected: {websocket.client}")
    finally:
        react_clients.discard(websocket)
        print(f"React client {websocket.client} removed.")

# --- 7. RUN SERVER ---
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8765)