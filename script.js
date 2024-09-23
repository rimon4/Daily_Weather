// Fetch elements
const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-btn");
const locationButton = document.querySelector(".location-btn");
const weatherDataContainer = document.querySelector(".weather-data");
const currentWeather = document.querySelector(".current-weather");
const forecastCards = document.querySelector(".weather-cards");

// API configuration
const apiKey = '62c61b1cd9a04d50957121015242209';
const apiBaseUrl = 'https://api.weatherapi.com/v1/';

// Function to fetch weather data based on city name or coordinates
const getWeatherData = async (query) => {
    try {
        const weatherResponse = await fetch(`${apiBaseUrl}forecast.json?key=${apiKey}&q=${query}&days=4&aqi=no&alerts=no`);
        const weatherData = await weatherResponse.json();
        displayWeather(weatherData);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Could not fetch weather data. Please try again.");
    }
};

// Function to display current weather and forecast data
const displayWeather = (weatherData) => {
    const current = weatherData.current;
    const forecast = weatherData.forecast.forecastday;

    // Display current weather
    currentWeather.querySelector('h2').textContent = `${weatherData.location.name} (${new Date().toLocaleDateString()})`;
    currentWeather.querySelector('.details h4:nth-of-type(1)').textContent = `Temperature: ${current.temp_c}°C`;
    currentWeather.querySelector('.details h4:nth-of-type(2)').textContent = `Wind: ${current.wind_kph} KPH`;
    currentWeather.querySelector('.details h4:nth-of-type(3)').textContent = `Humidity: ${current.humidity}%`;
    currentWeather.querySelector('.icon img').src = `https:${current.condition.icon}`;
    currentWeather.querySelector('.icon h4').textContent = current.condition.text;

    // Display 4-day forecast
    forecastCards.innerHTML = ""; // Clear previous forecast

    forecast.forEach((day) => {
        const forecastDate = new Date(day.date).toLocaleDateString();
        const forecastCard = `
            <li class="card">
                <h3>${forecastDate}</h3>
                <img src="https:${day.day.condition.icon}" alt="weather-icon">
                <h4>Temperature: ${day.day.avgtemp_c}°C</h4>
                <h4>Wind: ${day.day.maxwind_kph} KPH</h4>
                <h4>Humidity: ${day.day.avghumidity}%</h4>
            </li>
        `;
        forecastCards.innerHTML += forecastCard;
    });
};

// Function to handle search button click
const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (!cityName) {
        alert("Please enter a city name.");
        return;
    }
    getWeatherData(cityName);
};

// Function to get weather data for the user's current location
const useCurrentLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            const locationQuery = `${latitude},${longitude}`;
            getWeatherData(locationQuery);
        }, (error) => {
            console.error("Error fetching location:", error);
            alert("Could not fetch your location. Please enable location services and try again.");
        });
    } else {
        alert("Geolocation is not supported by your browser.");
    }
};

// Add event listeners
searchButton.addEventListener("click", getCityCoordinates);
locationButton.addEventListener("click", useCurrentLocation);
