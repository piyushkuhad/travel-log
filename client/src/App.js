import * as React from 'react';
import { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';

import {listLogEntries} from './Api';

const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 3
  });

  useEffect(() => {
    (async () => {
      const logEntries = await listLogEntries();
      setLogEntries(logEntries);
      console.log(logEntries);
    }
    )();
  }, [])

  console.log('ShowPopup', showPopup);

  const showAddMarkerPopup = (event) => {
    console.log('Event', event);
  }

  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      onDblClick = {showAddMarkerPopup}
    >
      {
        logEntries.map((entry) => (
            <>
              <Marker
                key={entry._id} 
                latitude={entry.latitude} 
                longitude={entry.longitude} 
                // offsetLeft={-12} offsetTop={-24}
              >
                <div
                  onClick = {() => setShowPopup({
                    //...showPopup,
                    [entry._id]: true,
                  })}
                >
                  <svg 
                    className="cm-marker" 
                    style = {{
                      width: `${6 * viewport.zoom}`,
                      height: `${6 * viewport.zoom}`
                    }}
                    viewBox="0 0 24 24" 
                    stroke-width="2" fill="none" stroke-linecap="round" 
                    stroke-linejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
              </Marker>
              {
                showPopup[entry._id] ? ( 
                <Popup
                    latitude={entry.latitude} 
                    longitude={entry.longitude} 
                    closeButton={true}
                    closeOnClick={false}
                    // onClose = {() => setShowPopup({
                    //   ...showPopup,
                    //   [entry._id]: false,
                    // })}
                    onClose={() =>  setShowPopup({})}
                    dynamicPosition = {true}
                    anchor="top" >
                    <div className="cm-popup">
                      <h3>{entry.title}</h3>
                      <p>{entry.comments}</p>
                      <small>Visited on: {new Date(entry.visitDate).toLocaleDateString()}</small>
                    </div>
                </Popup>
                )
                : null
              }
            </>
          )
        )
      }
    </ReactMapGL>
  );
}

export default App;