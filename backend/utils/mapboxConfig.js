const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocodingClient = mbxGeocoding({
  accessToken: process.env.MAPBOX_ACCESS_TOKEN,
});

async function geocodeAddress(address) {
  const response = await geocodingClient
    .forwardGeocode({
      query: address,
      limit: 1,
    })
    .send();
  const match = response.body.features[0];
  return {
    latitude: match.center[1],
    longitude: match.center[0],
    placeName: match.place_name,
  };
}

module.exports = geocodeAddress;