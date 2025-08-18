export default function HourlyCard({ hourly }) {
  if (!hourly) return null; // nothing to render yet

  return (
    <div className="card">
      <h2>Hourly Forecast</h2>
      <div className="hourly-list">
        {hourly.time.map((t, i) => (
          <div key={i} className="hour">
            <p>{new Date(t).getHours()}:00</p>
            <p>🌡 {hourly.temp[i]}°C</p>
            <p>☁ {hourly.clouds[i]}%</p>
            <p>💧 {hourly.precip[i]} mm</p>
            <p>Code: {hourly.code[i]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}