import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { fetchTournaments } from "../utils/smashggAPI"; 
import { geocodeAddress } from "../utils/geocodeAddress"; 
import { calculateDistance } from "../utils/distanceUtils";

function transformTournamentName(rawName) {
  if (!rawName) return "";

  // 1) Remove "#" when it's directly followed by digits (e.g., "#10" -> "10")
  const noPoundBeforeNumbers = rawName.replace(/#(?=\d+)/g, "");

  // 2) Replace one or more spaces with a single hyphen (" ")
  const slugified = noPoundBeforeNumbers.replace(/\s+/g, "-");

  return slugified;
}


const libraries = ["places"];
const mapContainerStyle = { width: "75%", height: "100vh" };
const sidebarStyle = {
  width: "25%",
  height: "calc(100vh - 100px)", // reduce total height by navbar height
  backgroundColor: "#282828",
  color: "#ffffff",
  padding: "20px",
  boxSizing: "border-box",
  overflowY: "auto",
  marginTop: "100px", // push sidebar down by 60px
};

const mapStyles = [
    {
        "elementType": "geometry",
        "stylers": [{ "color": "#242f3e" }]
    },

    {
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#746855" }]
    },

    {
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#242f3e" }]
    },

    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [{ "visibility": "off" }]
    },

    {
        "featureType": "poi",
        "stylers": [{ "visibility": "off" }]
    },

    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{ "color": "#38414e" }]
    },

    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{ "color": "#746855" }]
    },

    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{ "color": "#17263c" }]

    }
];

function ResultsPage() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const city = params.get("city");

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  });

  const [location, setLocation] = useState(null);       // lat/lng for searched city
  const [tournaments, setTournaments] = useState([]);   // all tournaments fetched
  const [loading, setLoading] = useState(false);
  const [sortType, setSortType] = useState("date");     // "date" or "distance"

  // Which tournament is highlighted/selected (to show InfoWindow)
  const [selectedTournament, setSelectedTournament] = useState(null);

  // Keep a reference to the map instance so we can pan/zoom programmatically
  const mapRef = useRef(null);

  // 1) Fetch city geocode + tournaments
  useEffect(() => {
    const fetchData = async () => {
      if (!city) return;
      setLoading(true);

      // Geocode the city
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        city
      )}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;

      try {
        const geoRes = await fetch(geocodeUrl);
        const geoData = await geoRes.json();

        if (geoData.results && geoData.results.length > 0) {
          const { lat, lng } = geoData.results[0].geometry.location;
          setLocation({ lat, lng });

          // Build coords for Start.gg
          const coordinatesString = `${lat},${lng}`;
          const radiusString = "50mi";

          // Fetch tournaments (make sure your query has images + venueAddress)
          let tournamentsData = await fetchTournaments(coordinatesString, radiusString);

          // Geocode each venue, compute distance
          tournamentsData = await Promise.all(
            tournamentsData.map(async (t) => {
              let loc = null;
              if (t.venueAddress) {
                loc = await geocodeAddress(t.venueAddress);
              }
              let dist = null;
              if (loc) {
                dist = calculateDistance(lat, lng, loc.lat, loc.lng);
              }
              return {
                ...t,
                location: loc,  // { lat, lng }
                distance: dist  // numeric distance
              };
            })
          );

          setTournaments(tournamentsData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [city]);

  // 2) Sort tournaments by date or distance
  useEffect(() => {
    if (tournaments.length === 0) return;

    const sorted = [...tournaments].sort((a, b) => {
      if (sortType === "date") {
        return (a.startAt || 0) - (b.startAt || 0);
      } else if (sortType === "distance") {
        if (a.distance == null && b.distance == null) return 0;
        if (a.distance == null) return 1;
        if (b.distance == null) return -1;
        return a.distance - b.distance;
      }
      return 0;
    });

    setTournaments(sorted);
  }, [sortType, tournaments]);

  if (!isLoaded || loading) {
    return <div>Loading...</div>;
  }

  // 3) Change sort type
  const handleSortChange = (e) => {
    setSortType(e.target.value);
  };

  // 4) Clicking a tournament in the left sidebar
  const handleTournamentClick = (t) => {
    setSelectedTournament(t);
    // Pan/zoom to that marker
    if (t.location && mapRef.current) {
      mapRef.current.panTo(t.location);
      mapRef.current.setZoom(14);
    }
  };

  // 5) Clicking a marker on the map
  const handleMarkerClick = (t) => {
    setSelectedTournament(t);
    if (t.location && mapRef.current) {
      mapRef.current.panTo(t.location);
      mapRef.current.setZoom(14);
    }
  };

  // Render either a single marker for selectedTournament or all markers
  const renderMarkers = () => {
    if (selectedTournament) {
      // Only one highlighted marker
      if (!selectedTournament.location) return null;
      const slugName = transformTournamentName(selectedTournament.name);

      return (
        <Marker
        
          position={selectedTournament.location}
          title={selectedTournament.name}
          onClick={() => handleMarkerClick(selectedTournament)}
        >
          {/* InfoWindow for the single marker */}
          <InfoWindow onCloseClick={() => setSelectedTournament(null)}>
            <div style={{ color: "black" }}>
              <h3>{selectedTournament.name}</h3>
              <p>{selectedTournament.venueAddress}</p>
              <a
                href={`https://start.gg/tournament/${slugName}`}
                target="_blank"
                rel="noreferrer"
              >
                View Tournament
              </a>
            </div>
          </InfoWindow>
        </Marker>
      );
    } else {
      // Show markers for all tournaments
      return tournaments.map((t) =>
        t.location ? (
          <Marker
            key={t.id}
            position={t.location}
            title={t.name}
            onClick={() => handleMarkerClick(t)}
          />
        ) : null
      );
    }
  };

  return (
    <div style={{ display: "flex", overflowY: "hidden",cursor: "url('alt.cur') 16 16, pointer"}}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Sort By: </label>
          <select value={sortType} onChange={handleSortChange}>
            <option value="date">Date</option>
            <option value="distance">Distance</option>
          </select>
        </div>

        <ul style={{ listStyle: "none", padding: 0, }}>
  {tournaments.length > 0 ? (
    tournaments.map((t, idx) => {
      const dateString = t.startAt
        ? new Date(t.startAt * 1000).toLocaleDateString()
        : "TBD";

      // Show the first image if it exists
      const firstImage = t.images?.[0]?.url;

      return (
        <React.Fragment key={t.id}>
          <li
            onClick={() => handleTournamentClick(t)}
            className="clickable"  // now using the CSS class for custom cursor
            style={{
              display: "flex",
              alignItems: "center"
            }}
          >
            {/* Re-add tournament image on the left side */}
            {firstImage ? (
              <img
                src={firstImage}
                alt={t.name}
                style={{
                  width: 40,
                  height: 40,
                  marginRight: 8,
                  objectFit: "cover",
                  borderRadius: "4px"
                }}
              />
            ) : (
              <div
                style={{
                  width: 40,
                  height: 40,
                  marginRight: 8,
                  backgroundColor: "#555",
                  borderRadius: "4px"
                }}
              />
            )}

            <div>
              <strong>{t.name}</strong>
              <p style={{ margin: "4px 0" }}>Date: {dateString}</p>
              {/* Address and distance are removed here to reduce clutter */}
            </div>
          </li>

          {/* Separator line */}
          {idx < tournaments.length - 1 && (
            <hr
              style={{
                borderColor: "#444",
                margin: "8px 0",
                borderTop: "1px solid #444"
              }}
            />
          )}
        </React.Fragment>
      );
    })
  ) : (
    <p>No tournaments found in this area.</p>
  )}
</ul>

      </div>

      {/* Google Map */}
      {location && (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={location}
          zoom={12}
          options={{
            styles: mapStyles,
            disableDefaultUI: false,
            clickableIcons: false,
            draggableCursor: "url('normal.cur') 16 16, pointer",
            draggingCursor: "url('alt.cur') 16 16, pointer"
            
          }}
          onLoad={(map) => (mapRef.current = map)} // capture the map instance
        >
          {renderMarkers()}
        </GoogleMap>
      )}
    </div>
  );
}

export default ResultsPage;
