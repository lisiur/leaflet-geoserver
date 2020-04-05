import L from 'leaflet'
import { generateSLDXml, Options, GeneralStyle } from './sld'
import getFeature, { GetFeatureParams } from './wfsService/getFeature'
import describeFeatureType, { DescribeFeatureTypeParams } from './wfsService/describeFeatureType'
import getCapabilities, { GetCapabilitiesParams } from './wmsService/getCapabilities'
import getFeatureInfo, { GetFeatureInfoParams } from './wmsService/getFeatureInfo'
import getDataByLatLng, { GetDataByLatLngParams } from './service/getDataByLatLng'
import getDataByLayer, { GetDataByLayerParams } from './service/getDataByLayer'
import getBounds, { GetBoundsParams } from './service/getBounds'

interface DefaultConfig {
  srs?: string
  idField?: string | string[]
  geometryField?: string
  wfsUrl?: string
  wmsUrl?: string
  map?: L.Map
}

class LG {
  private config: DefaultConfig

  constructor(config: DefaultConfig) {
    this.config = config
  }

  generateSLDXml(params: GeneralStyle, options?: Options) {
    return generateSLDXml(params, options)
  }

  getFeature(params: GetFeatureParams) {
    return getFeature(Object.assign({
      wfsUrl: this.config.wfsUrl,
    }, params))
  }

  describeFeatureType(params: DescribeFeatureTypeParams) {
    return describeFeatureType(Object.assign({
      wfsUrl: this.config.wfsUrl,
    }, params))
  }

  getFeatureInfo(params: GetFeatureInfoParams) {
    return getFeatureInfo(Object.assign({
      wmsUrl: this.config.wmsUrl,
      srs: this.config.srs,
      map: this.config.map,
    }, params))
  }

  getCapabilities(params: GetCapabilitiesParams) {
    return getCapabilities(Object.assign({
      wmsUrl: this.config.wmsUrl,
    }, params))
  }

  getDataByLatLng(params: GetDataByLatLngParams) {
    return getDataByLatLng(Object.assign({
      wmsUrl: this.config.wmsUrl,
      idField: this.config.idField,
      geometryField: this.config.geometryField,
      srs: this.config.srs,
      map: this.config.map,
    }, params))
  }

  getDataByLayer(params: GetDataByLayerParams) {
    return getDataByLayer(Object.assign({
      wfsUrl: this.config.wfsUrl,
      idField: this.config.idField,
      geometryField: this.config.geometryField,
    }, params))
  }

  getBounds(params: GetBoundsParams) {
    return getBounds(Object.assign({
      wfsUrl: this.config.wfsUrl,
    }, params))
  }
}

function create(config: DefaultConfig) {
  return new LG(config)
}

export {
  create,
  generateSLDXml,
  getFeature,
  describeFeatureType,
  getCapabilities,
  getFeatureInfo,
  getDataByLatLng,
  getDataByLayer,
  getBounds,
}

