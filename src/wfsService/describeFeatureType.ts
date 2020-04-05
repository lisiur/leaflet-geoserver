import L from 'leaflet'

export interface DescribeFeatureTypeParams {
  wfsUrl: string
  layers: string
}

export default async function describeFeatureType(params: DescribeFeatureTypeParams): Promise<{
  featureTypes: Array<{
    typeName: string
    properties: Array<{
      name: string
      localType: string
    }>
  }>
}> {
  const queryParams = {
    service: 'wfs',
    version: '2.0.0',
    request: 'DescribeFeatureType',
    outputFormat: 'application/json',
    typeNames: params.layers,
  }
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value === void 0) {
      delete queryParams[key as keyof typeof queryParams]
    }
  })
  const wfsUrl = params.wfsUrl
  if (!wfsUrl) {
    throw new Error(`wfsUrl is empty`)
  }
  const url = wfsUrl + L.Util.getParamString(queryParams)
  return (await fetch(url)).json()
}