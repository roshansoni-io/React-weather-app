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
  const [, setStatus] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("lastLocation");
    if (saved) {
      setLocation(JSON.parse(saved));
    }
  }, []);

  const handleLocationSelect = (loc) => {
    setLocation(loc);
    localStorage.setItem("lastLocation", JSON.stringify(loc));
    setStatus("");
  };

  const { meta, now, daily, hourly, place } = useWeather(location);

  return (
    <div className="min-h-screen pb-12">
      <Searchbar onLocationSelect={handleLocationSelect} status={setStatus} />
      
      <main className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content Area: Left/Top */}
        <div className="lg:col-span-8 space-y-8">
          <NowCard now={now} daily={daily} />
          <HourlyCard hourly={hourly} />
        </div>

        {/* Sidebar: Right/Bottom */}
        <div className="lg:col-span-4 space-y-8">
          <LocationInfo location={location} meta={meta} place={place} />
          <DailyCard daily={daily} />
        </div>

      </main>
      
      <Footer />
    </div>
  );
}

export default App;