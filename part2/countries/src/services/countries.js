import axios from 'axios';
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/';
const baseWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather?';
const apiKey = import.meta.env.VITE_KEY

const getAll = () => {
    const request = axios.get(`${baseUrl}/api/all`)
    return request.then(response => response.data)
}

const getWeather = (capital) => {
    const request = axios.get(`${baseWeatherUrl}q=${capital}&appid=${apiKey}`)
    return request.then(response => response.data)
}

export default { getAll, getWeather }