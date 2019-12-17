mapboxgl.accessToken =
  "pk.eyJ1IjoiYXphdmVhIiwiYSI6IkFmMFBYUUUifQ.eYn6znWt8NzYOa3OrWop8A";

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function removeLayerAndSource(map, layer) {
  map.getLayer(layer) && map.removeLayer(layer);
  map.getSource(layer) && map.removeSource(layer);
}

function removeLayer(map, layer) {
  map.getLayer(layer) && map.removeLayer(layer);
}

function removeSource(map, layer) {
  map.getSource(layer) && map.removeSource(layer);
}

function toggleSatellite() {
  satellite = !satellite;
  if (satellite) {
    mapRegular.setLayoutProperty("mapbox-satellite", "visibility", "visible");
    mapAlt.setLayoutProperty("mapbox-satellite", "visibility", "visible");
    if (!selectedCountryCode) {
      mapRegular.setPaintProperty("world-sum-fill", "fill-opacity", 0);
      isAlt && mapAlt.setPaintProperty("world-sum-fill-alt", "fill-opacity", 0);
    }
  } else {
    mapRegular.setLayoutProperty("mapbox-satellite", "visibility", "none");
    mapAlt.setLayoutProperty("mapbox-satellite", "visibility", "none");
    if (selectedCountryCode) {
      mapRegular.setPaintProperty("raster-tiles", "raster-opacity", 1);
      isAlt && mapAlt.setPaintProperty("raster-tiles-alt", "raster-opacity", 1);
    } else {
      mapRegular.setPaintProperty("world-sum-fill", "fill-opacity", 1);
      isAlt && mapAlt.setPaintProperty("world-sum-fill-alt", "fill-opacity", 1);
    }
  }
}

// prettier-ignore
var fillOpacity = ["interpolate", ["exponential", 1.1], ["zoom"], 0, 0.9, 14, 0.1, 20, 0.05];
// prettier-ignore
var lineWidth = ["interpolate", ["linear"], ["zoom"], 14, 1, 17, 2, 18, 2, 23, 8];
var count = 0;
var steps = [0.25, 0.5, 0.75];
var colorsOne = ["#eff3ff", "#bdd7e7", "#6baed6", "#2171b5"];
var mapAnimationDuration = 2000;
var selectedCountryCode;
var satellite = false;
var isAlt = false;
var raster = true;
var roads = true;

// prettier-ignore
var colorOne = ["step", ["get", "pct_served"], colorsOne[0], steps[0], colorsOne[1], steps[1], colorsOne[2], steps[2], colorsOne[3]];

var trialCodes = ["NPL", "MWI", "MMR"];

function clearMap() {
  removeLayer(mapAlt, "road-vector-alt-case");
  removeLayer(mapAlt, "road-vector-alt-line");
  removeSource(mapAlt, "road-vector-alt");
  removeLayer(mapRegular, "road-vector-case");
  removeLayer(mapRegular, "road-vector-line");
  removeSource(mapRegular, "road-vector");
  removeLayerAndSource(mapAlt, "raster-tiles-alt");
  removeLayerAndSource(mapRegular, "raster-tiles");
}

function returnToPrimary(changePosition) {
  selectedCountryCode = undefined;
  $body.classList.remove("trial");
  $body.classList.remove("detail");
  $roadsButton.checked = true;
  roads = true;
  $rasterButton.checked = true;
  raster = true;
  clearMap();

  if (changePosition) {
    mapRegular.easeTo({
      zoom: mapOrigin.zoom,
      center: mapOrigin.center,
      pitch: mapOrigin.pitch,
      bearing: mapOrigin.bearing,
      duration: 0
    });
  }

  $primary.style.display = "block";
  $detail.style.display = "none";

  mapRegular.setPaintProperty(
    "world-sum-fill",
    "fill-opacity",
    satellite ? 0 : 1
  );
  mapAlt.setPaintProperty(
    "world-sum-fill-alt",
    "fill-opacity",
    satellite ? 0 : 1
  );
}

var mapOrigin = {
  zoom: 0,
  pitch: 0,
  bearing: 0,
  center: [0, 0]
};

var mapAlt = new mapboxgl.Map({
  container: "before",
  style: "mapbox://styles/azavea/ck368701v0m7g1cqg0rk0rprk",
  zoom: mapOrigin.zoom,
  center: mapOrigin.center,
  pitch: mapOrigin.pitch,
  bearing: mapOrigin.bearing,
  minZoom: 0,
  maxZoom: 18,
  maxBounds: [-180, -59.3, 180, 84.9]
});

var mapRegular = new mapboxgl.Map({
  container: "after",
  style: "mapbox://styles/azavea/ck368701v0m7g1cqg0rk0rprk",
  zoom: mapOrigin.zoom,
  center: mapOrigin.center,
  pitch: mapOrigin.pitch,
  bearing: mapOrigin.bearing,
  minZoom: 0,
  maxZoom: 18,
  maxBounds: [-180, -59.3, 180, 84.9]
});

var nav = new mapboxgl.NavigationControl({
  showCompass: false,
  showZoom: true
});

mapRegular.addControl(nav, "top-right");

compare = new mapboxgl.Compare(mapRegular, mapAlt, "#map-container", {
  mousemove: true,
  orientation: "vertical"
});

var popup;

var $body = document.getElementById("body");
var $modalBackdrop = document.getElementById("modal-backdrop");
var $primary = document.getElementById("primary");
var $detail = document.getElementById("detail");
var $cityName = document.getElementById("city-name");
var $indicator1 = document.getElementById("indicator-1");
var $indicator2 = document.getElementById("indicator-2");
var $indicator3 = document.getElementById("indicator-3");
var $indicator4 = document.getElementById("indicator-4");
var $indicator5 = document.getElementById("indicator-5");
var $indicator1alt = document.getElementById("indicator-1alt");
var $indicator2alt = document.getElementById("indicator-2alt");
var $indicator3alt = document.getElementById("indicator-3alt");
var $indicator4alt = document.getElementById("indicator-4alt");
var $indicator5alt = document.getElementById("indicator-5alt");
var $rasterButton = document.getElementById("raster");
var $roadsButton = document.getElementById("roads");
var $buttons = document.querySelectorAll(".location input");

$rasterButton.addEventListener("click", function(e) {
  if (raster) {
    raster = false;
    $rasterButton.checked = raster;
    mapRegular.setPaintProperty("raster-tiles", "raster-opacity", 0);
    isAlt && mapAlt.setPaintProperty("raster-tiles-alt", "raster-opacity", 0);
  } else {
    raster = true;
    $rasterButton.checked = raster;
    mapRegular.setPaintProperty("raster-tiles", "raster-opacity", 1);
    isAlt && mapAlt.setPaintProperty("raster-tiles-alt", "raster-opacity", 1);
  }
});

$roadsButton.addEventListener("click", function(e) {
  if (roads) {
    roads = false;
    $roadsButton.checked = roads;
    mapRegular.setPaintProperty("road-vector-line", "line-opacity", 0);
    mapRegular.setPaintProperty("road-vector-case", "line-opacity", 0);
    isAlt && mapAlt.setPaintProperty("road-vector-alt-line", "line-opacity", 0);
    isAlt && mapAlt.setPaintProperty("road-vector-alt-case", "line-opacity", 0);
  } else {
    roads = true;
    $roadsButton.checked = roads;
    mapRegular.setPaintProperty("road-vector-line", "line-opacity", 1);
    mapRegular.setPaintProperty("road-vector-case", "line-opacity", 1);
    isAlt && mapAlt.setPaintProperty("road-vector-alt-line", "line-opacity", 1);
    isAlt && mapAlt.setPaintProperty("road-vector-alt-case", "line-opacity", 1);
  }
});

document.onkeydown = function(e) {
  if (e.key === "Escape") {
    if ($body.classList.contains("modal-open")) hideModal();
    if (mapRegular.getLayer("raster-tiles")) returnToPrimary(true);
  }
};

function showModal() {
  $body.className += " modal-open";
}

function hideModal() {
  $body.classList.remove("modal-open");
}

var popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false
});

function raiDecimalToPct(decimal) {
  return Math.floor(decimal * 100) + "%";
}

var hoveredCountryCode;

function updatePopup(event) {
  var countryCode = event.features[0].properties.code;
  var name = event.features[0].properties.name;
  var indicator = raiDecimalToPct(event.features[0].properties.pct_served);

  if (countryCode !== selectedCountryCode && countryCode !== "ESH") {
    if (countryCode !== hoveredCountryCode) {
      hoveredCountryCode = countryCode;
      popup.setHTML(
        "<h1>RAI score</h1>" +
          "<h2>" +
          name +
          "</h2>" +
          "<h3>" +
          indicator +
          "</h3>"
      );
    }
    popup.setLngLat(event.lngLat).addTo(mapRegular);
    mapRegular.getCanvas().style.cursor = "pointer";
  } else {
    popup.remove();
  }
}

function removePopup() {
  popup.remove();
  mapRegular.getCanvas().style.cursor = "";
}

mapRegular.on("mousemove", "world-sum-fill", updatePopup);
mapRegular.on("mouseleave", "world-sum-fill", removePopup);

mapRegular.on("load", function() {
  mapRegular.addSource("world-summary", {
    type: "vector",
    tiles: [
      "https://un-sdg.s3.amazonaws.com/tiles/cardno-world-summary/{z}/{x}/{y}.pbf"
    ],
    minzoom: 0,
    maxzoom: 2
  });

  mapAlt.addSource("world-summary-alt", {
    type: "vector",
    tiles: [
      "https://un-sdg.s3.amazonaws.com/tiles/cardno-world-summary/{z}/{x}/{y}.pbf"
    ],
    minzoom: 0,
    maxzoom: 2
  });

  var toggleColor = document.getElementById("toggle-color");

  mapRegular.addLayer(
    {
      id: "world-sum-fill",
      type: "fill",
      source: "world-summary",
      "source-layer": "data",
      paint: {
        "fill-color": colorOne,
        "fill-opacity": 1
      }
    },
    "admin-3-4-boundaries-bg"
  );

  mapAlt.addLayer(
    {
      id: "world-sum-fill-alt",
      type: "fill",
      source: "world-summary-alt",
      "source-layer": "data",
      paint: {
        "fill-color": colorOne,
        "fill-opacity": 1
      }
    },
    "admin-3-4-boundaries-bg"
  );

  function activateLayer(
    countryCode,
    countryName,
    indicatorsRegular,
    indicatorsAlt
  ) {
    if (indicatorsAlt) {
      isAlt = true;
    } else {
      isAlt = false;
    }
    $primary.style.display = "none";
    $detail.style.display = "block";
    $body.classList.add("detail");
    $cityName.innerHTML = countryName;
    $indicator1.innerHTML = raiDecimalToPct(indicatorsRegular.pct_served);
    $indicator2.innerHTML = numberWithCommas(Math.floor(indicatorsRegular.pop));
    $indicator3.innerHTML = numberWithCommas(
      Math.floor(indicatorsRegular.pop_rural)
    );
    $indicator4.innerHTML = numberWithCommas(
      Math.floor(indicatorsRegular.pop_served)
    );
    $indicator5.innerHTML = numberWithCommas(
      Math.floor(indicatorsRegular.roads_included_km)
    );

    if (isAlt) {
      $indicator1alt.innerHTML = raiDecimalToPct(indicatorsAlt.pct_served);
      $indicator2alt.innerHTML = numberWithCommas(
        Math.floor(indicatorsAlt.pop)
      );
      $indicator3alt.innerHTML = numberWithCommas(
        Math.floor(indicatorsAlt.pop_rural)
      );
      $indicator4alt.innerHTML = numberWithCommas(
        Math.floor(indicatorsAlt.pop_served)
      );
      $indicator5alt.innerHTML = numberWithCommas(
        Math.floor(indicatorsAlt.roads_included_km)
      );
    }

    selectedCountryCode = countryCode;

    mapRegular.fitBounds(countryToBboxIndex[countryCode], {
      padding: { top: 10, bottom: 10, left: 10, right: 10 },
      linear: true,
      duration: mapAnimationDuration
    });

    setTimeout(function() {
      if (selectedCountryCode) {
        mapRegular.setPaintProperty("world-sum-fill", "fill-opacity", 0);
        mapAlt.setPaintProperty("world-sum-fill-alt", "fill-opacity", 0);
      }
    }, mapAnimationDuration);

    popup.remove();

    mapRegular.addLayer(
      {
        id: "raster-tiles",
        type: "raster",
        paint: {
          "raster-opacity": raster ? 1 : 0
        },
        source: {
          tileSize: 256,
          type: "raster",
          bounds: countryToBboxIndex[countryCode],
          tiles: [
            "https://un-sdg.s3.amazonaws.com/tiles/cardno/" +
              countryCode +
              "/forgotten-pop-global/{z}/{x}/{y}.png"
          ]
        }
      },
      "world-sum-fill"
    );

    mapRegular.addSource("road-vector", {
      maxzoom: 10,
      type: "vector",
      bounds: countryToBboxIndex[countryCode],
      tiles: [
        "https://un-sdg.s3.amazonaws.com/tiles/cardno/" +
          countryCode +
          "/roads/{z}/{x}/{y}.mvt"
      ]
    });

    mapRegular.addLayer(
      {
        id: "road-vector-case",
        type: "line",
        "source-layer": "roads",
        paint: {
          "line-color": "#162128",
          "line-opacity": roads ? 1 : 0,
          "line-width": ["case", ["==", ["get", "isIncluded"], true], 4, 2]
        },
        source: "road-vector"
      },
      "admin-3-4-boundaries-bg"
    );

    mapRegular.addLayer(
      {
        id: "road-vector-line",
        type: "line",
        "source-layer": "roads",
        paint: {
          "line-color": "#fff",
          "line-opacity": roads ? 1 : 0,
          "line-width": ["case", ["==", ["get", "isIncluded"], true], 2, 1]
        },
        source: "road-vector"
      },
      "admin-3-4-boundaries-bg"
    );

    if (indicatorsAlt) {
      mapAlt.addSource("road-vector-alt", {
        maxzoom: 10,
        type: "vector",
        bounds: countryToBboxIndex[countryCode],
        tiles: [
          "https://un-sdg.s3.amazonaws.com/tiles/cardno/" +
            countryCode +
            "/country-data-roads/{z}/{x}/{y}.pbf"
        ]
      });

      mapAlt.addLayer(
        {
          id: "road-vector-alt-case",
          type: "line",
          "source-layer": "data",
          paint: {
            "line-color": "#162128",
            "line-opacity": roads ? 1 : 0,
            "line-width": ["case", ["==", ["get", "used"], 1], 4, 1.5]
          },
          source: "road-vector-alt"
        },
        "admin-3-4-boundaries-bg"
      );

      mapAlt.addLayer(
        {
          id: "road-vector-alt-line",
          type: "line",
          "source-layer": "data",
          paint: {
            "line-color": "#fff",
            "line-opacity": roads ? 1 : 0,
            "line-width": ["case", ["==", ["get", "used"], 1], 2, 0.75]
          },
          source: "road-vector-alt"
        },
        "admin-3-4-boundaries-bg"
      );

      mapAlt.addLayer(
        {
          id: "raster-tiles-alt",
          type: "raster",
          paint: {
            "raster-opacity": raster ? 1 : 0
          },
          source: {
            tileSize: 256,
            type: "raster",
            bounds: countryToBboxIndex[countryCode],
            tiles: [
              "https://un-sdg.s3.amazonaws.com/tiles/cardno/" +
                countryCode +
                "/country-data/{z}/{x}/{y}.png"
            ]
          }
        },
        "world-sum-fill-alt"
      );
    }
  }

  mapRegular.addControl(new mapboxgl.ScaleControl());

  mapRegular.on("click", "world-sum-fill", function(e) {
    var feature = e.features[0];
    if (feature.properties.code !== selectedCountryCode) {
      clearMap();
      if (trialCodes.includes(feature.properties.code)) {
        $body.classList.add("trial");
        var regular = trialRegular[feature.properties.code];
        var alt = trialAlt[feature.properties.code];
        activateLayer(
          regular.code,
          regular.name,
          regular.properties,
          alt.properties
        );
      } else {
        activateLayer(
          feature.properties.code,
          feature.properties.name,
          feature.properties
        );
        $body.classList.remove("trial");
      }
    }
  });
});
