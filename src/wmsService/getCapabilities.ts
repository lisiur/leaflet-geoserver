import L from 'leaflet'

export interface GetCapabilitiesParams {
  wmsUrl: string
  layers?: string
  namespace?: string
  rootLayer?: boolean
}

export default async function getCapabilities(params?: GetCapabilitiesParams) {
  const queryParams = {
    service: 'WMS',
    version: '1.1.1',
    request: 'GetCapabilities',
    layers: params?.layers,
    namespace: params?.namespace,
    rootLayer: params?.rootLayer,
  }
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value === void 0) {
      delete queryParams[key as keyof typeof queryParams]
    }
  })
  const wmsUrl = params?.wmsUrl
  if (!wmsUrl) {
    throw new Error(`wmsUrl is empty`)
  }
  const url = wmsUrl + L.Util.getParamString(queryParams)
  const xml = await (await fetch(url)).text()
  return xml
}