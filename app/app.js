import { MAP_CONFIG } from './config/mapConfig.js';
export class App{
    constructor(){

    }

	addGroupLayers(map){
		if (MAP_CONFIG.GROUP_LAYERS.length > 0) {
			MAP_CONFIG.GROUP_LAYERS.forEach(function(element, index) {
				if (element.type == "GroupLayer") {
					fetch( MAP_CONFIG.GEOSERVER_URL + "rest/workspaces/" + MAP_CONFIG.WORKSPACE + "/layergroups/" + element.layer + ".json")
						.then((response) => response.json()) // Convert response to JSON
						.then((data) => {
                            for (let i = 0; i < data.layerGroup.publishables.published.length; i++) {
                                // console.log(data.layerGroup.publishables.published[i]);
                                let layername = data.layerGroup.publishables.published[i].name.split(":")[1];
                                let url = `${MAP_CONFIG.GEOSERVER_URL}/${MAP_CONFIG.WORKSPACE}/wms?service=WMS&version=1.1.1&
                                        request=GetMap&layers=${data.layerGroup.publishables.published[i].name}&styles=&
                                        bbox=72.8103103637695,19.0328044891357,77.4725494384766,23.2976531982422&width=256&height=256&
                                        srs=EPSG:4326&format=image/png&transparent=true`;
                                console.log(url)
                                map.addSource(`${layername}_source`, {
                                    type: 'raster',
                                    tiles: [url],
                                    tileSize: 256
                                });
                                map.addLayer({
                                    id: `${data.layerGroup.publishables.published[i].name}`,
                                    type: 'raster',
                                    source: `${layername}_source`
                                });
                            }
						}) // Handle data
						.catch((error) => console.error("Error:", error)); // Handle errors
				}
			});
		}
	}

    updateMeasurements(Draw) {
      setTimeout(()=>{
        const data = Draw.getAll();
        if (data.features.length > 0) {
          data.features.forEach(feature => {
            if (feature.geometry.type === 'Polygon') {
              const area = turf.area(feature);
              alert(`Area: ${(area / 1000000).toFixed(2)} km²`);
            }
            if (feature.geometry.type === 'LineString') {
              const length = turf.length(feature, { units: 'kilometers' });
              alert(`Length: ${length.toFixed(2)} km`);
            }
          });
        }
      },200);
    }
}
