import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { listLogsEntries } from "./api";
import { MarkerIcon } from "./MarkerIcon";
const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [addEntryLocation, setAddEntryLocation] = useState({});
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

  const showAddMarkerPopup = (event) => {
    const [longitude, latitude] = event.lngLat;

    // disable any other popup.
    setShowPopup({});

    // set new marker on new location
    setAddEntryLocation({
      latitude,
      longitude,
    });
  };

  return (
    <ReactMapGL
      mapStyle="mapbox://styles/nuruddin691/ckaehg4kv08q31imh9rww6egw"
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
      onViewportChange={setViewport}
      onDblClick={showAddMarkerPopup}
      doubleClickZoom={false}
    >
      {logEntries.map((entry) => (
        <div key={entry._id}>
          <Marker latitude={entry.latitude} longitude={entry.longitude}>
            <div
              onClick={() => {
                setShowPopup({
                  [entry._id]: true,
                });
                setAddEntryLocation({});
              }}
            >
              <MarkerIcon
                style={{
                  width: `${6 * viewport.zoom}px`,
                  height: `${6 * viewport.zoom}px`,
                }}
              />
            </div>
          </Marker>
          {showPopup[entry._id] && (
            <Popup
              latitude={entry.latitude}
              longitude={entry.longitude}
              closeButton={true}
              closeOnClick={false}
              dynamicPosition={true}
              onClose={() => setShowPopup({})}
              anchor="top"
            >
              <h3>{entry.title}</h3>
              <p>{entry.comments}</p>
              <small>
                Visited on: {new Date(entry.visitDate).toLocaleDateString()}
              </small>
            </Popup>
          )}
        </div>
      ))}
      {addEntryLocation.hasOwnProperty("latitude") &&
      addEntryLocation.hasOwnProperty("latitude") ? (
        <>
          <Marker
            latitude={addEntryLocation.latitude}
            longitude={addEntryLocation.longitude}
          >
            <div>
              <MarkerIcon
                isNew="true"
                style={{
                  width: `${6 * viewport.zoom}px`,
                  height: `${6 * viewport.zoom}px`,
                }}
              />
            </div>
          </Marker>
          <Popup
            latitude={addEntryLocation.latitude}
            longitude={addEntryLocation.longitude}
            closeButton={true}
            closeOnClick={false}
            dynamicPosition={true}
            onClose={() => setAddEntryLocation({})}
            anchor="top"
          >
            <div className="popup">
              <h3>Add your new log entry here!</h3>
            </div>
          </Popup>
        </>
      ) : null}
    </ReactMapGL>
  );
};

export default App;
