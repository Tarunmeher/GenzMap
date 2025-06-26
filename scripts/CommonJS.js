import { global } from './main.js';
import { CONFIG } from '../config.js';
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
}