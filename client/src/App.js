import * as React from 'react';
import { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';

import {listLogEntries} from './Api';
import LogEntryForm from './LogEntryForm';

const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 20.0127399,
    longitude: 64.4523598,
    zoom: 3
  });

  const getEntries = async() => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
    console.log(logEntries);
  }

  useEffect(() => {
    // (async () => {
    //   const logEntries = await listLogEntries();
    //   setLogEntries(logEntries);
    //   console.log(logEntries);
    // }
    // )();
    getEntries();
  }, [])

  console.log('ShowPopup', showPopup);

  const showAddMarkerPopup = (event) => {
    //console.log('Event', event);
    const [longitude, latitude] = event.lngLat;
    setAddEntryLocation({
      latitude, longitude
    })
  }

  return (
    <ReactMapGL
      {...viewport}
      mapStyle = "mapbox://styles/piyushkuhad/ckcsx6t2c295t1jlemghnknwu"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      onDblClick = {showAddMarkerPopup}
    >
      {
        logEntries.map((entry) => (
            <React.Fragment key={entry._id}>
              <Marker 
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
                    xmlns="http://www.w3.org/2000/svg" 
                    className="cm-marker" 
                    style = {{
                      width: `${6 * viewport.zoom}`,
                      height: `${6 * viewport.zoom}`
                    }}
                    viewBox="0 0 512 512"
                  >
                      <g><path d="m407.579 87.677c-31.073-53.624-86.265-86.385-147.64-87.637-2.62-.054-5.257-.054-7.878 0-61.374 1.252-116.566 34.013-147.64 87.637-31.762 54.812-32.631 120.652-2.325 176.123l126.963 232.387c.057.103.114.206.173.308 5.586 9.709 15.593 15.505 26.77 15.505 11.176 0 21.183-5.797 26.768-15.505.059-.102.116-.205.173-.308l126.963-232.387c30.304-55.471 29.435-121.311-2.327-176.123zm-151.579 144.323c-39.701 0-72-32.299-72-72s32.299-72 72-72 72 32.299 72 72-32.298 72-72 72z"/></g>
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
                      {
                        entry.image ? 
                        <div className="cm-img-holder">
                          <img src={entry.image} alt={entry.title} />
                        </div>
                        : null
                      }
                    </div>
                </Popup>
                )
                : null
              }
            </React.Fragment>
          )
        )
      }
      {
        addEntryLocation ? (
          <>
            <Marker
              latitude={addEntryLocation.latitude} 
              longitude={addEntryLocation.longitude} 
              // offsetLeft={-12} offsetTop={-24}
            >
              <div>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="cm-add-marker" 
                  style = {{
                    width: `${6 * viewport.zoom}`,
                    height: `${6 * viewport.zoom}`
                  }}
                  viewBox="0 0 512 512"
                >
                    <g><path d="m407.579 87.677c-31.073-53.624-86.265-86.385-147.64-87.637-2.62-.054-5.257-.054-7.878 0-61.374 1.252-116.566 34.013-147.64 87.637-31.762 54.812-32.631 120.652-2.325 176.123l126.963 232.387c.057.103.114.206.173.308 5.586 9.709 15.593 15.505 26.77 15.505 11.176 0 21.183-5.797 26.768-15.505.059-.102.116-.205.173-.308l126.963-232.387c30.304-55.471 29.435-121.311-2.327-176.123zm-151.579 144.323c-39.701 0-72-32.299-72-72s32.299-72 72-72 72 32.299 72 72-32.298 72-72 72z"/></g>
                </svg>
              </div>
            </Marker>
            <Popup
              latitude={addEntryLocation.latitude} 
              longitude={addEntryLocation.longitude} 
              closeButton={true}
              closeOnClick={false}
              onClose={() =>  setAddEntryLocation(null)}
              dynamicPosition = {true}
              anchor="top" >
              <div className="cm-popup cm-form-popup">
                <h3>Add your new Log Entry</h3>
                <LogEntryForm 
                  onClose = {() => {
                      setAddEntryLocation(null);
                      getEntries();
                    }
                  }
                  location = {addEntryLocation} 
                />
              </div>
            </Popup>
          </>
        )
        : null
      }
    </ReactMapGL>
  );
}

export default App;