const mapInstance = L.map('map').setView([31, 120], 8)
const wmsUrl = 'http://127.0.0.1:18080/geoserver/test/wms'

L.tileLayer.chinaProvider('TianDiTu.Normal.Map',{maxZoom:18,minZoom:3}).addTo(mapInstance);

LG.getFeatureInfo({
  wmsUrl: 'http://172.20.131.87:3000/geoserver/test/wms',
  map: mapInstance,
  latLng: {
    lat: 31.252435,
    lng: 121.396169,
  },
  layers: 'test:t_competitor_fast',
})

LG.getCapabilities({
  wmsUrl: 'http://172.20.131.87:3000/geoserver/test/wms',
}).then(data => {
  console.log(data)
})

LG.getFeature({
  wfsUrl: 'http://172.20.131.87:3000/geoserver/test/wfs',
  layers: 'test:t_competitor_fast',
})

const sld = LG.generateSLDXml({
  point: [
    {
      filter: 'space>=68 && id==1068 && name==梅岭北路1259号 ',
      style: {
        iconUrl: 'https://cdn2.iconfinder.com/data/icons/20-flat-general-pack/512/Location-512.png',
        iconSize: 16,
      },
    },
    {
      filter: 'space<68',
      style: {
        iconUrl: 'https://cdn2.iconfinder.com/data/icons/20-flat-general-pack/512/Cross-512.png',
        iconSize: 12,
      },
    },
  ]
}, { encoding: 'GBK' })

;(async function() {
  const res = await fetch('http://172.20.131.87:3000/createStyle', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sld,
      encoding: 'gbk',
    })
  })
  const styles = await res.text()

  L.tileLayer.wms(wmsUrl, {
    layers: 'test:t_competitor_fast',
    format: 'image/png',
    transparent: true,
    styles,
  }).addTo(mapInstance)
})()
