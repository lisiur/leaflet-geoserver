import { OGC } from './typings/SLD'
import { generateXMLTagText } from './utils'
type StateTransition = Map<string, Array<{ input: RegExp, to: string, ignore?: boolean, meta?: { type?: string, reason?: string }, rst?: boolean }>>

class StateMachine {
  private transition: StateTransition
  private startState: string
  private endState: string
  private errorState: string
  private currentState: string
  constructor(transition: StateTransition, cfg = { initial: 'start', start: 'start', end: 'end', error: 'error' }) {
    this.transition = transition
    this.startState = cfg.start
    this.endState = cfg.end
    this.errorState = cfg.error
    this.currentState = cfg.initial
  }
  exec(input: string) {
    // add terminal space
    input = input + ' '

    let currentToken = ''
    const tokens = []
    for (let i = 0; i < input.length;) {
      const char = input[i]
      const rules = this.transition.get(this.currentState)
      if (!rules) {
        throw new Error(`Invalid state ${this.currentState}`)
      }

      let matched = false
      for (let j = 0; j < rules.length; j++) {
        const rule = rules[j]
        if (rule.input.test(char)) {
          matched = true
          if (!rule.ignore) {
            currentToken += char
          }
          if (rule.to === this.endState) {
            tokens.push({
              token: currentToken,
              meta: rule.meta
            })
            this.currentState = this.startState
            currentToken = ''
          } else if (rule.to === this.errorState) {
            throw new Error(rule.meta.reason)
          } else {
            this.currentState = rule.to
          }
          if (!rule.rst) {
            i++
          }
          break
        }
      }
      if (!matched) {
        throw new Error('No match rule')
      }
    }
    return tokens
  }
}

class OGCStateMachine extends StateMachine {
  static stateTransition: StateTransition = new Map([
    ['start',
      [
        {
          input: /\s/,
          to: 'start',
          ignore: true,
        },
        {
          input: /\&/,
          to: 'andMatching',
        },
        {
          input: /\|/,
          to: 'orMatching',
        },
        {
          input: /\>/,
          to: 'gtMatching',
        },
        {
          input: /\</,
          to: 'ltMatching',
        },
        {
          input: /\!/,
          to: 'neMatching',
        },
        {
          input: /=/,
          to: 'eqMatching',
        },
        {
          input: /@/,
          to: 'inOrBetweenMatching',
          ignore: true,
        },
        {
          input: /\w|[\u4e00-\u9fa5]/,
          to: 'propMatching'
        },
        {
          input: /./,
          to: 'error',
          meta: {
            reason: 'Invalid token',
          },
        },
      ],
    ],
    ['propMatching',
      [
        {
          input: /\w|[\u4e00-\u9fa5]/,
          to: 'propMatching',
        },
        {
          input: /\W/,
          to: 'end',
          meta: {
            type: 'TOKEN'
          },
          ignore: true,
          rst: true,
        },
      ],
    ],
    ['andMatching',
      [
        {
          input: /\&/,
          to: 'end',
          meta: {
            type: 'AND',
          },
        },
        {
          input: /./,
          to: 'error',
          meta: {
            reason: 'Invalid token after & (&&)'
          },
        }
      ]
    ],
    ['orMatching',
      [
        {
          input: /\|/,
          to: 'end',
          meta: {
            type: 'OR'
          },
        },
        {
          input: /./,
          to: 'error',
        }
      ]
    ],
    ['gtMatching',
      [
        {
          input: /=/,
          to: 'end',
          meta: {
            type: 'GT'
          },
        },
        {
          input: /./,
          to: 'end',
          meta: {
            type: 'GT'
          },
          ignore: true,
          rst: true
        },
      ],
    ],
    ['ltMatching',
      [
        {
          input: /=/,
          to: 'end',
          meta: {
            type: 'LE',
          },
        },
        {
          input: /./,
          to: 'end',
          meta: {
            type: 'LT'
          },
          ignore: true,
          rst: true,
        },
      ]
    ],
    ['neMatching',
      [
        {
          input: /=/,
          to: 'end',
          meta: {
            type: 'NE',
          },
        },
        {
          input: /./,
          to: 'error',
          meta: {
            reason: 'Invalid token after = (!=)'
          },
        },
      ],
    ],
    ['eqMatching',
      [
        {
          input: /=/,
          to: 'end',
          meta: {
            type: 'EQ',
          },
        },
        {
          input: /./,
          to: 'error',
          meta: {
            reason: 'Invalid token after = (==)'
          },
        },
      ]
    ],
    ['inOrBetweenMatching',
      [
        {
          input: /\s/,
          to: 'inOrBetweenMatching',
          ignore: true,
        },
        {
          input: /\[/,
          to: 'betweenLeftMatching',
          ignore: true,
        },
        {
          input: /\(/,
          to: 'inLeftMatching',
          ignore: true,
        },
        {
          input: /./,
          to: 'error',
          meta: {
            reason: 'Invalid token after @ (in or between)'
          },
        },
      ],
    ],
    ['betweenLeftMatching',
      [
        {
          input: /\s/,
          to: 'betweenLeftMatching',
          ignore: true,
        },
        {
          input: /\d|\./,
          to: 'betweenWordMatching',
        },
        {
          input: /./,
          to: 'error',
          meta: {
            reason: 'Invalid token after [ (between)'
          },
        },
      ],
    ],
    ['betweenWordMatching',
      [
        {
          input: /\]/,
          to: 'error',
          meta: {
            reason: 'need two args'
          },
        },
        {
          input: /\,/,
          to: 'betweenCommaMatching',
        },
        {
          input: /./,
          to: 'betweenWordMatching',
        },
      ],
    ],
    ['betweenCommaMatching',
      [
        {
          input: /\s/,
          to: 'betweenCommaMatching',
          ignore: true,
        },
        {
          input: /\w/,
          to: 'betweenWord2Matching',
        },
        {
          input: /./,
          to: 'error',
          meta: {
            reason: 'Invalid token after , (between)'
          },
        },
      ],
    ],
    ['betweenWord2Matching',
      [
        {
          input: /\]/,
          to: 'end',
          ignore: true,
          meta: {
            type: 'BETWEEN'
          },
        },
        {
          input: /\w|[\u4e00-\u9fa5]/,
          to: 'betweenWord2Matching',
        },
        {
          input: /./,
          to: 'error',
          meta: {
            reason: 'Invalid token after , (between)'
          },
        },
      ],
    ],
    ['inLeftMatching',
      [
        {
          input: /\s/,
          to: 'inLeftMatching',
          ignore: true,
        },
        {
          input: /[^,]/,
          to: 'inWordMatching',
        },
        {
          input: /./,
          to: 'error',
          meta: {
            reason: 'Invalid token after (, (in)'
          },
        },
      ]
    ],
    ['inWordMatching',
      [
        {
          input: /\)/,
          to: 'end',
          ignore: true,
          meta: {
            type: 'IN'
          },
        },
        {
          input: /\,/,
          to: 'inCommaMatching',
        },
        {
          input: /./,
          to: 'inWordMatching',
        },
      ],
    ],
    ['inCommaMatching',
      [
        {
          input: /\s/,
          to: 'inCommaMatching',
          ignore: true,
        },
        {
          input: /\w|[\u4e00-\u9fa5]/,
          to: 'inWordMatching',
        },
        {
          input: /./,
          to: 'error',
          meta: {
            reason: 'Invalid token after , (in)'
          },
        },
      ],
    ],
  ])
  constructor() {
    super(OGCStateMachine.stateTransition)
  }
}

/**
 * singleExpression
 *  : TOKEN GT TOKEN
 *  | TOKEN LT TOKEN
 *  | TOKEN GE TOKEN
 *  | TOKEN LE TOKEN
 *  | TOKEN EQ TOKEN
 *  | TOKEN NE TOKEN
 *  | TOKEN IN
 *  | TOKEN BETWEEN
 * 
 * orExpression
 *  : andExpression
 *  : orExpression OR andExpression
 * 
 * andExpression
 *  : singleExpression
 *  | andExpression AND singleExpression
 */

class SyntaxNode<T extends any> {
  public value: T
  public left: SyntaxNode<T>
  public right: SyntaxNode<T>
  constructor(params?: { value?: T, left?: SyntaxNode<T>, right?: SyntaxNode<T> }) {
    this.value = params?.value
    this.left = params?.left
    this.right = params?.right
  }
}

interface Expression {
  type: string
  opt?: string
  tokens?: [string, string[]]
}
function generateSyntaxTree(input: string): SyntaxNode<Expression> | null {
  let tokens
  try {
    tokens = new OGCStateMachine().exec(input)
  } catch (err) {
    console.log(err.message)
  }

  const expressions = [] as Array<Expression>
  let i = 0
  while (true) {
    const [token1, token2, token3] = [tokens[i], tokens[i + 1], tokens[i + 2]]
    if (!token1) {
      break
    }
    switch (token1.meta.type) {
      case 'TOKEN': {
        if (!token2) {
          throw new Error(`unexpected token ${token1.token}`)
        }
        switch (token2.meta.type) {
          case 'GT':
          case 'LT':
          case 'GE':
          case 'LE':
          case 'EQ':
          case 'NE': {
            if (!token3) {
              throw new Error(`need more token after ${token2.token}`)
            }
            expressions.push({
              type: 'singleExpression',
              opt: token2.meta.type,
              tokens: [token1.token, [token3.token]],
            })
            i += 3
            break
          }
          case 'BETWEEN':
          case 'IN': {
            expressions.push({
              type: 'singleExpression',
              opt: token2.meta.type,
              tokens: [token1.token, token2.token.split(',')],
            })
            i += 2
            break
          }
          default: {
            throw new Error(`unexpected token ${token1.token} ${token2.token}`)
          }
        }
        break
      }
      case 'OR':
      case 'AND': {
        expressions.push({
          type: token1.meta.type,
        })
        i += 1
        break
      }
      default: {
        throw new Error(`unexpected token ${token1.token}`)
      }
    }
    if (i >= tokens.length) {
      break
    }
  }

  if (expressions.length === 0) {
    return null
  }

  const orExpressions: any = [[]]
  expressions.forEach(expression => {
    if (expression.type === 'singleExpression') {
      orExpressions[orExpressions.length - 1].push(expression)
    }
    if (expression.type === 'OR') {
      orExpressions[orExpressions.length] = []
    }
  })

  const nodes = orExpressions.map((expressions: Expression[]) => {
    if (expressions.length === 1) {
      return new SyntaxNode({
        value: expressions[0]
      })
    } else {
      let subRootNode = new SyntaxNode({
        value: { type: 'AND' }
      })
      expressions.forEach((expression) => {
        const node = new SyntaxNode({
          value: expression
        })
        if (!subRootNode.left) {
          subRootNode.left = node
        } else if (!subRootNode.right) {
          subRootNode.right = node
        } else {
          const newRoot = new SyntaxNode({
            value: { type: 'AND' }
          })
          newRoot.left = subRootNode
          newRoot.right = node
          subRootNode = newRoot
        }
      })
      return subRootNode
    }
  }) as SyntaxNode<Expression>[]
  if (nodes.length === 1) {
    return nodes[0]
  } else {
    let rootNode = new SyntaxNode({
      value: { type: 'OR' }
    })
    nodes.forEach((node) => {
      if (!rootNode.left) {
        rootNode.left = node
      } else if (!rootNode.right) {
        rootNode.right = node
      } else {
        const newRoot = new SyntaxNode({
          value: { type: 'OR' }
        })
        newRoot.left = rootNode
        rootNode = newRoot
      }
    })
    return rootNode
  }
}

function translateSyntaxTree(node: SyntaxNode<Expression>, parentType: string = null): OGC.Filter {
  if (!node || !node.value) {
    return null
  }
  if (node.value.type === 'AND') {
    if (parentType === 'AND') {
      return {
        ...translateSyntaxTree(node.left, 'AND'),
        ...translateSyntaxTree(node.right),
      }
    } else {
      return {
        'And': {
          ...translateSyntaxTree(node.left, 'AND'),
          ...translateSyntaxTree(node.right),
        }
      }
    }
  } else if (node.value.type === 'OR') {
    if (parentType === 'OR') {
      return {
        ...translateSyntaxTree(node.left, 'OR'),
        ...translateSyntaxTree(node.right),
      }
    } else {
      return {
        'Or': {
          ...translateSyntaxTree(node.left, 'OR'),
          ...translateSyntaxTree(node.right),
        }
      }
    }
  } else if (node.value.type === 'singleExpression') {
    switch (node.value.opt) {
      case 'GT':
      case 'LT':
      case 'GE':
      case 'LE':
      case 'EQ':
      case 'NE': {
        const map = {
          GT: 'PropertyIsGreaterThan',
          LT: 'PropertyIsLessThan',
          GE: 'PropertyIsGreaterThanOrEqualTo',
          LE: 'PropertyIsLessThanOrEqualTo',
          EQ: 'PropertyIsEqualTo',
          NE: 'PropertyIsNotEqualTo',
        }
        return {
          [map[node.value.opt]]: {
            "PropertyName": generateXMLTagText(node.value.tokens[0]),
            "Literal": generateXMLTagText(node.value.tokens[1][0]),
          }
        }
      }
      case 'BETWEEN': {
        return {
          'And': {
            'PropertyIsGreaterThanOrEqualTo': {
              "PropertyName": generateXMLTagText(node.value.tokens[0]),
              "Literal": generateXMLTagText(node.value.tokens[1][0]),
            },
            'PropertyIsLessThanOrEqualTo': {
              "PropertyName": generateXMLTagText(node.value.tokens[0]),
              "Literal": generateXMLTagText(node.value.tokens[1][1]),
            }
          }
        }
      }
      case 'IN': {
        if ((node.value.tokens[1].length === 1)) {
          const literal = node.value.tokens[1][0]
          return {
            'PropertyIsEqualTo': {
              "PropertyName": generateXMLTagText(node.value.tokens[0]),
              "Literal": generateXMLTagText(literal),
            }
          }
        }
        return {
          'Or': {
            'PropertyIsEqualTo': node.value.tokens[1].map(literal => ({
              "PropertyName": generateXMLTagText(node.value.tokens[0]),
              "Literal": generateXMLTagText(literal),
            }))
          }
        }
      }
    }
  } else {
    return null
  }
}

export function generateOGCDefinition(input: string) {
  const tree = generateSyntaxTree(input)
  const def = translateSyntaxTree(tree)
  return def
}
