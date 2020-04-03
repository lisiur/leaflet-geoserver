import md5 from 'blueimp-md5'
import { SLD } from './typings/SLD'
import js2xml from 'xml-js/lib/js2xml.js'
import { GeneralStyle } from './typings/style'
import { generateOGCDefinition } from './OGCParser'
import { generateXMLTagText } from './utils'

interface Options {
  encoding: string
}


function generateSLDDefinition(params: GeneralStyle, options: Options): SLD.Definition {
  const layerName = md5(JSON.stringify(arguments))
  const pointRules = params.point
  options = Object.assign({
    encoding: 'UTF-8'
  }, options)
  return {
    _declaration: {
      _attributes: {
        version: '1.0',
        encoding: options.encoding,
      }
    },
    StyledLayerDescriptor: {
      _attributes: {
        version: '1.0.0',
        'xsi:schemaLocation': 'http://www.opengis.net/sld StyledLayerDescriptor.xsd',
        xmlns: 'http://www.opengis.net/sld',
        'xmlns:ogc': 'http://www.opengis.net/ogc',
        'xmlns:xlink': 'http://www.w3.org/1999/xlink',
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      },
      NamedLayer: {
        Name: generateXMLTagText(layerName),
        UserStyle: {
          Name: generateXMLTagText(layerName),
          FeatureTypeStyle: {
            Name: generateXMLTagText(layerName),
            Rule: pointRules.map(rule => {
              let format = rule.style.iconFormat
              if (!format) {
                const slices = rule.style.iconUrl.split('.')
                format = `image/${slices[slices.length - 1]}`
              }
              return {
                Filter: generateOGCDefinition(rule.filter),
                PointSymbolizer: {
                  Graphic: {
                    ExternalGraphic: {
                      OnlineResource: {
                        _attributes: {
                          'xlink:type': 'simple',
                          'xlink:href': rule.style.iconUrl,
                        }
                      },
                      Format: generateXMLTagText(format, false),
                    },
                    Opacity: generateXMLTagText(rule.style.opacity),
                    Size: generateXMLTagText(rule.style.iconSize),
                  }
                }
              }
            })
          },
        },
      }
    },
  }
}

export function generateSLDXml(style: GeneralStyle, options?: Options): string {
  const definition = generateSLDDefinition(style, options)
  return js2xml(definition, {
    compact: true,
    spaces: '  ',
    elementNameFn(name: string) {
      if ([
        'Filter',
        'And',
        'Or',
        'Not',
        'PropertyName',
        'Literal',
        'Function',
        'PropertyIsLike',
        'PropertyIsLessThan',
        'PropertyIsEqualTo',
        'PropertyIsNotEqualTo',
        'PropertyIsBetween',
        'PropertyIsGreaterThan',
        'PropertyIsLessThanOrEqualTo',
        'PropertyIsGreaterThanOrEqualTo',
      ].includes(name)) {
        return `ogc:${name}`
      } else {
        return `${name}`
      }
    }
  })
}
