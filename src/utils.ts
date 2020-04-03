
export function generateXMLTagText(text: any, encode = true) {
  if (text) {
    return {
      // TODO: 处理中文编码
      _text: encode ? text : text
    }
  }
}