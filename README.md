# CarMB_frontend — main.py overview

This repository contains a FastAPI-based streaming server used to receive images from a Raspberry Pi, run a lightweight YOLO object detector, and forward processed frames to browser clients over WebSockets.

## About `main.py`

- Purpose: provide WebSocket endpoints for a Pi to send raw images and for web clients to receive processed frames. The server decodes incoming base64 JPEG frames, runs a YOLOv10-nano model on selected frames (frame-skipping to reduce CPU), draws bounding boxes & labels, and streams the annotated frames to connected front-end clients.

- Key endpoints:
  - `ws://<host>:<port>/pi_stream` — Raspberry Pi connects here and sends base64-encoded JPEG frames. The server responds with an "ACK" after each frame.
  - `ws://<host>:<port>/react_stream` — Browser (React/Vue) clients connect here to receive the latest processed frame as a base64 JPEG string.

- Main features and behavior:
  - Loads a YOLOv10-nano model (`ultralytics.YOLO('yolov10n')`) for fast inference.
  - Only processes every 7th frame (frame skipping) to reduce CPU usage; nevertheless, it encodes & forwards every incoming frame (annotated when available).
  - Targets a small set of classes (person, car, dog, traffic light, stop sign) and uses a configurable confidence threshold.
  - Keeps track of connected clients and broadcasts the latest encoded image using FastAPI WebSockets.

- Config and constants you'll find in the file:
  - `TARGET_CLASSES` / `TARGET_IDS` — mapping of class ids -> readable labels.
  - `CONFIDENCE_THRESHOLD` — float threshold for filtering detections.

- Dependencies (install in a venv):
  - Python 3.10+ recommended
  - fastapi
  - uvicorn
  - opencv-python
  - numpy
  - ultralytics (for YOLO)

- How to run (development):
  1. Create and activate a virtual environment.
  2. Install requirements (see list above).
  3. Run with uvicorn: `uvicorn main:app --host 0.0.0.0 --port 8765`

- Notes & caveats:
  - The script uses `YOLO('yolov10n')` which will download or look for the model weights; ensure network access or place the model file in the expected path.
  - The server assumes frames arrive as base64-encoded JPEGs; mismatches will be silently skipped.
  - The file currently prints logs to stdout; for production, integrate a proper logger and consider authentication for WebSocket endpoints.

If you want, I can add this README to `car_frontend_target/main` (push it there) or update a different README file in the repo root — tell me which location you prefer.
 
## About Sent_DATA1669.py

Purpose
  - Simple WebSocket relay for Raspberry Pi <-> browser communication. The module lets one Pi connect and broadcast messages to many browser clients and also lets browsers send commands back to the Pi.

Endpoints
  - `ws://<host>:<port>/ws/pi` — Pi connects here and sends text messages (telemetry, JSON, base64 strings, etc.). Messages received from the Pi are broadcast to all connected browsers.
  - `ws://<host>:<port>/ws/browser` — Browser clients connect here to receive broadcasts and may send text commands that will be forwarded to the Pi (if connected).

Behavior (quick summary)
  - Only one Pi connection is supported at a time (the `ConnectionManager` stores a single `pi_websocket`).
  - Browser clients are stored in a list and are all broadcast to concurrently.
  - `send_to_pi(message)` forwards browser-origin commands to the Pi.

Run (quick)
  1. Copy `Sent_DATA1669.py` into your backend folder with other FastAPI app files.
  2. Start with uvicorn (example port 8766):

     uvicorn Sent_DATA1669:app --host 0.0.0.0 --port 8766

Example usage snippets
  - Minimal Pi sender (text messages):

```python
import asyncio
import websockets

async def send_loop():
    uri = "ws://SERVER_IP:8766/ws/pi"
    async with websockets.connect(uri) as ws:
        while True:
            await ws.send("{\"temp\": 25.5}")
            await asyncio.sleep(1)

asyncio.run(send_loop())
```

  - Minimal browser receiver (JS):

```js
const ws = new WebSocket("ws://SERVER_IP:8766/ws/browser");
ws.onmessage = (ev) => { console.log("From Pi:", ev.data); };
ws.onopen = () => ws.send("hello from browser");
```

Notes
  - This module uses text WebSocket messages. For binary images use binary frames or base64-encode payloads and update the handlers accordingly.
  - Add authentication and input validation before exposing to the public Internet.

## About Sent_Speed_Gear2222.py

Purpose
  - A WebSocket relay with logging that forwards messages between a single Raspberry Pi and multiple browser clients. This variant adds debug logging for incoming messages to help with development and troubleshooting (useful for speed/gear telemetry).

Endpoints
  - `ws://<host>:<port>/ws/pi` — Pi connects here and sends text messages (telemetry, status, speed/gear info). The server prints each received message and forwards it to all connected browsers.
  - `ws://<host>:<port>/ws/browser` — Browser clients connect here to receive broadcasts and may send text commands which are forwarded to the Pi.

Behavior (quick summary)
  - Only one Pi connection at a time (`pi_websocket`).
  - Multiple browser clients are supported and messages from the Pi are broadcast concurrently.
  - Extra logging: received messages from Pi and browser are printed to stdout for debugging.

Run (quick)
  1. Copy `Sent_Speed_Gear2222.py` into your backend folder with other FastAPI app files.
  2. Start with uvicorn (example port 8767):

     uvicorn Sent_Speed_Gear2222:app --host 0.0.0.0 --port 8767

Minimal examples
  - Pi (Python) sending telemetry lines:

```python
import asyncio
import websockets

async def send_telemetry():
    uri = "ws://SERVER_IP:8767/ws/pi"
    async with websockets.connect(uri) as ws:
        while True:
            # example payload: speed and gear
            await ws.send('{"speed": 12.3, "gear": 2}')
            await asyncio.sleep(0.5)

asyncio.run(send_telemetry())
```

  - Browser (JS) receiving and printing telemetry:

```js
const ws = new WebSocket("ws://SERVER_IP:8767/ws/browser");
ws.onmessage = (ev) => console.log("Telemetry from Pi:", ev.data);
ws.onopen = () => ws.send("client connected");
```

Notes
  - Because the module logs messages to stdout, consider redirecting logs or using a logger when deploying to production.
  - Validate and sanitize incoming messages before forwarding if they come from untrusted clients.

## About server70.py

Purpose
  - A small TCP cloud-relay server that forwards joystick client traffic to a Raspberry Pi (and keeps a simple connection health check for the Pi). Useful when you need a lightweight TCP relay in between joystick controllers and the vehicle Pi.

Ports
  - Joystick clients listen on TCP port 1150 (JOYSTICK_CLIENT_PORT).
  - Raspberry Pi client listens on TCP port 1112 (PI_CLIENT_PORT).

Run
  - Run directly with Python 3: `python3 server70.py` (it runs two threads and prints status to stdout).

Notes
  - This server uses raw TCP sockets and forwards bytes verbatim; ensure protocol compatibility between joystick and Pi clients.
  - Add authentication, TLS, or VPN if you expose this to an untrusted network.

## About gps_client.py

Purpose
  - A ROS 2 node that reads GPS data from a SIM7600 module via serial AT commands, parses `AT+CGPSINFO` output, and publishes `sensor_msgs/NavSatFix` messages to `/gps/fix`.

Dependencies
  - ROS 2 (rclpy), `sensor_msgs`, and `pyserial` (python `serial` package).

Run
  - Run inside a sourced ROS 2 environment. Example (with ROS 2 and Python paths configured):

     python3 gps_client.py

Notes
  - The node attempts to auto-detect the SIM7600 serial port (fallback `/dev/ttyUSB2`) and will publish mock coordinates if no valid fix is available.
  - Ensure the SIM7600 module is powered and accessible; you may need to run with appropriate permissions or udev rules to access serial devices.

CarMB_Frontend

A modern React-based dashboard interface for controlling and monitoring an autonomous vehicle system. This frontend provides real-time camera feeds, vehicle controls, navigation, and system monitoring capabilities.

## Features

- **Real-time Camera Feed**: Live video streaming from vehicle cameras
- **Interactive Dashboard**: Monitor speed, battery, temperature, and other vehicle metrics

  - VR mode
- **Navigation**: Integrated map with route planning using Leaflet
- **WebSocket Integration**: Real-time communication with backend server for vehicle telemetry

## Technology Stack

- **React 19.2.0**: Modern React with latest features
- **React Router 7.9.4**: Client-side routing
- **Bootstrap 5.3.8**: Responsive UI framework
- **Reactstrap 9.2.3**: React Bootstrap components
- **Leaflet**: Interactive maps
- **Chart.js 4.5.1**: Data visualization
- **FontAwesome 7.x**: Icon library
- **SASS**: Advanced CSS preprocessing

## Quick start

### Prerequisites

- Node.js (v20.x or higher)
- npm (v10.x or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/preminwza007/selfdrive_frontend.git
cd selfdrive_frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Runs the test suite
- `npm run compile:scss` - Compiles SCSS to CSS
- `npm run minify:scss` - Minifies compiled CSS

## Configuration

### WebSocket Connection

The frontend connects to a WebSocket server for real-time data. Update the WebSocket URL in `src/views/examples/Maps.js`:

```javascript
const ws = new WebSocket("ws://YOUR_SERVER_IP:PORT/ws/browser");
```

## Project Structure

```
selfdrive_frontend/
├── public/              # Static files
├── src/
│   ├── assets/         # Images, styles, fonts
│   ├── components/     # Reusable React components
│   │   ├── Headers/    # Header components
│   │   ├── Footers/    # Footer components
│   │   ├── Navbars/    # Navigation components
│   │   └── Sidebar/    # Sidebar component
│   ├── layouts/        # Page layouts
│   ├── views/          # Page components
│   │   ├── Index.js    # Dashboard with camera feed
│   │   └── examples/   # Additional pages
│   ├── routes.js       # Route definitions
│   └── index.js        # App entry point
└── package.json

```

## Key Components

- **CameraStream**: Displays live video feed from vehicle cameras
- **MapComponent**: Interactive map with vehicle location and routing
- **IconCards**: Control panel for various vehicle functions
- **Speedometer**: Real-time speed display
- **ClimateCard**: Climate control interface
- **BottomControls**: Additional vehicle controls

## Browser Support

The application supports the latest versions of:
- Chrome
- Firefox
- Safari
- Edge

## Dependency Updates (Latest)

All dependencies have been updated to their latest versions:
- React 18 → 19.2.0
- Bootstrap 4 → 5.3.8
- Chart.js 2 → 4.5.1
- React Router 6 → 7.9.4
- FontAwesome → 7.1.0

## License

This project is licensed under the MIT License.

## Acknowledgments

This project is built on top of the [Argon Dashboard React](https://www.creative-tim.com/product/argon-dashboard-react) template by Creative Tim, licensed under MIT.
