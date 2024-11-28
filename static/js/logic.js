// Create the map object with a center and zoom level
let myMap = L.map("map", {
    center: [37.7749, -122.4194], // Default to San Francisco
    zoom: 5
  });
  
  // Add a tile layer (background map)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
  }).addTo(myMap);
  
  // Fetch earthquake GeoJSON data
  const earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  d3.json(earthquakeUrl).then(data => {
    // Function to style the markers based on earthquake magnitude and depth
    function markerStyle(feature) {
      return {
        radius: feature.properties.mag * 4, // Scale magnitude
        fillColor: getColor(feature.geometry.coordinates[2]), // Depth-based color
        color: "#000",
        weight: 0.5,
        opacity: 1,
        fillOpacity: 0.8
      };
    }
  
    // Function to determine marker color based on earthquake depth
    function getColor(depth) {
      return depth > 90 ? "#FF4500" :
             depth > 70 ? "#FF8C00" :
             depth > 50 ? "#FFD700" :
             depth > 30 ? "#ADFF2F" :
             depth > 10 ? "#7FFF00" : "#00FF00";
    }
  
    // Add GeoJSON layer to the map
    L.geoJson(data, {
      pointToLayer: (feature, latlng) => {
        return L.circleMarker(latlng);
      },
      style: markerStyle,
      onEachFeature: (feature, layer) => {
        layer.bindPopup(`
          <strong>Location:</strong> ${feature.properties.place}<br>
          <strong>Magnitude:</strong> ${feature.properties.mag}<br>
          <strong>Depth:</strong> ${feature.geometry.coordinates[2]} km
        `);
      }
    }).addTo(myMap);
  
    // Add a legend
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      let div = L.DomUtil.create("div", "info legend");
      let depths = [-10, 10, 30, 50, 70, 90];
      let colors = ["#00FF00", "#7FFF00", "#ADFF2F", "#FFD700", "#FF8C00", "#FF4500"];
  
      div.innerHTML += "<strong>Depth (km)</strong><br>";
      for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
          `<i style="background: ${colors[i]}"></i> ${depths[i]}${depths[i + 1] ? "&ndash;" + depths[i + 1] : "+"}<br>`;
      }
      return div;
    };
    legend.addTo(myMap);
  });