
import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, ActivityIndicator, Platform } from "react-native";
import { WebView } from "react-native-webview";

interface AgroMonitoringMapProps {
    latitude: number;
    longitude: number;
    apiKey: string;
    polyId?: string;
    onPointsChange?: (points: [number, number][], areaHa: number) => void;
    readOnly?: boolean;
}

export default function AgroMonitoringMap({
    latitude,
    longitude,
    apiKey,
    polyId,
    onPointsChange,
    readOnly = false,
}: AgroMonitoringMapProps) {
    const [loading, setLoading] = useState(true);
    const webViewRef = useRef<WebView>(null);
    const iframeRef = useRef<any>(null);

    useEffect(() => {
        const js = `
      if (typeof map !== 'undefined') {
        map.setView([${latitude}, ${longitude}], 15);
      }
    `;
        Platform.OS === "web"
            ? iframeRef.current?.contentWindow?.eval(js)
            : webViewRef.current?.injectJavaScript(js);
    }, [latitude, longitude]);

    const leafletHtml = `
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script src="https://unpkg.com/@turf/turf@6/turf.min.js"></script>
  <style>
    html, body, #map { height:100%; margin:0; background:#1a1a1a; touch-action: none; }
  </style>
</head>
<body>
<div id="map"></div>
<script>
  const map = L.map('map', { zoomControl: false }).setView([${latitude}, ${longitude}], 15);

  L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  ).addTo(map);

  L.marker([${latitude}, ${longitude}]).addTo(map);

  let points = [];
  let polygonLayer = null;

  function calculateAreaHa(coords) {
    if (coords.length < 3) return 0;
    // Map points to [lng, lat] for turf
    const turfCoords = coords.map(p => [p[1], p[0]]);
    const turfPoly = turf.polygon([[...turfCoords, turfCoords[0]]]);
    const area = turf.area(turfPoly);
    return area / 10000; // m² → ha
  }

  if (!${readOnly}) {
    map.on('click', (e) => {
      const point = [e.latlng.lat, e.latlng.lng];
      points.push(point);

      L.circle(point, { radius: 2, color: '#fff', fillOpacity: 1 }).addTo(map);

      if (polygonLayer) map.removeLayer(polygonLayer);

      if (points.length >= 3) {
        const areaHa = calculateAreaHa(points);
        polygonLayer = L.polygon(points, {
          color: areaHa < 1 ? '#ff5252' : '#2E7D32',
          fillOpacity: 0.3,
        }).addTo(map);

        const msg = JSON.stringify({
          type: 'POINTS_UPDATE',
          points: points,
          areaHa: areaHa
        });

        window.ReactNativeWebView
          ? window.ReactNativeWebView.postMessage(msg)
          : window.parent.postMessage(msg, '*');
      } else if (points.length > 1) {
          polygonLayer = L.polyline(points, { color: '#2E7D32' }).addTo(map);
      }
    });
  }

  window.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'CLEAR') {
        points = [];
        if (polygonLayer) map.removeLayer(polygonLayer);
        map.eachLayer((layer) => {
            if (layer instanceof L.Circle) map.removeLayer(layer);
        });
      }
    } catch {}
  });

  // Re-enable zoom control at better position
  L.control.zoom({ position: 'bottomright' }).addTo(map);
</script>
</body>
</html>
`;

    useEffect(() => {
        const handler = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === "POINTS_UPDATE" && onPointsChange) {
                    onPointsChange(data.points, data.areaHa);
                }
            } catch { }
        };

        if (Platform.OS === "web") {
            window.addEventListener("message", handler);
            return () => window.removeEventListener("message", handler);
        }
    }, [onPointsChange]);

    if (Platform.OS === "web") {
        return (
            <View style={styles.container}>
                <iframe
                    ref={iframeRef}
                    srcDoc={leafletHtml}
                    style={{ width: "100%", height: "100%", border: "none" }}
                    onLoad={() => setLoading(false)}
                />
                {loading && <Loading />}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <WebView
                ref={webViewRef}
                source={{ html: leafletHtml }}
                onLoadEnd={() => setLoading(false)}
                onMessage={(e) => {
                    try {
                        const data = JSON.parse(e.nativeEvent.data);
                        if (data.type === "POINTS_UPDATE" && onPointsChange) {
                            onPointsChange(data.points, data.areaHa);
                        }
                    } catch { }
                }}
            />
            {loading && <Loading />}
        </View>
    );
}

function Loading() {
    return (
        <View style={styles.loading}>
            <ActivityIndicator size="large" color="#2E7D32" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#1a1a1a" },
    loading: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.8)",
    },
});
