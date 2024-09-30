document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('getWeatherButton').addEventListener('click', getWeather);
});

async function getWeather() {
    const apiKey = 'UDFHV6H2TXZ5Z5PVVWSGYDL8C';  
    const city = document.getElementById('cityInput').value;

    if (city === '') {
        alert('Please enter a city name');
        return;
    }

    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();

        const cityName = data.resolvedAddress;
        const temperature = data.days[0].temp;
        const description = data.days[0].conditions;

        // Show weather info
        const weatherResult = `
            <h2>${cityName}</h2>
            <p>Temperature: ${temperature}°C</p>
            <p>Weather: ${description}</p>
        `;
        document.getElementById('weatherResult').innerHTML = weatherResult;

        // Car wash suggestion
        let carWashSuggestion = 'Good day! Enjoy your carwash!';
        let recommendedDay = '';

        // tell whether it's a good day for carwash
        if (description.toLowerCase().includes('rain') || description.toLowerCase().includes('snow')) {
            carWashSuggestion = 'Not today:(';
            
            // If not, find a good day
            for (let i = 1; i < data.days.length; i++) {
                const day = data.days[i];
                if (!day.conditions.toLowerCase().includes('rain') && !day.conditions.toLowerCase().includes('snow')) {
                    recommendedDay = `Recommend date：${day.datetime}`;
                    break;
                }
            }

            if (recommendedDay === '') {
                recommendedDay = 'Sorry, there is no good day for carwash recently.';
            }
        }

        // Show suggestion
        const carWashSuggestionElement = document.createElement('div');
        carWashSuggestionElement.innerHTML = `<p>${carWashSuggestion}</p><p>${recommendedDay}</p>`;
        document.getElementById('weatherResult').appendChild(carWashSuggestionElement);

    } catch (error) {
        document.getElementById('weatherResult').innerHTML = `<p>${error.message}</p>`;
    }
}