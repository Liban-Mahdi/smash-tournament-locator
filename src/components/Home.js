import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";

const libraries = ["places"];

const Home = () => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const [search, setSearch] = useState("");
    const [autocomplete, setAutocomplete] = useState(null);
    const navigate = useNavigate();

    // Handle autocomplete selection
    const onPlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();
            if (place && place.formatted_address) {
                setSearch(place.formatted_address); // Update search value with the full address
                navigate(`/results?city=${encodeURIComponent(place.formatted_address)}`);
            } else {
                alert("Please select a valid location.");
            }
        } else {
            alert("Autocomplete is not loaded yet.");
        }
    };

    const handleSearch = () => {
        if (search.trim() === "") {
            alert("Please enter a location.");
            return;
        }
        // Navigate to the results page with the search query
        navigate(`/results?city=${encodeURIComponent(search)}`);
    };

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <div className="hero">
            <h1>Find Your Smash Bros. Tournament</h1>
            <p>Enter your location or area code to locate nearby Smash Bros. tournaments with ease.</p>
            <div className="search-bar">
                <Autocomplete
                    onLoad={(autocompleteInstance) => setAutocomplete(autocompleteInstance)}
                    onPlaceChanged={onPlaceChanged}
                >
                    <input
                        type="text"
                        placeholder="Enter city or area code..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)} // Update input value
                        style={{
                            width: "300px",
                            padding: "10px",
                            borderRadius: "5px",
                            border: "1px solid #444",
                            backgroundColor: "#1e1e1e",
                            color: "#fff",
                        }}
                    />
                </Autocomplete>
                <button
                    onClick={handleSearch}
                    style={{
                        padding: "10px 20px",
                        marginLeft: "10px",
                        backgroundColor: "#00aaff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Search
                </button>
            </div>
        </div>
    );
};

export default Home;

