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
