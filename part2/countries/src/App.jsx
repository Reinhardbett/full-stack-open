// An application to view info of different countries
import { useState, useEffect } from 'react';
import countryService from './services/countries';
import CountryDetails from './components/CountryDetails';

function App() {
  const [countries, setCountries] = useState([]);
  const [filteredCountry, setFilteredCountry] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    countryService
      .getAll()
      .then(initialCountries => {
          setCountries(initialCountries)
        });
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  const handleChange = (event) => {
    setFilteredCountry(event.target.value)
  }

  // Filtered results inline
  const filteredCountries =
    // Prevent trigger of "Too many matches" 
    filteredCountry === ''
    ? []
    : countries.filter(country => 
    country.name.common.toLowerCase().includes(filteredCountry.toLowerCase())
  );

  const fetchWeatherData = (capital) => {
    countryService
      .getWeather(capital)
      .then(weatherData => {
        setWeather(weatherData)
      })
      .catch(error => {
        console.error("Failed to fetch weather data:", error);
      });
  };

  const handleSelectedCountry = (country) => {
    setSelectedCountry(country);
    if (country.capital) {
      fetchWeatherData(country.capital);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        find countries {" "}
        <input 
          value={filteredCountry}
          onChange={handleChange}
        />
      </form>
      {filteredCountry === '' && <p>No countries found.</p>}
      {filteredCountry !== '' && filteredCountries.length > 10 && <p>Too many matches, specify another filter</p>}
      {filteredCountry !== '' && filteredCountries.length === 0 && (<p>No countries found.</p>)}
      {filteredCountries.length === 1 && <CountryDetails country={filteredCountries[0]} weather={weather} />}
      {filteredCountries.length > 1 && filteredCountries.length <= 10 &&
        <ul>
          {filteredCountries.map(country => (
            <li key={country.cca3}>
              {country.name.common}{" "}
              <button onClick={() => handleSelectedCountry(country)}>Show</button>
            </li>
          ))}
        </ul>
      }
      {selectedCountry && filteredCountries.length > 1 && (
        <CountryDetails country={selectedCountry} weather={weather} />
      )}
    </>
  )
}

export default App
