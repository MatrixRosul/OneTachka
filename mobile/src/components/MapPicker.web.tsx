import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import { T, FONT } from '../theme';
import type { Place } from './AddressField';

// react-native-web renders via react-dom, so a lowercase host tag renders a real DOM node.
const IFrame: any = 'iframe';

function buildHtml(lat: number, lng: number): string {
  return `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<style>html,body,#map{height:100%;margin:0}</style></head>
<body><div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
var map=L.map('map').setView([${lat},${lng}],13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map);
var marker=L.marker([${lat},${lng}],{draggable:true}).addTo(map);
function send(ll){ parent.postMessage(JSON.stringify({type:'onetachka-pick',lat:ll.lat,lng:ll.lng}),'*'); }
map.on('click',function(e){ marker.setLatLng(e.latlng); send(e.latlng); });
marker.on('dragend',function(){ send(marker.getLatLng()); });
</script></body></html>`;
}

async function reverse(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&accept-language=uk&lat=${lat}&lon=${lng}`,
    );
    const d = (await res.json()) as { display_name?: string };
    return d.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  } catch {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
}

export function MapPicker({ value, onPick }: { value: Place; onPick: (p: Place) => void }) {
  // Center captured once per mount/target so picks don't reload the map.
  const initial = useRef({ lat: value.lat, lng: value.lng });
  const html = useMemo(() => buildHtml(initial.current.lat, initial.current.lng), []);
  const [hint, setHint] = useState('Тапніть на карті або перетягніть маркер');

  useEffect(() => {
    const w: any = globalThis;
    function onMsg(e: any) {
      let data: any;
      try {
        data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      if (!data || data.type !== 'onetachka-pick') return;
      setHint('Шукаємо адресу…');
      reverse(data.lat, data.lng).then((address) => {
        onPick({ address, lat: data.lat, lng: data.lng });
        setHint(address);
      });
    }
    w.addEventListener?.('message', onMsg);
    return () => w.removeEventListener?.('message', onMsg);
  }, [onPick]);

  return (
    <View style={{ marginBottom: 12 }}>
      <View style={{ borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: T.border }}>
        <IFrame srcDoc={html} style={{ border: 0, width: '100%', height: 260, display: 'block' }} />
      </View>
      <Text style={{ fontFamily: FONT.m, fontSize: 12, color: T.txt3, marginTop: 6 }} numberOfLines={2}>
        {hint}
      </Text>
    </View>
  );
}
