// geocodeAddress.js
export async function geocodeAddress(address) {
    if (!address) return null;
  
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.status === "OK" && data.results.length > 0) {
        return data.results[0].geometry.location; // { lat, lng }
      } else {
        console.warn("No geocode results for address:", address);
        return null;
      }
    } catch (error) {
      console.error("Error geocoding address:", error);
      return null;
    }
  }
  