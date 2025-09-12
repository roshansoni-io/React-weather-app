import { useState } from "react";

const GEO_API = "https://geocoding-api.open-meteo.com/v1/search";

const Searchbar = ({ onLocationSelect, status,place,location }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- Helper for updating status in parent ---
  const handleStatus = (msg) => {
    if (typeof status === "function") {
      status(msg);
    }
    setLoading(true);
  };

  // --- Fetch place suggestions ---
  const fetchSuggestions = async (q) => {
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      handleStatus("Searching...");
      const res = await fetch(`${GEO_API}?name=${q}&count=5`);
      const data = await res.json();
      setSuggestions(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      status("");
    }
  };

  const handleInput = (e) => {
    const val = e.target.value;
    setQuery(val);
    fetchSuggestions(val);
  };

  // --- Handle selecting suggestion ---
  const selectSuggestion = (s) => {
    onLocationSelect({
      label: `${s.name}${s.admin1 ? ', ' + s.admin1 : ''}, ${s.country}`,
      name: s.name,
      state: s.admin1 || null,
      region: s.admin2 || null,
      subregion: s.admin3 || null,
      country: s.country,
      countryCode: s.country_code,
      latitude: s.latitude,
      longitude: s.longitude,
      population: s.population || null,
      timezone: s.timezone || null,
      id: s.id
    });
  
    setQuery("");
    setSuggestions([]);
  };

  // --- Handle current location ---
  const handleGeo = ({place}) => {
    if (!navigator.geolocation) {
      //alert("Geolocation not supported.");
      return;
    }
    handleStatus("Getting your location...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        
        
        
        
        const city = place?.road??"Your location";
        const loc = {
          name: `${city} (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`,
          latitude,
          longitude,
        };
        onLocationSelect(loc);
        setLoading(false);
      },
      (err) => {
        alert("Location error: " + err.message);
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 60000 }
    );
  };

  return (
    <header className="app-header">
      <div id="search-f" className="inp-sugg">
        <input
          type="text"
          id="search-input"
          value={query}
          onChange={handleInput}
          placeholder="Search for city..."
        />
        {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((s, i) => (
            <li className="suggest" key={i} onClick={() => selectSuggestion(s)}>
              <div className="primary">
                <strong>{s.name}</strong>
                {s.admin1 ? `, ${s.admin1}` : ''}, {s.country}
              </div>
              <div className="secondary">
                {s.population ? `Population: ${s.population.toLocaleString()}` : ''}
                {s.timezone ? ` • ${s.timezone}` : ''}
              </div>
            </li>
          ))}
        </ul>
        )}
        <button id="geo-btn" class="btn outline" title="Use my location" onClick={handleGeo}>📍 current</button>
      </div>
        {loading && <span className="loader">loading location...</span>}
    </header>
  );
};

export default Searchbar;