const CountryDetails = ({ country, weather }) => {
    return (
      <div>
        <h2>{country.name.common}</h2>
        <p>Capital: {country.capital[0]}</p>
        <p>Area: {country.area}</p>
        <p>Population: {country.population}</p>
        Languages: {
                <ul>
                {Object.entries(country.languages).map(([key, language]) => (
                  <li key={key}>{language}</li>
                ))}
              </ul>
            }
        <img src={country.flags.svg} alt={`Flag of ${country.name.common}`} width="250" />
        {weather && (
          <>
            <h2>Weather in {country.capital[0]}</h2>
            <p>Temperature: {weather.main.temp} Celsius</p>
            <img
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />
            <p>Wind: {weather.wind.speed} m/s</p>
          </>
        )}
      </div>
    );
  };

export default CountryDetails;