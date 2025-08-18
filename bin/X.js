// ====== Config ======
const GEO_API = "https://geocoding-api.open-meteo.com/v1/search";
const WX_API = "https://api.open-meteo.com/v1/forecast";
const search = document.getElementById("search-input");
const suggestions = document.getElementById("suggestions");

// Default: Delhi, India
const DEFAULT_LOCATION = { name: "Delhi, India", latitude: 28.63, longitude: 77.25 };
let units = {
  temperature_unit: "celsius",
  wind_speed_unit: "kmh",
  precipitation_unit: "mm",
};
let lastQuery = null;
let debounceTimer = null;

// ====== Helpers ======
const $ = (sel) => document.querySelector(sel);
const el = (tag, cls) => { const e = document.createElement(tag); if (cls) e.className = cls; return e; };

function degToCompass(deg){
  const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  return dirs[Math.round(deg/22.5)%16] || "—";
}

const WMO = {
  0: ["Clear", "☀️", "🌙"],
  1: ["Mainly clear", "🌤️", "🌙"],
  2: ["Partly cloudy", "⛅", "🌙☁️"],
  3: ["Overcast", "☁️", "☁️"],
  
  45: ["Fog", "🌫️", "🌫️"],
  48: ["Depositing rime fog", "🌫️", "🌫️"],
  
  51: ["Drizzle: light", "🌦️", "🌧️"],
  53: ["Drizzle: moderate", "🌦️", "🌧️"],
  55: ["Drizzle: dense", "🌧️", "🌧️"],
  
  56: ["Freezing drizzle: light", "🌧️", "🌧️"],
  57: ["Freezing drizzle: dense", "🌧️", "🌧️"],
  
  61: ["Rain: slight", "🌧️", "🌧️"],
  63: ["Rain: moderate", "🌧️", "🌧️"],
  65: ["Rain: heavy", "🌧️", "🌧️"],
  
  66: ["Freezing rain: light", "🌧️", "🌧️"],
  67: ["Freezing rain: heavy", "🌧️", "🌧️"],
  
  71: ["Snow fall: slight", "🌨️", "🌨️"],
  73: ["Snow fall: moderate", "🌨️", "🌨️"],
  75: ["Snow fall: heavy", "❄️", "❄️"],
  
  77: ["Snow grains", "❄️", "❄️"],
  
  80: ["Rain showers: slight", "🌦️", "🌧️"],
  81: ["Rain showers: moderate", "🌦️", "🌧️"],
  82: ["Rain showers: violent", "⛈️", "⛈️"],
  
  85: ["Snow showers: slight", "🌨️", "🌨️"],
  86: ["Snow showers: heavy", "❄️", "❄️"],
  
  95: ["Thunderstorm: slight/mod.", "⛈️", "⛈️"],
  96: ["Thunderstorm with slight hail", "⛈️", "⛈️"],
  99: ["Thunderstorm with heavy hail", "⛈️", "⛈️"]
};

function fmtTemp(v){ return v==null ? "—" : `${Math.round(v)}°`; }
function fmtPct(v){ return v==null ? "—" : `${Math.round(v)}%`; }
function fmtWind(spd, dir){
  const d = dir==null ? "—" : `${degToCompass(dir)} ${Math.round(dir)}°`;
  const u = units.wind_speed_unit === "mph" ? "mph" : units.wind_speed_unit;
  return `${spd==null ? "—" : Math.round(spd)} ${u} • ${d}`;
}
function fmtPress(p){ return p==null ? "—" : `${Math.round(p)} hPa`; }
function fmtMm(v){ return v==null ? "—" : `${v.toFixed(1)} ${units.precipitation_unit}`; }


/*
function wxCodeToIcon(code){
  const pair = WMO[code] || ["Unknown","❓"];
  return { desc: pair[0], icon: pair[1] };
}

*/
// Extract day/night, sunrise, sunset
function updateDayNight(data) {
  const isDay = data.current.is_day; // 1 = Day, 0 = Night
  let sunrise = data.daily.sunrise[0];
  let sunset = data.daily.sunset[0];
  
  //document.getElementById("dayNight").textContent = isDay ? "☀️ Daytime" : "🌙 Nighttime";
  sunrise = sunrise.split("T")[1]
  sunset = sunset.split("T")[1]

  document.getElementById("sunrise").textContent = "Sunrise: " + sunrise;
  document.getElementById("sunset").textContent = "Sunset: " + sunset;

  // Optional: Change background automatically
  document.body.style.background = isDay
    ? "linear-gradient(to top, #87CEFA, #ffffff)"   // Day sky
    
    : "linear-gradient(to top, #0d1b2a, #1b263b)"; // Night sky
    console.log(sunrise,sunset)
  return isDay;
  
}


let isDay = null;

function wxCodeToIcon(code, isDay = false) {
  const pair = WMO[code] || ["Unknown", "❓", "❓"];
  return {
    desc: pair[0],
    icon: isDay ? pair[2] : pair[1]
  };
}




function setStatus(msg){ $("#status").textContent = msg || ""; }

// ====== Build API URL ======
function buildForecastURL({ latitude, longitude }){
  const p = new URLSearchParams({
    latitude, longitude,
    timezone: "auto",
    current: [
      "temperature_2m","relative_humidity_2m","apparent_temperature","is_day",
      "precipitation","rain","weather_code","surface_pressure","wind_speed_10m","wind_direction_10m","cloud_cover"
    ].join(","),
    hourly: [
      "temperature_2m","relative_humidity_2m","apparent_temperature",
      "precipitation_probability","precipitation","rain","showers",
      "weather_code","cloud_cover","wind_speed_10m","wind_direction_10m",
      "surface_pressure","temperature_80m","soil_temperature_0cm","soil_moisture_0_to_1cm"
    ].join(","),
    daily: [
      "weather_code","temperature_2m_min","temperature_2m_max","precipitation_hours","sunrise","sunset"
    ].join(","),
    minutely_15: ["temperature_2m","apparent_temperature","precipitation"].join(","),
    forecast_days: 7,
    ...units
  });
  return `${WX_API}?${p.toString()}`;
}

// ====== Rendering Functions ======
function renderLocation(meta, queryName){
  $("#place-name").textContent = queryName || meta.timezone || "—";
  $("#coords").textContent = `Lat ${meta.latitude.toFixed(2)}, Lon ${meta.longitude.toFixed(2)}`;
  if (typeof meta.elevation === "number") $("#elevation").textContent = `Elevation ${Math.round(meta.elevation)} m`;
  $("#model").textContent = `Model: ${meta.model ?? "auto"}`;
  $("#updated").textContent = `Updated: ${new Date().toLocaleString()}`;
}
let currTime = new Date()

function renderCurrent(cur){
  const code = cur.weather_code;
  const { desc, icon } = wxCodeToIcon(code);
  $("#now-icon").textContent = icon;
  $("#now-temp").textContent = fmtTemp(cur.temperature_2m);
  $("#now-desc").textContent = desc + (cur.is_day ? " • Day" : " • Night");
  $("#now-feels").textContent = fmtTemp(cur.apparent_temperature);
  $("#now-humidity").textContent = fmtPct(cur.relative_humidity_2m);
  $("#now-wind").textContent = fmtWind(cur.wind_speed_10m, cur.wind_direction_10m);
  $("#now-pressure").textContent = fmtPress(cur.surface_pressure);
  $("#now-clouds").textContent = cur.cloud_cover != null ? `${Math.round(cur.cloud_cover)}%` : "—";
  const precip = (cur.rain ?? 0) || (cur.precipitation ?? 0);
  $("#now-precip").textContent = fmtMm(precip);
}

function renderHourly(meta, hourly){
  const wrap = $("#hourly-scroll");
  wrap.innerHTML = "";
  if (!hourly?.time) return;
  const tz = meta.timezone;
  //const count = Math.max(hourly.time.length, 24);
  let now = currTime.getHours()
  const count = now+24
  
  for (let i=now-1; i<count; i++){
    const t = new Date(hourly.time[i]);
    const temp = hourly.temperature_2m?.[i];
    const pop = hourly.precipitation_probability?.[i];
    const code = hourly.weather_code?.[i];
    const clouds = hourly.cloud_cover?.[i];
    const wind = hourly.wind_speed_10m?.[i];
    const { icon } = wxCodeToIcon(code);
    const card = el("div","card");
    const h = el("div","t"); h.textContent = t.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit", timeZone: tz });
    const s = el("div","s"); s.textContent = `${fmtTemp(temp)}`;
    
    
    const iEl = el("div","i");
  //  iEl.textContent = `${icon} • Cloud ${clouds ?? "—"}% • Wind ${Math.round(wind ?? 0)} ${units.wind_speed_unit}`;
    iEl.textContent = `${icon} `;

    card.append(h,iEl,s);
    wrap.append(card);
  }
}

function renderMinutely(meta, min15){
  const wrap = $("#minutely-scroll");
  wrap.innerHTML = "";
  if (!min15?.time) { wrap.textContent = "No near-term data."; return; }
  const tz = meta.timezone;
  const count = Math.min(min15.time.length, 8);
  for (let i=0;i<count;i++){
    const t = new Date(min15.time[i]);
    const temp = min15.temperature_2m?.[i];
    const pr = min15.precipitation?.[i];
    const card = el("div","card");
    const h = el("div","t"); h.textContent = t.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit", timeZone: tz });
    const s = el("div","s"); s.textContent = ` Precip ${fmtMm(pr)} •  ${fmtTemp(temp)}`;
    card.append(h,s);
    wrap.append(card);
  }
}

function renderDaily(meta, daily){
  const grid = $("#daily-grid");
  grid.innerHTML = "";
  if (!daily?.time) return;
  const tz = meta.timezone;
  const count = Math.min(daily.time.length, 7);
  for (let i=0;i<count;i++){
    const d = new Date(daily.time[i]);
    const code = daily.weather_code?.[i];
    const tmax = daily.temperature_2m_max?.[i];
    const tmin = daily.temperature_2m_min?.[i];
    const ph = daily.precipitation_hours?.[i];
    const { desc, icon } = wxCodeToIcon(code);
    const day = el("div","day");
    const name = el("div","name");
    name.textContent = d.toLocaleDateString([], { weekday:"short", month:"short", day:"numeric", timeZone: tz });
    const ico = el("div","wx-icon"); ico.textContent = icon;
    const hi = el("div","hi"); hi.textContent = fmtTemp(tmax);
    const lo = el("div","lo"); lo.textContent = fmtTemp(tmin);
    const badge = el("div","badge"); badge.textContent = `${ph ?? 0}h precip`;
    const sub = el("div","s"); sub.textContent = desc;
    //day.append(name, ico, hi, lo, badge, sub);
    day.append(name, ico, hi, lo);

    grid.append(day);
  }
}

// ====== Data Fetch ======
async function fetchForecast(location, label){
  const url = buildForecastURL(location);
  setStatus("Loading weather…");
  try{
    const res = await fetch(url);
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    setStatus("");
    renderLocation(data, label);
    renderCurrent(data.current);
    updateDayNight(data);
    
    renderHourly(data, data.hourly);
    renderMinutely(data, data.minutely_15);
    renderDaily(data, data.daily);
  }catch(err){
    console.error(err);
    setStatus("Failed to load weather. " + err.message);
  }
}
console.log(isDay)


// ====== Geocoding ======
async function geocode(q) {
  if (!q.trim()) return [];
  
  const u = new URL(GEO_API);
  u.searchParams.set("name", q);
  u.searchParams.set("count", "8"); // Increased for better options
  u.searchParams.set("language", "en");
  u.searchParams.set("format", "json");
  
  const res = await fetch(u.toString());
  if (!res.ok) throw new Error(`Geo HTTP ${res.status}`);
  
  const json = await res.json();
  if (!json.results || !json.results.length) return [];
  
  return json.results.map(r => ({
    name: `${r.name}${r.admin1 ? ", " + r.admin1 : ""}${r.country ? ", " + r.country : ""}`,
    latitude: r.latitude,
    longitude: r.longitude,
    country: r.country,
    admin1: r.admin1,
    population: r.population
  }));
}

// ====== Search Input ======
search.addEventListener("input", async (e) => {
  const query = e.target.value.trim();
  
  // suggestion
  if (query.length < 3) {
    suggestions.innerHTML = "";
    suggestions.style.display = "none";
    return;
  }

  // Clear existing debounce timer
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  // Debounce the search to avoid too many API calls
  debounceTimer = setTimeout(async () => {
    try {
      setStatus("Searching locations…");
      const results = await geocode(query);
      
      if (results.length === 0) {
        suggestions.innerHTML = "<li class='no-results'>No locations found</li>";
      } else {
        suggestions.innerHTML = results
          .map(r => `
            <li class="suggest" 
                data-lat="${r.latitude}" 
                data-lon="${r.longitude}"
                data-name="${r.name}">
              <div class="suggest-main">${r.name}</div>
              <div class="suggest-details">
                ${r.population ? `Pop: ${r.population.toLocaleString()} • ` : ""}
                ${r.latitude.toFixed(2)}, ${r.longitude.toFixed(2)}
              </div>
            </li>
          `)
          .join("");
      }
      
      suggestions.style.display = "block";
      setStatus("");
      
    } catch (err) {
      console.error(err);
      suggestions.innerHTML = "<li class='error'>Search failed. Try again.</li>";
      suggestions.style.display = "block";
      setStatus("Search error: " + err.message);
    }
  }, 300); // 300ms delay
});

// ====== Suggestion Click 
suggestions.addEventListener("click", async (e) => {
  const suggestion = e.target.closest('.suggest');
  if (!suggestion) return;
  
  const lat = parseFloat(suggestion.dataset.lat);
  const lon = parseFloat(suggestion.dataset.lon);
  const name = suggestion.dataset.name;
  
  if (isNaN(lat) || isNaN(lon)) return;
  
  // Update search input
  search.value = name;
  
  // Hide suggestions
  suggestions.innerHTML = "";
  suggestions.style.display = "none";
  
  // Create location object
  const location = { name, latitude: lat, longitude: lon };
  
  // Update lastQuery and localStorage
  lastQuery = location;
  localStorage.setItem("lastQuery", JSON.stringify({ loc: location, units }));
  
  // Fetch weather for selected location
  await fetchForecast({ latitude: lat, longitude: lon }, name);
  
  console.log("Selected location:", location);
});

// ====== Hide Suggestions on Outside Click ======
document.addEventListener("click", (e) => {
  if (!search.contains(e.target) && !suggestions.contains(e.target)) {
    suggestions.style.display = "none";
  }
});

// ====== Keyboard Navigation for Suggestions ======
let selectedSuggestionIndex = -1;

search.addEventListener("keydown", (e) => {
  const suggestionItems = suggestions.querySelectorAll('.suggest');
  
  if (suggestionItems.length === 0) return;
  
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      selectedSuggestionIndex = Math.min(selectedSuggestionIndex + 1, suggestionItems.length - 1);
      updateSuggestionHighlight(suggestionItems);
      break;
      
    case 'ArrowUp':
      e.preventDefault();
      selectedSuggestionIndex = Math.max(selectedSuggestionIndex - 1, -1);
      updateSuggestionHighlight(suggestionItems);
      break;
      
    case 'Enter':
      e.preventDefault();
      if (selectedSuggestionIndex >= 0 && suggestionItems[selectedSuggestionIndex]) {
        suggestionItems[selectedSuggestionIndex].click();
      }
      break;
      
    case 'Escape':
      suggestions.style.display = "none";
      selectedSuggestionIndex = -1;
      search.blur();
      break;
  }
});

function updateSuggestionHighlight(items) {
  items.forEach((item, index) => {
    item.classList.toggle('selected', index === selectedSuggestionIndex);
  });
}

// ====== Original Event Handlers ======
$("#search-form").addEventListener("submit", async (e)=>{
  e.preventDefault();
  const q = search.value.trim();
  if(!q) return;
  
  try{
    setStatus("Searching location…");
    const results = await geocode(q);
    
    if (results.length === 0) {
      setStatus("Location not found. Try a different search.");
      return;
    }
    
    // Use first result
    const loc = results[0];
    lastQuery = loc;
    localStorage.setItem("lastQuery", JSON.stringify({ loc, units }));
    await fetchForecast({ latitude: loc.latitude, longitude: loc.longitude }, loc.name);
    setStatus("");
    search.blur();
    suggestions.style.display = "none";
  }catch(err){
    setStatus("Search failed: " + err.message);
  }
});

$("#geo-btn").addEventListener("click", ()=>{
  if(!navigator.geolocation){
    setStatus("Geolocation not supported.");
    return;
  }
  setStatus("Getting your location…");
  navigator.geolocation.getCurrentPosition(async (pos)=>{
    const { latitude, longitude } = pos.coords;
    const label = `Your location (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`;
    
    lastQuery = { name: label, latitude, longitude };
    localStorage.setItem("lastQuery", JSON.stringify({ loc: lastQuery, units }));
    await fetchForecast({ latitude, longitude }, label);
  }, (err)=>{
    setStatus("Location error: " + err.message);
  }, { enableHighAccuracy:true, timeout:10000, maximumAge:60000 });
});

$("#units-btn").addEventListener("click", async ()=>{
  const isMetric = units.temperature_unit === "celsius";
  units = isMetric
    ? { temperature_unit:"fahrenheit", wind_speed_unit:"mph", precipitation_unit:"inch" }
    : { temperature_unit:"celsius", wind_speed_unit:"kmh", precipitation_unit:"mm" };
  setStatus(`Units set to ${isMetric ? "Imperial" : "Metric"} — refreshing…`);
  const saved = JSON.parse(localStorage.getItem("lastQuery") || "null");
  let loc = lastQuery || saved?.loc || DEFAULT_LOCATION;
  localStorage.setItem("lastQuery", JSON.stringify({ loc, units }));
  await fetchForecast({ latitude: loc.latitude, longitude: loc.longitude }, loc.name);
});

// ====== Initialization ======
(async function init(){
  try{
    const saved = JSON.parse(localStorage.getItem("lastQuery") || "null");
    if(saved?.units) units = saved.units;
    const loc = saved?.loc || DEFAULT_LOCATION;
    lastQuery = loc;
    search.placeholder = "Search city (e.g., Delhi, Mumbai, Berlin)";
    await fetchForecast({ latitude: loc.latitude, longitude: loc.longitude }, loc.name);
  }catch(e){
    console.error(e);
    await fetchForecast(DEFAULT_LOCATION, DEFAULT_LOCATION.name);
  }
})();
const end = performance.now()
console.log(end)