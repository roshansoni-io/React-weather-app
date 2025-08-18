const LocationInfo = ({ location,meta,place}) => {
  if (!location) {
    return (
      <section className="panel location">
        <h2>—</h2>
        <p>Lat —, Lon —</p>
        <p>Elevation — m</p>
        <p>Model: auto</p>
        <p>Updated: {new Date().toLocaleString()}</p>
      </section>
    );
  }

  return (
    <section className="panel location">
      <h2>{location.name}</h2>
      <h4 className="location">{place?.name??"location"}
      </h4>
      <p>Lat {location.latitude.toFixed(2)}, Lon {location.longitude.toFixed(2)}</p>
      <p>Elevation {meta?.elevation ?? " — "} m</p>
      
      <p>Model: auto</p>
      <p>Updated: {new Date().toLocaleString()}</p>
    </section>
  );
};

export default LocationInfo;