import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import { listLogsEntries } from "./api";
const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 39.9035557,
    longitude: 32.6226838,
    zoom: 3,
  });

  useEffect(() => {
    (async () => {
      const entries = await listLogsEntries();
      setLogEntries(entries);
    })();
  }, []);

  return (
    <ReactMapGL
      mapStyle="mapbox://styles/nuruddin691/ckaehg4kv08q31imh9rww6egw"
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
      onViewportChange={setViewport}
    >
      {logEntries.map((entry) => (
        <Marker
          key={entry._id}
          latitude={entry.latitude}
          longitude={entry.longitude}
        >
          <div>
            <img
              className="marker"
              style={{
                width: `${6 * viewport.zoom}px`,
                height: `${6 * viewport.zoom}px`,
              }}
              src="./marker.png"
              alt="marker"
            />
          </div>
        </Marker>
      ))}
    </ReactMapGL>
  );
};

export default App;
