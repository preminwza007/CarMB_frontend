import rclpy
from rclpy.node import Node
# Crucial: Import both NavSatFix (the message) and NavSatStatus (the constants)
from sensor_msgs.msg import NavSatFix, NavSatStatus 

import serial
import time
import re
import sys
import logging
import os
from serial.tools import list_ports

# --- Configuration --- 
# Standard baud rate for AT commands on SIMCOM modules 
BAUDRATE = 115200 
# Expected port for AT Commands (used as fallback/default) 
DEFAULT_PORT = "/dev/ttyUSB2" 
# SIMCOM Vendor ID (VCP or similar) to identify the device. 
SIMCOM_VID = 0x1E0E 

# --- MOCK COORDINATES --- 
MOCK_LATITUDE = 37.4219999 
MOCK_LONGITUDE = -122.0840575 
# ------------------------ 

# Set up simple logging (used for initial connection/debugging before ROS takes over)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class Sim7600GpsNode(Node):
    """
    ROS 2 Node to read GPS data from a SIM7600 module via serial port,
    parse the AT+CGPSINFO output, and publish it as a NavSatFix message.
    """
    def __init__(self):
        # Initialize the ROS 2 Node
        super().__init__('sim7600_gps_node')
        
        # Create a ROS 2 Publisher for GPS data
        self.publisher_ = self.create_publisher(NavSatFix, '/gps/fix', 10)
        self.get_logger().info('GPS Publisher initialized on /gps/fix')

        # Serial Port and AT Command Configuration
        self.current_port = self.find_sim7600_port()
        self.ser = None
        self.is_connected = False
        
        # Timer to run the main logic (polling the GPS module every 5.0 seconds)
        timer_period = 5.0 
        self.timer = self.create_timer(timer_period, self.gps_polling_callback)
        
        # Initialization and connection
        self.connect_and_init_module()

    def find_sim7600_port(self):
        """Dynamically finds the correct serial port for the SIM7600 module."""
        if os.path.exists(DEFAULT_PORT):
            self.get_logger().info(f"Default port {DEFAULT_PORT} found and will be used.")
            return DEFAULT_PORT
        
        ports = list_ports.comports()
        for port in ports:
            if port.vid == SIMCOM_VID:
                self.get_logger().info(f"✅ Found SIMCOM device at {port.device} using VID {hex(SIMCOM_VID)}.")
                return port.device
        
        self.get_logger().warning("⚠️ Could not find SIM7600 module by VID. Falling back to default.")
        return DEFAULT_PORT

    def send_at(self, command):
        """Sends an AT command and waits for a response from the module."""
        if not self.is_connected:
            return ""
        try:
            self.ser.reset_input_buffer()
            self.ser.write(f"{command}\r\n".encode())
            time.sleep(0.1) # Short wait for response
            response = self.ser.read_all().decode(errors='ignore').strip()
            
            if command != "AT+CGPSINFO":
                self.get_logger().info(f"AT Command: {command} -> Response: {response.replace('\n', ' | ')}")
                
            return response
        except serial.SerialException as e:
            self.get_logger().error(f"❌ Serial communication error: Port lost. Details: {e}")
            self.is_connected = False
            return ""
        except Exception as e:
            self.get_logger().error(f"❌ Unexpected error in send_at: {e}")
            return ""

    def parse_gps_info(self, info):
        """Parses the GPS info from the AT+CGPSINFO string (DDMM.MMMM, DDDMM.MMMM)."""
        # Ensure it handles the standard format, which includes the leading '+CGPSINFO:'
        match = re.search(r'\+CGPSINFO:\s*(\d{4}\.\d+),([NS]),(\d{5}\.\d+),([EW]),', info)
        
        if match:
            lat_raw, lat_dir, lon_raw, lon_dir = match.groups()
            
            # Check for 'No Fix' pattern, often represented by 0s
            if lat_raw.startswith('0000') or lon_raw.startswith('00000'):
                return None, None

            # Convert raw latitude (DDMM.MMMM) to decimal degrees
            degrees_lat = int(lat_raw[:2]) 
            minutes_lat = float(lat_raw[2:])
            latitude = degrees_lat + (minutes_lat / 60)
            if lat_dir == 'S': 
                latitude *= -1
            
            # Convert raw longitude (DDDMM.MMMM) to decimal degrees
            degrees_lon = int(lon_raw[:3])
            minutes_lon = float(lon_raw[3:])
            longitude = degrees_lon + (minutes_lon / 60)
            if lon_dir == 'W': 
                longitude *= -1
                
            return latitude, longitude
            
        return None, None
            
    def connect_and_init_module(self):
        """Initializes the serial connection and GPS module."""
        if not os.path.exists(self.current_port):
            self.get_logger().error(f"❌ Final check failed: Port {self.current_port} does not exist. Ensure the module is powered on.")
            return

        try:
            self.get_logger().info(f"Attempting connection to {self.current_port}...")
            self.ser = serial.Serial(
                port=self.current_port,
                baudrate=BAUDRATE,
                timeout=1,
                rtscts=True,
                dsrdtr=True
            )
            self.is_connected = True
            self.get_logger().info("✅ Connected to SIM7600G-H successfully.")

            # --- Module Initialization (GPS ON) ---
            self.send_at("AT")
            self.send_at("AT+CGPS=0") # Disable first
            response = self.send_at("AT+CGPS=1,1") # Enable GPS (mode 1 for standalone)
            if "ERROR" in response:
                self.get_logger().warning("⚠️ Failed to enable GPS with AT+CGPS=1,1. Module may already be running.")
            
        except serial.SerialException as e:
            self.get_logger().error(f"❌ Failed to open port {self.current_port}: {e}")
            self.is_connected = False
            
    def gps_polling_callback(self):
        """The main polling logic executed by the ROS 2 timer."""
        if not self.is_connected:
            self.get_logger().warning("Module not connected. Attempting reconnection in next cycle.")
            self.connect_and_init_module()
            return
            
        # 1. Request GPS info
        response = self.send_at("AT+CGPSINFO")
        lat, lon = self.parse_gps_info(response)
        is_mock = False

        if lat is None or lon is None:
            # --- MOCK FIX INJECTION ---
            lat = MOCK_LATITUDE
            lon = MOCK_LONGITUDE
            is_mock = True
            self.get_logger().info(f"📍 MOCK FIX: Lat={lat:.6f}, Lon={lon:.6f} | Publishing mock data.")
        else:
            self.get_logger().info(f"🛰️ REAL FIX: Lat={lat:.6f}, Lon={lon:.6f} | Publishing real data.")

        # 2. Create and populate the ROS 2 NavSatFix message
        gps_fix_msg = NavSatFix()
        
        # Header (Crucial for time synchronization and coordinate frames)
        gps_fix_msg.header.stamp = self.get_clock().now().to_msg()
        gps_fix_msg.header.frame_id = 'gps_link' 
        
        # Position Data
        gps_fix_msg.latitude = lat
        gps_fix_msg.longitude = lon
        # Altitude is not provided by AT+CGPSINFO, set to NaN or 0 if necessary
        # gps_fix_msg.altitude = float('nan') 

        # --- FIX 1 & 2: Use NavSatStatus for constants ---
        # Status (Indicate whether it's a real or mock fix)
        gps_fix_msg.status.status = NavSatStatus.STATUS_FIX if not is_mock else NavSatStatus.STATUS_NO_FIX
        gps_fix_msg.status.service = NavSatStatus.SERVICE_GPS
        
        # Position Covariance (placeholder, adjust for true sensor accuracy)
        gps_fix_msg.position_covariance = [0.1, 0.0, 0.0,
                                           0.0, 0.1, 0.0,
                                           0.0, 0.0, 0.1]
        gps_fix_msg.position_covariance_type = NavSatFix.COVARIANCE_TYPE_DIAGONAL_KNOWN
        
        # 3. Publish the message
        self.publisher_.publish(gps_fix_msg)

    def destroy_node(self):
        """Clean up function called when the node is shut down."""
        self.get_logger().info("Disabling GPS and closing serial port...")
        # Only attempt to send AT command if connected
        if self.ser and self.ser.is_open:
            self.send_at("AT+CGPS=0") # Disable GPS
            self.ser.close()
        super().destroy_node()

def main(args=None):
    # Initialize the ROS 2 context
    rclpy.init(args=args)
    
    # Create the node instance
    sim7600_gps_node = Sim7600GpsNode()

    try:
        # Spin the node to process callbacks (timer)
        rclpy.spin(sim7600_gps_node)
    except KeyboardInterrupt:
        # User pressed Ctrl+C
        pass
    except Exception as e:
        # FIX 3: Use .fatal() for the highest severity log level
        sim7600_gps_node.get_logger().fatal(f"A fatal runtime error occurred: {e}") 
    finally:
        # Ensure cleanup is always called
        sim7600_gps_node.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()