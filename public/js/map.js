
// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
mapboxgl.accessToken = mapToken ;
if(listing.geometry.coordinates.length==0){
    coordinates=[12,24];
}

const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/satellite-streets-v12",
    center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 , // starting zoom
});
console.log(coordinates);
  // Create a default Marker and add it to the map.
  const marker1 = new mapboxgl.Marker({ color:"red"})
  .setLngLat(coordinates)
  .setPopup(
    new  mapboxgl.Popup({offset: 25}).setHTML(`<h4>${listing.location}!</h4><p>Exact location will be providing after booking</p>`))
  .addTo(map);