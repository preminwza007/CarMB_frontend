import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import './MapNavigator.css'; // ตรวจสอบว่าไฟล์ CSS นี้อยู่ในตำแหน่งที่ถูกต้อง

// เพิ่ม prop ใหม่ชื่อ 'uiVariant' (อาจใช้ชื่ออื่นเช่น size, variant)
const MapComponent = ({ uiVariant = 'default' }) => {
    // Refs
    const mapRef = useRef(null);
    const currentLocationMarkerRef = useRef(null);
    const routeControlRef = useRef(null);
    const autoPan = useRef(true);
    const wsGpsRef = useRef(null);
    const wsPathRef = useRef(null);

    // State
    const [gpsStatus, setGpsStatus] = useState('Connecting...');
    const [routeSummary, setRouteSummary] = useState(null);
    const [currentBattery, setCurrentBattery] = useState(100);
    const [currentGuidance, setCurrentGuidance] = useState(null);
    const [currentAngleInfo, setCurrentAngleInfo] = useState(null);

    // Landmarks
    const landmarks = [
        { name: "Building 40", lat: 13.821130, lng: 100.514616 },
        { name: "Building 62", lat: 13.820390, lng: 100.516507 },
        { name: "Air stadium", lat: 13.822581, lng: 100.512165 },
        { name: "Pre-Engineering Building", lat: 13.823599, lng: 100.511679 },
        { name: "Building 81", lat: 13.821297, lng: 100.513463 },
        { name: "KMUTNB 7-Eleven", lat: 13.821271, lng: 100.515246 },
        { name: "Building 63", lat: 13.820476, lng: 100.515952 },
        { name: "Faculty of Architecture", lat: 13.819815, lng: 100.516172 },
        { name: "Palm Garden", lat: 13.819815, lng: 100.515029 },
        { name: "Faculty of Applied Art", lat: 13.819971, lng: 100.514629 },
        { name: "Library", lat: 13.819794, lng: 100.514165 },
        { name: "Building 22", lat: 13.819244, lng: 100.514136 },
        { name: "Building 21", lat: 13.819359, lng: 100.514463 },
        { name: "TGGS Building", lat: 13.818992, lng: 100.513819 },
        { name: "Main Gate", lat: 13.818711, lng: 100.514198 },
        { name: "Building 44", lat: 13.820680, lng: 100.515279 },
        { name: "KMUTNB Research Center", lat: 13.819265, lng: 100.515370 },
        { name: "Building 89", lat: 13.821977, lng: 100.512755 },
        { name: "Building 88", lat: 13.822422, lng: 100.513235 },
        { name: "Building 86", lat: 13.822469, lng: 100.513232 },
        { name: "International University Building", lat: 13.822722, lng: 100.512806 },
        { name: "Building 98", lat: 13.823961, lng: 100.512156 },
        { name: "Pre-Engineering Dormitory", lat: 13.823459, lng: 100.512272 },
        { name: "Building 64", lat: 13.820953, lng: 100.515697 },
        { name: "Building 65", lat: 13.821101, lng: 100.516097 },
        { name: "Building 66", lat: 13.820937, lng: 100.516223 },
        { name: "Building 67", lat: 13.820851, lng: 100.516494 },
        { name: "Building 68", lat: 13.820807, lng: 100.516630 },
        { name: "Building 69", lat: 13.820719, lng: 100.516912 }
    ];

    // --- ฟังก์ชันอัปเดต UI ที่แปลงมาจาก Vanilla JS ---
    const updateGuidanceAndAngle = (routeInstructions, currentLatLng) => {
        const instruction = routeInstructions?.[0];

        if (instruction) {
            setCurrentGuidance({
                text: instruction.text,
                distance: instruction.distance,
                type: instruction.type,
                modifier: instruction.modifier,
            });

            let angle = 0;
            let description = 'Proceed straight ahead';
            let directionText = 'Straight';

            if (instruction.type === 'DestinationReached') {
                directionText = 'Destination';
                description = 'You have arrived!';
            } else {
                switch (instruction.modifier) {
                    case 'left': case 'slight left': case 'sharp left':
                        directionText = `Turn Left`; description = `Turn left soon.`; angle = -90; break;
                    case 'right': case 'slight right': case 'sharp right':
                        directionText = `Turn Right`; description = `Turn right soon.`; angle = 90; break;
                    case 'uturn':
                        directionText = `U-Turn`; description = `Make a U-Turn.`; angle = 180; break;
                    default:
                        directionText = `Straight`; description = `Continue straight.`; angle = 0; break;
                }
            }
            setCurrentAngleInfo({ angle, text: directionText, description });

        } else {
            setCurrentGuidance(null);
            setCurrentAngleInfo(null);
        }
    };

    const updateBatteryDisplay = (distanceKm) => {
        const batteryDrain = distanceKm * 0.5;
        setCurrentBattery(prev => Math.max(0, prev - batteryDrain));
    };

    // --- useEffect for Map Initialization and WebSocket ---
    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map('map-navigator-container').setView([13.821130, 100.514616], 17);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
            }).addTo(mapRef.current);

            const currentLocationIcon = L.divIcon({
                 className: 'current-location-marker',
                 html: `<svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C8.68 2 6 4.68 6 8s6 14 6 14s6-10.69 6-14s-2.68-6-6-6z" fill="#5E72E4" stroke="#fff" stroke-width="1.5"/><circle cx="12" cy="8" r="3" fill="#fff" stroke="#5E72E4" stroke-width="1.5"/></svg>`,
                 iconSize: [24, 24],
                 iconAnchor: [12, 24]
            });
            currentLocationMarkerRef.current = L.marker([13.821130, 100.514616], { icon: currentLocationIcon }).addTo(mapRef.current);
            mapRef.current.on('dragstart', () => autoPan.current = false);
        }

        const gpsServerUrl = 'ws://89.213.177.84:5000';
        wsGpsRef.current = new WebSocket(gpsServerUrl);
        wsGpsRef.current.onopen = () => setGpsStatus('Connected');
        wsGpsRef.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.latitude && data.longitude) {
                    const newLatLon = [data.latitude, data.longitude];
                    if (currentLocationMarkerRef.current) {
                        currentLocationMarkerRef.current.setLatLng(newLatLon);
                    }
                    if (autoPan.current && mapRef.current) {
                        mapRef.current.panTo(newLatLon);
                    }
                    setGpsStatus(`Active (FIX)`);
                }
            } catch (e) { console.error('Error parsing GPS data:', e); }
        };
        wsGpsRef.current.onclose = () => setGpsStatus('Disconnected');
        wsGpsRef.current.onerror = () => setGpsStatus('Connection Error');

        return () => {
            if (wsGpsRef.current) wsGpsRef.current.close();
            if (wsPathRef.current) wsPathRef.current.close();
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // --- Route Planning ---
    const planRoute = () => {
        if (!mapRef.current || !currentLocationMarkerRef.current) return;

        const selectedDestinationName = document.getElementById('destination-select').value;
        const destLandmark = landmarks.find(lm => lm.name === selectedDestinationName);
        if (!destLandmark) return;

        clearRoute();

        const currentLatLng = currentLocationMarkerRef.current.getLatLng();

        routeControlRef.current = L.Routing.control({
            waypoints: [currentLatLng, L.latLng(destLandmark.lat, destLandmark.lng)],
            show: false, addWaypoints: false,
            router: L.Routing.osrmv1({ serviceUrl: `https://router.project-osrm.org/route/v1` }),
            lineOptions: { styles: [{ color: '#5E72E4', weight: 6, opacity: 0.8 }] }
        }).addTo(mapRef.current);

        routeControlRef.current.on('routesfound', (e) => {
            const route = e.routes[0];
            if (route) {
                const distanceKm = route.summary.totalDistance / 1000;
                setRouteSummary({
                    from: 'Current Location', to: selectedDestinationName,
                    distance: `${distanceKm.toFixed(2)} km`,
                    time: `${(route.summary.totalTime / 60).toFixed(0)} min`
                });
                updateBatteryDisplay(distanceKm);

                const instructions = route.instructions.map(inst => ({
                     text: inst.text, distance: inst.distance, type: inst.type,
                     modifier: inst.modifier, bearing: inst.bearing
                 }));
                updateGuidanceAndAngle(instructions, currentLatLng);

                autoPan.current = true;
                
                const geometry = route.coordinates.map(c => [c.lng, c.lat]);
                const dataToSend = { 
                     geometry: geometry, distance: route.summary.totalDistance, 
                     time: route.summary.totalTime, message_type: "shortest_path_route"
                };
                
                wsPathRef.current = new WebSocket('ws://89.213.177.84:5001');
                wsPathRef.current.onopen = () => { wsPathRef.current.send(JSON.stringify(dataToSend)); };
                wsPathRef.current.onerror = (err) => console.error('Path WebSocket error:', err);
                 wsPathRef.current.onclose = () => console.log('Path WebSocket closed.');
            }
        });
         routeControlRef.current.on('routingerror', (e) => { alert('Could not find a route.'); });
    };

    const clearRoute = () => {
        if (!mapRef.current || !routeControlRef.current) return;
        mapRef.current.removeControl(routeControlRef.current);
        routeControlRef.current = null;
        setRouteSummary(null);
        setCurrentGuidance(null);
        setCurrentAngleInfo(null);
    };
    
    const recenterMap = () => {
        if (!mapRef.current || !currentLocationMarkerRef.current) return;
        autoPan.current = true;
        mapRef.current.panTo(currentLocationMarkerRef.current.getLatLng());
    };

    // --- Battery Bar Style Calculation ---
    const getBatteryBarStyle = () => {
        const percent = Math.max(0, currentBattery);
        let color = '#ef4444'; // Red default
        if (percent > 50) color = '#10b981'; // Green
        else if (percent > 20) color = '#f59e0b'; // Yellow
        return { width: `${percent}%`, backgroundColor: color, height: '100%', borderRadius: 'inherit' };
    };

    // --- Conditional Styling for Panels based on uiVariant ---
    const getControlPanelStyle = () => ({
        position: 'absolute', top: '10px', right: '10px', zIndex: 1000,
        padding: '0.6rem', backgroundColor: '#2C2F33', borderRadius: '10px',
        width: '200px', display: 'flex', flexDirection: 'column', gap: '5px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
    });

    const getSummaryPanelStyle = () => ({
        position: 'absolute', bottom: '10px', left: '10px', zIndex: 1000,
        padding: '0.6rem', backgroundColor: '#2C2F33', borderRadius: '10px', color: 'white',
        width: '200px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
    });

    const getGuidancePanelStyle = () => {
        if (uiVariant === 'dashboard') {
            // สไตล์สำหรับหน้า Dashboard (เล็กสุด)
            return {
                position: 'absolute', bottom: '10px', right: '10px', zIndex: 1000,
                padding: '0.3rem 0.5rem',
                backgroundColor: '#2C2F33', borderRadius: '6px',
                width: '130px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
            };
        } else {
            // สไตล์สำหรับหน้าอื่น (เช่น Maps - ขนาดปกติที่ลดลงแล้ว)
             return {
                position: 'absolute', bottom: '10px', right: '10px', zIndex: 1000,
                padding: '0.6rem', backgroundColor: '#2C2F33', borderRadius: '10px', color: 'white',
                width: '130px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
            };
        }
    };

     const getGuidanceTextStyle = () => {
        if (uiVariant === 'dashboard') {
            return {
                title: {fontSize: '0.7rem', fontWeight: 'bold', margin: '0 0 1px 0', color: 'white'},
                text: {fontSize: '0.55rem', color: '#adb5bd', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}
            }
        } else {
             return {
                title: {fontSize: '0.85rem', fontWeight: 'bold', margin: '0 0 4px 0', color: 'white'},
                text: {fontSize: '0.7rem', color: '#adb5bd', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}
            }
        }
     };

     const getAnglePanelStyle = () => ({
        position: 'absolute', top: '10px', left: '10px', zIndex: 1000,
        padding: '0.5rem', backgroundColor: '#2C2F33', borderRadius: '10px', color: 'white',
        display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
     });


    return (
        <div style={{ position: "relative", width: '100%', height: '100%', display: 'flex', background: '#1C1E21', borderRadius: '15px' }}>
            {/* Map Container */}
            <div id="map-navigator-container" style={{ flexGrow: 1, borderRadius: '15px' }}></div>

            {/* Control Panel */}
            <div style={getControlPanelStyle()}>
                <h2 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'white', margin: 0 }}>KMUTNB Navigator</h2>
                <p style={{ fontSize: '0.65rem', color: '#adb5bd', margin: 0 }}><b>GPS Status:</b> {gpsStatus}</p>
                <select id="destination-select" style={{ width: '100%', padding: '4px', fontSize: '0.7rem', borderRadius: '5px', border: 'none', backgroundColor: '#1C1E21', color: 'white' }}>
                    {landmarks.map(lm => <option key={lm.name} value={lm.name}>{lm.name}</option>)}
                </select>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                    <button onClick={planRoute} style={{ padding: '4px', fontSize: '0.7rem', borderRadius: '5px', backgroundColor: '#5E72E4', color: 'white', border: 'none', cursor: 'pointer', width: '100%' }}>Plan Route</button>
                    <button onClick={recenterMap} style={{ padding: '4px', fontSize: '0.7rem', borderRadius: '5px', backgroundColor: '#4a4d52', color: 'white', border: 'none', cursor: 'pointer', width: '100%' }}>Recenter</button>
                </div>
                <button onClick={clearRoute} style={{ padding: '4px', fontSize: '0.7rem', borderRadius: '5px', backgroundColor: '#f5365c', color: 'white', border: 'none', cursor: 'pointer' }}>Clear Route</button>
            </div>
            
            {/* Summary Panel */}
            {routeSummary && (
                <div style={getSummaryPanelStyle()}>
                    <h4 style={{fontSize: '0.85rem', fontWeight: 'bold', margin: '0 0 4px 0', color: 'white'}}>Route Summary</h4>
                    <p style={{fontSize: '0.65rem', color: '#adb5bd', margin: '1px 0'}}><b>From:</b> {routeSummary.from}</p>
                    <p style={{fontSize: '0.65rem', color: '#adb5bd', margin: '1px 0'}}><b>To:</b> {routeSummary.to}</p>
                    <p style={{fontSize: '0.65rem', color: '#adb5bd', margin: '1px 0'}}><b>Distance:</b> {routeSummary.distance}</p>
                    <p style={{fontSize: '0.65rem', color: '#adb5bd', margin: '1px 0'}}><b>Time:</b> {routeSummary.time}</p>
                     <div style={{marginTop: '0.4rem'}}>
                         <p style={{fontWeight: 'bold', fontSize: '0.65rem', color: '#adb5bd', marginBottom: '0.1rem'}}>Final Battery:</p>
                         <div style={{width: '100%', height: '6px', backgroundColor: '#1C1E21', borderRadius: '3px', overflow: 'hidden'}}>
                             <div style={getBatteryBarStyle()}></div>
                         </div>
                     </div>
                </div>
            )}

            {/* Guidance Panel (Next Turn) - ใช้สไตล์ตามเงื่อนไข */}
            {currentGuidance && (
                 <div style={getGuidancePanelStyle()}>
                     <h4 style={getGuidanceTextStyle().title}>Next Turn</h4>
                     <p style={getGuidanceTextStyle().text}>
                         {currentGuidance.text}
                     </p>
                 </div>
            )}

             {/* Angle Panel */}
             {currentAngleInfo && (
                 <div style={getAnglePanelStyle()}>
                     <svg className="angle-arrow" width="20" height="20" viewBox="0 0 24 24" fill="#5E72E4" style={{ transform: `rotate(${currentAngleInfo.angle}deg)` }}>
                         <path d="M12 2L18.5 9H15V22H9V9H5.5L12 2Z"/>
                     </svg>
                     <div>
                         <p style={{fontSize: '0.85rem', fontWeight: 'bold', margin: 0}}>{currentAngleInfo.text}</p>
                         <p style={{fontSize: '0.65rem', color: '#adb5bd', margin: 0}}>{currentAngleInfo.description}</p>
                     </div>
                 </div>
             )}

        </div>
    );
};

export default MapComponent;