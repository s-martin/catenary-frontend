import {
    dark_mode_store,
    data_stack_store,
    on_sidebar_trigger_store,
    realtime_vehicle_locations_last_updated_store,
    realtime_vehicle_locations_store,
    realtime_vehicle_route_cache_hash_store,
    realtime_vehicle_route_cache_store,
    lock_on_gps_store,
    usunits_store,
    show_zombie_buses_store,
    show_my_location_store,
    custom_icons_category_to_layer_id,
    map_pointer_store
} from '../../globalstores';

import { writable, get } from 'svelte/store';

export function makeContextLayerDataset(map: mapboxgl.Map) {
    let darkMode = get(dark_mode_store);

    const urlParams =
		typeof window !== 'undefined'
			? new URLSearchParams(window.location.search)
			: new URLSearchParams();

    map.addSource("walking_shape_context", {
        type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: []
                }
    });

    map.addSource("stops_context", {
        type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: []
                }
    });

    map.addSource("transit_shape_context", {
        type: 'geojson',
                data: {
                    "type": "FeatureCollection",
                    "features": [
                     
                    ]
                  }
    });

    map.addLayer({
        id: "contextlinebacking",
        type: 'line',
        source: 'transit_shape_context',
        paint: {
            'line-color': darkMode ? '#111133' : "#ffffff",
            'line-width': ['interpolate', ['linear'], ['zoom'], 7, 6, 14, 9],
            'line-emissive-strength': 1,
            // 'line-opacity': ['interpolate', ['linear'], ['zoom'], 7, 0.2, 10, 0.4]
        },
        minzoom: 3
    });

    map.addLayer({
        id: "contextline",
        type: 'line',
        source: 'transit_shape_context',
        paint: {
            'line-color': ['get', 'color'],
            'line-width': ['interpolate', ['linear'], ['zoom'], 7, 3.5, 14, 6],
            //'line-opacity': ['step', ['zoom'], 0.7, 7, 0.8, 8, 0.9]
            'line-emissive-strength': 1,
            // 'line-opacity': ['interpolate', ['linear'], ['zoom'], 7, 0.2, 10, 0.4]
        },
        minzoom: 3
    });


    map.addLayer({
        id: "contextlinelabel",
        type: 'symbol',
        source: 'transit_shape_context',
        layout: {
            'symbol-placement': 'line',
            //'text-field': ['coalesce', ['get', 'route_label']],
            'text-field': ['get', 'route_label'],
            //'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
            'text-font': ['literal', ['Open Sans Regular', 'Arial Unicode MS Regular']],
            'text-size': ['interpolate', ['linear'], ['zoom'], 5, 9, 9, 10, 11, 12, 13, 15],
            'text-ignore-placement': false,
            'text-allow-overlap': false,
            "text-pitch-alignment": "viewport",
            'symbol-spacing':
                window?.innerWidth > 750
                    ? ['step', ['zoom'], 200, 12, 100, 13, 100, 15, 120, 20, 150]
                    : ['step', ['zoom'], 200, 12, 80, 13, 100, 15, 100, 20, 150],
            visibility: 'none'
        },
        paint: {
            'text-color': ['get', 'text_color'],
            'text-halo-color': ['get', 'color'],
            'text-halo-width': 2,
            'text-halo-blur': 0,
            'line-emissive-strength': 1
        },
        minzoom: 3
    });
    

}