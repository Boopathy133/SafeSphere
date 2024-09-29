import serial
import csv
import time

# Set up the Arduino connection
arduino_port = "COM5"  # Use your actual COM port here
baud_rate = 9600  # Arduino's baud rate
timeout = 1  # Timeout for the serial connection

# CSV file setup
csv_file = "sensor_data.csv"  # Path to store the CSV file
header = ["Timestamp", "Temperature (C)", "Humidity (%)", "Gas Level", "Alert Status"]  # Column headers

# Initialize serial communication with Arduino
try:
    ser = serial.Serial(arduino_port, baud_rate, timeout=timeout)
    print(f"Connected to Arduino on {arduino_port}")
    time.sleep(2)  # Wait for the connection to initialize
except serial.SerialException as e:
    print(f"Error: Could not connect to {arduino_port}")
    raise e

# Function to write sensor data to the CSV file
def log_data_to_csv(timestamp, temperature, humidity, gas_level, alert_status):
    data_row = [timestamp, temperature, humidity, gas_level, alert_status]
    with open(csv_file, mode='a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(data_row)
    print(f"Logged data: {data_row}")

# Ensure the CSV file has headers
with open(csv_file, mode='w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(header)
    print(f"CSV file created: {csv_file}")

# Infinite loop to continuously read from the sensors
try:
    while True:
        if ser.in_waiting > 0:
            # Read a line from the serial port (from Arduino)
            line = ser.readline().decode('utf-8').strip()
            print(f"Received: {line}")  # Print the line for debugging

            # Split the line by commas
            data = line.split(",")

            # Handle data lines
            if len(data) == 5:
                try:
                    timestamp = int(data[0])
                    temperature = float(data[1])
                    humidity = float(data[2])
                    gas_level = int(data[3])
                    alert_status = data[4].strip()
                    log_data_to_csv(timestamp, temperature, humidity, gas_level, alert_status)
                except ValueError as ve:
                    print(f"ValueError: {ve}")
            else:
                print("Error: Incorrect number of data fields.")

        time.sleep(1)  # Delay to prevent CPU overuse

except KeyboardInterrupt:
    print("Data logging stopped.")

finally:
    ser.close()  # Ensure the serial connection is closed when the script ends
    print("Serial connection closed.")
