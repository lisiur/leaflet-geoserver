interface XML_TAG {
  _attributes?: {
    [k: string]: string
  }
  _text?: string
  [k: string]: XML_TAG | Array<XML_TAG> | string | OGC.Filter
}

declare namespace OGC {
  interface PropertyName extends XML_TAG { }
  interface Literal extends XML_TAG { }
  interface PropertyNameAndLiteral {
    'ogc:PropertyName': PropertyName
    'ogc:Literal': Literal
  }
  interface And extends Filter { }
  interface Or extends Filter { }
  interface Filter {
    'ogc:And': And
    'ogc:Or': Or
    'ogc:PropertyIsGreaterThanOrEqualTo'?: PropertyNameAndLiteral
    'ogc:PropertyIsLessThanOrEqualTo'?: PropertyNameAndLiteral
    'ogc:PropertyIsEqualTo'?: PropertyNameAndLiteral
    'ogc:PropertyIsLessThan'?: PropertyNameAndLiteral
    'ogc:PropertyIsGreaterThan'?: PropertyNameAndLiteral
  }
}

declare namespace SLD {
  interface CssParameter<T extends string> extends XML_TAG {
    _attributes?: {
      name: T
    }
  }

  interface GraphicFill extends XML_TAG {
    Graphic?: Graphic
  }

  interface Fill extends XML_TAG {
    CssParameter?: CssParameter<'fill' | 'fill-opacity'>[]
    GraphicFill?: GraphicFill
  }

  interface Stroke extends XML_TAG {
    CssParameter?: CssParameter<
      | 'stroke'
      | 'stroke-width'
      | 'stroke-linecap'
      | 'stroke-dasharray'
      | 'stroke-dashoffset'
    >[]
    GraphicStroke?: GraphicStroke
  }

  interface WellKnownName extends XML_TAG {
    _text:
    | 'circle'
    | 'square'
    | 'triangle'
    | 'star'
    | 'cross'
    | 'x'
    | 'shape://vertline'
    | string
  }

  interface Mark extends XML_TAG {
    WellKnownName?: WellKnownName
    Fill?: Fill
    Stroke?: Stroke
  }

  interface Size extends XML_TAG { }

  interface Rotation extends XML_TAG { }

  interface Format extends XML_TAG {
    _text:
    | 'image/png'
    | 'image/jpg'
    | 'image/jpeg'
    | 'image/svg'
    | 'image/gif'
    | 'image/svg+xml'
    | string
  }

  interface OnlineResource extends XML_TAG {
    _attributes?: {
      'xlink:type': 'simple'
      'xlink:href': string
    }
  }

  interface ExternalGraphic extends XML_TAG {
    OnlineResource?: OnlineResource
    Format?: Format
  }

  interface Opacity extends XML_TAG { }

  interface Graphic extends XML_TAG {
    ExternalGraphic?: ExternalGraphic
    Mark?: Mark
    Opacity?: Opacity
    Size?: Size
    Rotation?: Rotation
  }

  interface GraphicStroke extends XML_TAG {
    Graphic?: Graphic
  }

  interface Geometry extends XML_TAG { }

  interface PointSymbolizer extends XML_TAG {
    Geometry?: Geometry
    Graphic: Graphic
  }

  interface PerpendicularOffset extends XML_TAG { }

  interface LineSymbolizer extends XML_TAG {
    Stroke?: Stroke
    PerpendicularOffset?: PerpendicularOffset
  }

  interface Label extends XML_TAG {
    'ogc:PropertyName'?: OGC.PropertyName
  }

  interface Font extends XML_TAG {
    CssParameter?: CssParameter<
      'font-family' | 'font-size' | 'font-style' | 'font-weight'
    >[]
  }

  interface AnchorPointX extends XML_TAG { }
  interface AnchorPointY extends XML_TAG { }
  interface AnchorPoint extends XML_TAG {
    AnchorPointX?: AnchorPointX
    AnchorPointY?: AnchorPointY
  }

  interface DisplacementX extends XML_TAG { }
  interface DisplacementY extends XML_TAG { }
  interface Displacement extends XML_TAG {
    DisplacementX?: DisplacementX
    DisplacementY?: DisplacementY
  }

  interface PointPlacement extends XML_TAG {
    AnchorPoint?: AnchorPoint
    Displacement?: Displacement
    Rotation?: Rotation
  }

  interface LinePlacement extends XML_TAG {
    PerpendicularOffset?: PerpendicularOffset
  }

  interface LabelPlacement extends XML_TAG {
    PointPlacement?: PointPlacement
    LinePlacement?: LinePlacement
  }

  type VendorOption =
    | {
      _attributes: {
        name: 'group'
      }
      _text: 'yes'
    }
    | {
      _attributes: {
        name: 'labelAllGroup'
      }
      _text: 'true'
    }
    | {
      _attributes: {
        name: 'spaceAround'
      }
      _text: number
    }
    | {
      _attributes: {
        name: 'followLine'
      }
      _text: 'true'
    }
    | {
      _attributes: {
        name: 'maxDisplacement'
      }
      _text: number
    }
    | {
      _attributes: {
        name: 'repeat'
      }
      _text: number
    }
    | {
      _attributes: {
        name: 'maxAngleDelta'
      }
      _text: number
    }
    | {
      _attributes: {
        name: 'autoWrap'
      }
      _text: number
    }
    | {
      _attributes: {
        name: 'forceLeftToRight'
      }
      _text: 'false'
    }
    | {
      _attributes: {
        name: 'conflictResolution'
      }
      _text: 'false'
    }
    | {
      _attributes: {
        name: 'goodnessOfFit'
      }
      _text: number
    }
    | {
      _attributes: {
        name: 'polygonAlign'
      }
      _text: 'manual' | 'ortho' | 'mbr'
    }
    | {
      _attributes: {
        name: 'graphic-resize'
      }
      _text: 'none' | 'proportional' | 'stretch'
    }
    | {
      _attributes: {
        name: 'graphic-margin'
      }
      _text: 'margin'
    }
    | {
      _attributes: {
        name: 'partials'
      }
      _text: 'true'
    }
    | {
      _attributes: {
        name: 'underlineText'
      }
      _text: 'true'
    }
    | {
      _attributes: {
        name: 'strikethroughText'
      }
      _text: 'true'
    }
    | {
      _attributes: {
        name: 'charSpacing'
      }
      _text: number
    }
    | {
      _attributes: {
        name: 'wordSpacing'
      }
      _text: number
    }
    | {
      _attributes: {
        name: 'displacementMode'
      }
      _text: string
    }

  interface Radius extends XML_TAG { }

  interface Halo extends XML_TAG {
    Radius?: Radius
    Fill?: Fill
  }

  interface Priority extends XML_TAG {
    'ogc:PropertyName'?: OGC.PropertyName
  }

  interface TextSymbolizer {
    Geometry?: Geometry
    Label?: Label
    Halo?: Halo
    Font?: Font
    LabelPlacement?: LabelPlacement
    VendorOption?: VendorOption[]
    Fill?: Fill
    Graphic?: Graphic
    Priority?: Priority
  }

  interface Name extends XML_TAG { }
  interface Title extends XML_TAG { }
  interface MinScaleDenominator extends XML_TAG { }
  interface MaxScaleDenominator extends XML_TAG { }

  interface PolygonSymbolizer extends XML_TAG {
    Fill?: Fill
    Stroke?: Stroke
  }

  interface Rule extends XML_TAG {
    Name?: Name
    MinScaleDenominator?: MinScaleDenominator
    MaxScaleDenominator?: MaxScaleDenominator
    Title?: Title
    'ogc:Filter'?: OGC.Filter
    PointSymbolizer?: PointSymbolizer
    PolygonSymbolizer?: PolygonSymbolizer
  }

  interface FeatureTypeStyle extends XML_TAG {
    Rule?: Rule | Rule[]
  }

  interface Title extends XML_TAG { }

  interface UserStyle extends XML_TAG {
    Title?: Title
    FeatureTypeStyle?: FeatureTypeStyle
  }

  interface Name extends XML_TAG { }

  interface NamedLayer extends XML_TAG {
    Name?: Name
    UserStyle?: UserStyle
  }

  interface StyledLayerDescriptor extends XML_TAG {
    _attributes: {
      version: '1.0.0'
      'xsi:schemaLocation': 'http://www.opengis.net/sld StyledLayerDescriptor.xsd'
      xmlns: 'http://www.opengis.net/sld'
      'xmlns:ogc': 'http://www.opengis.net/ogc'
      'xmlns:xlink': 'http://www.w3.org/1999/xlink'
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'
    }
    NamedLayer?: NamedLayer
  }

  interface SLD extends XML_TAG {
    _declaration: {
      _attributes: {
        version: '1.0'
        encoding: 'utf-8'
      }
    }
    StyledLayerDescriptor?: StyledLayerDescriptor
  }
}
