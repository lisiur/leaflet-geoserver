import L from 'leaflet'
import xml2json from 'xml-js/lib/xml2json.js'

interface GetCapabilitiesParams {
  wmsUrl: string
  namespace?: string
  rootLayer?: boolean
}

export default async function getCapabilities(params: GetCapabilitiesParams) {
  const queryParams = {
    service: 'WMS',
    version: '1.1.1',
    request: 'GetCapabilities',
    namespace: params.namespace,
    rootLayer: params.rootLayer,
  }
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value === void 0) {
      delete queryParams[key as keyof typeof queryParams]
    }
  })
  const url = params.wmsUrl + L.Util.getParamString(queryParams)
  const xml = await (await fetch(url)).text()
  return xml2json(xml, { compact: true })
}