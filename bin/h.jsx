const WMO = {
  0: ["Clear", "☀️"],
  1: ["Mainly clear", "🌤️"],
  2: ["Partly cloudy", "⛅"],
  3: ["Overcast", "☁️"],
  45: ["Fog", "🌫️"],
  61: ["Rain", "🌧️"],
  71: ["Snow", "🌨️"],
  95: ["Thunderstorm", "⛈️"],
};

const HourlyCard = ({ hourly }) => {
  if (!hourly) {
    return (
      <section className="panel hourly">
        <h2>Next 24 hours</h2>
        <p>Loading...</p>
      </section>
    );
  }

  // take only first 24 entries
  const hours = hourly.time.slice(0, 24).map((time, i) => {
    const date = new Date(time);
    const label = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const temp = hourly.temp[i];
    const [desc, icon] = WMO[hourly.code[i]] || ["?", "❓"];
    const precip = hourly.precip[i];

    return { label, temp, desc, icon, precip };
  });

  return (
    <section className="panel hourly">
      <h2>Next 24 hours</h2>
      <div className="scroll-row">
        {hours.map((h, i) => (
          <div key={i} className="hour-card">
            <div>{h.label}</div>
            <div className="wx-icon">{h.icon}</div>
            <div>{h.temp}°C</div>
            <div className="subtle">{h.precip > 0 ? `${h.precip}mm` : "—"}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HourlyCard;