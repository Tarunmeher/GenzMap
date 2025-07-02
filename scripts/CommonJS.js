import { global } from './main.js';
import { CONFIG } from '../mapinfo.js';
export class CommonJS{
    constructor(){

    }

    createButton(innerHTML, title, classList){
        const button = document.createElement('button');
        button.className=classList;
        button.title = title;
        button.innerHTML = innerHTML;

        return button;
    }

    bindSearchResult(searchResults,data, searchText){
        data.features.forEach((feature) => {
            const { name, label } = feature.properties;
            const [lng, lat] = feature.geometry.coordinates;
            const item = document.createElement("div");
            item.classList.add("dropdown-item");
            const escapedName = name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&",);
            const escapedSearchText = searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&",);
            let boldedLabel = label.replace(
              new RegExp(`(${escapedName})(,?)`, "gi"),
              (match, p1, p2) => `<b>${p1}</b>${p2}<br>`,
            );
            let finalLabel = boldedLabel.replace(
              new RegExp(
                `(<b[^>]*>)([^<]*?)(${escapedSearchText})([^<]*?)(</b>)`,
                "gi",
              ),
              '$1$2<span style="color: grey;">$3</span>$4$5',
            );
            item.innerHTML = finalLabel;
            item.dataset.lng = lng;
            item.dataset.lat = lat;
            item.dataset.name = name;
            item.dataset.label = label;
            item.onclick = () =>{ this.gotoSearchPlace(item) };
            searchResults.appendChild(item);
            searchResults.style.display = "block";
        });
    }

    gotoSearchPlace(item){
        const lng = parseFloat(item.dataset.lng);
        const lat = parseFloat(item.dataset.lat);
        const title = item.dataset.label;
        document.getElementById('searchInput').value = title;
        global.selectedCoords = { lat, lng }; // Store the selected coordinates
        document.getElementById('genz-search-results').style.display = 'none';
        this.plotMarker(lat, lng);
    }   

    plotMarker(lat, lng) {
        if (global.marker) {
            global.marker.remove();
        }

        global.marker = new maplibregl.Marker()
            .setLngLat([lng, lat])
            .addTo(global.map);

        this.updateMapLocation([lng, lat]);
    }

    debounce(func, delay = 1000) {
        return function (...args) {
          clearTimeout(global.debounceTimer);
          global.debounceTimer = setTimeout(() => func.apply(this, args), delay);
        };
    }

    async reverseGeocode(lat, lng) {
        const reverseGeocodeURL = `${CONFIG.REVERSE_GEOCODE_URL}?api_key=${CONFIG.API_KEY}&point.lon=${lng}&point.lat=${lat}`;
        const response = await fetch(reverseGeocodeURL);
        const data = await response.json();
        if (data.features.length > 0) {
            return data.features[0];
        } else {
            throw new Error('No data found for the given coordinates.');
        }
    }

    escapeSingleQuotesForOnclick(str) {
        return str.replace(/'/g, "\\'");
    }

    getAbortController() {
      if (global.controller) global.controller.abort();
      global.controller = new AbortController();
      return global.controller;
    }

    updateMapLocation(coord){
        // global.map.easeTo({
        //     center: coord,
        //     duration: 2000,
        //     zoom: 14
        // });
        global.map.flyTo({
            center: coord, // Mumbai coordinates
            zoom: 15,
            speed: 0.8, // lower = slower
            curve: 1.5, // curvature factor for smoothness
            easing: function(t) {
              return t;
            }
        });
    }

    createAutoCompleteURL(isToggleOn, selectedCheckbox, searchText, ulat, ulon){
        if (isToggleOn) {
          return `${CONFIG.AUTOCOMPLETE_ADV_URL}?api_key=${CONFIG.API_KEY}&text=${encodeURIComponent(searchText)}&focus.point.lat=${ulat}&focus.point.lon=${ulon}`;
        } else {
          if (!selectedCheckbox) {
            return `${CONFIG.AUTOCOMPLETE_URL}?api_key=${CONFIG.API_KEY}&text=${encodeURIComponent(searchText)}&focus.point.lat=${ulat}&focus.point.lon=${ulon}`;
          } else {
            const type = selectedCheckbox.value;
            return `${CONFIG.AUTOCOMPLETE_URL}?api_key=${CONFIG.API_KEY}&type=${type}&text=${encodeURIComponent(searchText)}&focus.point.lat=${ulat}&focus.point.lon=${ulon}`;
          }
        }        
    }

    searchLongLat(coordSearch, searchResults, long, lat) {
        searchResults.style.display = 'none';

        if (coordSearch) {
            const latitude = parseFloat(lat.value.trim());
            const longitude = parseFloat(long.value.trim());

            if (!isNaN(latitude) && !isNaN(longitude)) {
                this.reverseGeocode(latitude, longitude)
                    .then(feature => {
                        const name = feature.properties.name || 'Custom Location';
                        const title = feature.properties.label || 'Your Custom Marker';
                        if (global.searchMarker) {
                            global.searchMarker.remove();
                        }

                        let popupContent = `
                          <div class="popup-content">
                              <b>${name}</b><br>
                              ${title}<br>
                              Lat: ${longitude}, Lng: ${latitude}<br><br>
                              <button class="popup-button" onclick="handleSearchDirection(${longitude}, ${latitude})">Get Direction</button>
                          </div>`;

                        global.searchMarker = new maplibregl.Marker()
                            .setLngLat([longitude, latitude])
                            .setPopup(new maplibregl.Popup().setHTML(popupContent))
                            .addTo(map);

                        global.searchMarker.getPopup().addTo(map);

                        map.flyTo({
                            center: [longitude, latitude],
                            zoom: 20,
                            pitch: 0
                        });
                    })
                    .catch(error => alert(error.message));
            } else {
                alert('Please enter valid latitude and longitude values.');
            }
        } else {
            const searchText = searchInput.value.trim();
            const digipinRegex = /^[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{4}$/i;

            if (searchText.length >= 3) {

                if (digipinRegex.test(searchText)) {
                    const decodeURL = `${DIGIPIN}/decode?digipin=${encodeURIComponent(searchText)}&api_key=${API_KEY}`;

                    fetch(decodeURL)
                        .then(response => {
                            if (response.ok) {
                                return response.json();
                            } else {
                                throw new Error('DIGIPIN not found');
                            }
                        })
                        .then(data => {
                            removeAllMarkers();
                            addMarker(data.longitude, data.latitude, searchText, 'DIGIPIN Location');
                            map.flyTo({
                                center: [data.longitude, data.latitude],
                                zoom: 12,
                                pitch: 0
                            });
                        })
                        .catch(() => {
                            const searchURL = `${GEO_SEARCH_URL}?api_key=${API_KEY}&text=${encodeURIComponent(searchText)}`;
                            fetch(searchURL)
                                .then(response => response.json())
                                .then(data => {
                                    removeAllMarkers();
                                    data.features.forEach(feature => {
                                        const coords = feature.geometry.coordinates;
                                        const name = feature.properties.name;
                                        const label = feature.properties.label;
                                        addMarker(coords[0], coords[1], name, label);
                                    });
                                    if (data.features.length > 0) {
                                        const firstFeature = data.features[0];
                                        const firstCoords = firstFeature.geometry.coordinates;
                                        map.flyTo({
                                            center: [firstCoords[0], firstCoords[1]],
                                            zoom: 12,
                                            pitch: 0
                                        });
                                    }
                                })
                                .catch(error => console.error('Error fetching data:', error));
                        });

                } else {
                    const searchURL = `${GEO_SEARCH_URL}?api_key=${API_KEY}&text=${encodeURIComponent(searchText)}`;
                    fetch(searchURL)
                        .then(response => response.json())
                        .then(data => {
                            removeAllMarkers();
                            data.features.forEach(feature => {
                                const coords = feature.geometry.coordinates;
                                const name = feature.properties.name;
                                const label = feature.properties.label;
                                addMarker(coords[0], coords[1], name, label);
                            });
                            if (data.features.length > 0) {
                                const firstFeature = data.features[0];
                                const firstCoords = firstFeature.geometry.coordinates;
                                map.flyTo({
                                    center: [firstCoords[0], firstCoords[1]],
                                    zoom: 12,
                                    pitch: 0
                                });
                            }
                        })
                        .catch(error => console.error('Error fetching data:', error));
                }
            } else {
                alert('Please enter a valid search query.');
            }
        }
    }
}