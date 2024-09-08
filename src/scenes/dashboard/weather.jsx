import React, { useState, useEffect } from 'react';
import 'weather-icons/css/weather-icons.min.css';
import './Weather.css'; // CSS 파일을 import

function Weather() {
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const getWeatherByLocation = async (lat, lon) => {
        try {
            const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=f5c261b2f16a7a5d5ad7e68b9d004655&units=metric`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch weather data");
            }
            const data = await response.json();
            setWeather(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching weather data", error);
            setError("Failed to fetch weather data");
            setLoading(false);
        }
    };

    useEffect(() => {
        // 서울의 위도와 경도
        const seoulLat = 37.5665;
        const seoulLon = 126.978;
        getWeatherByLocation(seoulLat, seoulLon);
    }, []);

    if (loading) {
        return <p className="loading-message">Loading...</p>;
    }

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    if (!weather) {
        return <div>No weather data available.</div>;
    }

    const { city, list } = weather;

    // Filter data for the next 4 days (every 8th entry roughly represents a day)
    const dailyForecasts = list.filter((item, index) => index % 8 === 0).slice(0, 4);

    // Korean weekdays mapping
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

    // Get today's date
    const today = new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });

    return (
        <div className="weather-widget">
            <h2 className="weather-header">날씨({city.name})</h2>
            <div className="forecast">
                {dailyForecasts.map((item, index) => {
                    const { main, weather: weatherDetails, dt_txt } = item;
                    const iconClass = getIconClass(weatherDetails[0].icon);
                    const date = new Date(dt_txt);
                    const month = date.getMonth() + 1; // Months are zero-based
                    const day = date.getDate();
                    const weekday = weekdays[date.getDay()]; // Get the day of the week in Korean
                    const dateString = `${month}/${day}`;
                    const isToday = dateString === today; // Check if the date is today

                    return (
                        <div key={index} className={`forecast-day ${isToday ? 'today' : ''}`} style={{width: '24%'}}>
                            <div className="date">
                                {`${month}/${day}`}
                            </div>
                            <div className="weekday">
                               {weekday}
                            </div>
                            <i className={iconClass} style={{ fontSize: '60px' }}></i>
                            <div className="temperature">
                                <span>{Math.round(main.temp)}°C</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const getIconClass = (iconCode) => {
    switch (iconCode) {
        case '01d':
            return 'wi wi-day-sunny';
        case '01n':
            return 'wi wi-night-clear';
        case '02d':
            return 'wi wi-day-cloudy';
        case '02n':
            return 'wi wi-night-cloudy';
        case '03d':
        case '03n':
            return 'wi wi-cloud';
        case '04d':
        case '04n':
            return 'wi wi-cloudy';
        case '09d':
        case '09n':
            return 'wi wi-showers';
        case '10d':
        case '10n':
            return 'wi wi-rain';
        case '11d':
        case '11n':
            return 'wi wi-thunderstorm';
        case '13d':
        case '13n':
            return 'wi wi-snow';
        case '50d':
        case '50n':
            return 'wi wi-fog';
        default:
            return 'wi wi-na'; // Fallback icon
    }
};

export default Weather;
