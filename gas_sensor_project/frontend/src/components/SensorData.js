import React, { useEffect, useState } from 'react';
import './style.css'

const SensorData = () => {
    const [latestData, setLatestData] = useState(null);

    const fetchLatestData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/sensor-data');
            const data = await response.json();
            // Get the last entry from the CSV data
            if (data.length > 0) {
                setLatestData(data[data.length - 1]); // Update to show only the latest reading
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchLatestData(); // Fetch data when the component mounts
        const interval = setInterval(fetchLatestData, 5000); // Fetch new data every 5 seconds
        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    return (
        <div>
            <h1 className='title'>Latest Sensor Data</h1>
            {latestData ? (
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Temperature (°C)</th>
                            <th>Humidity (%)</th>
                            <th>Gas Level</th>
                            <th className='status'>Alert Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='answer'>
                            <td>{latestData.Timestamp}</td>
                            <td>{latestData['Temperature (°C)']}</td>
                            <td>{latestData['Humidity (%)']}</td>
                            <td>{latestData['Gas Level']}</td>
                            <td>{latestData['Alert Status']}</td>
                        </tr>
                    </tbody>
                </table>
            ) : (
                <p>Loading latest data...</p>
            )}
        </div>
    );
};

export default SensorData;
