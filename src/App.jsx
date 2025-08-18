import { useState, useEffect } from "react";
import Searchbar from "./components/searchbar.jsx";
import LocationInfo from "./components/locInfo.jsx";
import useWeather from "./hooks/useweather.js";
import NowCard from "./components/NowCard.jsx";
import HourlyCard from "./components/hourlyCard.jsx";
import DailyCard from "./components/Dailycard.jsx";
import Footer from "./components/footer.jsx";

function App() {
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState("");

  // 🔹 Load last location from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("lastLocation");
    if (saved) {
      setLocation(JSON.parse(saved));
    }
  }, []);

  // 🔹 When location changes, save it
  const handleLocationSelect = (loc) => {
    setLocation(loc);
    localStorage.setItem("lastLocation", JSON.stringify(loc));
    setStatus(""); // clear status
  };

  const { meta, now, daily, hourly, loading,place} = useWeather(location);

  return (
    <>
      <Searchbar onLocationSelect={handleLocationSelect} status={setStatus} className="app-header"/>
      <div className="container">
        <LocationInfo location={location} meta={meta} place={place} now={now} />
        <NowCard now={now} place={place} meta={meta} daily={daily} />
        <HourlyCard hourly={hourly} />
        <DailyCard daily={daily} />
      </div>
      <Footer />
    </>
  );
}

export default App;