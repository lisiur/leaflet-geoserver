const mapInstance = L.map('map').setView([31, 120], 9)
const wmsUrl = 'http://172.20.131.87:3000/geoserver/test/wms'
const wfsUrl = 'http://172.20.131.87:3000/geoserver/test/wfs'
const layer = 'test:chance_point'

L.tileLayer.chinaProvider('TianDiTu.Normal.Map',{maxZoom:18,minZoom:3}).addTo(mapInstance);

const lg = new LG.create({
  map: mapInstance,
  srs: 'EPSG:4326',
  wmsUrl,
  wfsUrl,
})

lg.getBounds({
  layers: layer
}).then(bounds => {
  mapInstance.fitBounds(bounds, {
    padding: [64, 64],
  })
})

lg.getDataByLatLng({
  latLng: {
    lat: 31.229052,
    lng: 121.517899,
  },
  layers: layer,
}).then(data => {
  console.log(data)
})

lg.getDataByLayer({
  layers: layer,
}, {pull: true}).then(data => {
  console.log(data)
})

const sld = LG.generateSLDXml({
  point: [
    {
      filter: 'district == 静安区',
      style: {
        iconUrl: 'https://cdn2.iconfinder.com/data/icons/20-flat-general-pack/512/Location-512.png',
        iconSize: 20,
      },
    },
    {
      filter: 'district != 静安区',
      style: {
        iconUrl: 'https://cdn2.iconfinder.com/data/icons/20-flat-general-pack/512/Cross-512.png',
        iconSize: 20,
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
    layers: layer,
    format: 'image/png',
    transparent: true,
    styles,
  }).addTo(mapInstance)
})()
