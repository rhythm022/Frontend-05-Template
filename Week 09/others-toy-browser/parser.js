const css = require('css');
const util = require('util');

let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;

const EOF = Symbol('EOF'); // End Of File.

/**
 * 1. 收集css规则：在style标签结束时，收集所有css规则
 * 2. 添加css规则：在每个开始标签结束时添加上css规则
 */
let rules = [];
function addCSSRules(cssText) {
  const ast = css.parse(cssText);
  rules.push(...ast.stylesheet.rules);
}

function match(element, selector) {
  if (!element || !selector) return false;
  if (selector.charAt(0) === '#') {
    const attr = element.attributes.filter(a => a.name === 'id')[0];
    if (attr && attr.value === selector.replace('#', '')) return true;
  } else if (selector.charAt(0) === '.') {
    const attr = element.attributes.filter(a => a.name === 'class')[0];
    if (attr && attr.value === selector.replace('.', '')) return true;
  } else if (element.tagName === selector) {
    return true;
  }
  return false;
}

function specificity(selector) {
  let p = [0, 0, 0, 0]; // [inline, id, class, tag]
  // .father .son
  const selectorParts = selector.split(' ');
  for (const selector of selectorParts) {
    if (selector.charAt(0) === '#') {
      p[1] += 1;
    } else if (selector.charAt(0) === '.') {
      p[2] += 1;
    } else {
      p[3] += 1;
    }
  }
  return p;
}

function compare(sp1, sp2) {
  if (sp1[0] - sp2[0]) {
    return sp1[0] - sp2[0];
  } else if (sp1[1] - sp2[1]) {
    return sp1[1] - sp2[1];
  } else if (sp1[2] - sp2[2]) {
    return sp1[2] - sp2[2];
  }
  return sp1[3] - sp2[3];
}

// 对每个元素匹配对应css规则
function computeCSS(element) {
  // 匹配css规则由内相外匹配，从该元素往父级逐级匹配，这个方式比由外到内高效
  // 为什么要slice? stack会有变动，复制一份处理
  const elements = stack.slice(0).reverse();

  if (!element.computedStyle) {
    element.computedStyle = {};
  }

  for (const rule of rules) {
    const selectorParts = rule.selectors[0].split(' ').reverse();
    if (!match(element, selectorParts[0])) continue;

    let matched = false;

    let j = 1; // 记录匹配到选择器个数。这里初始值为什么是1，而不是0
    for (let i = 0; i < elements.length; i++) {
      // 将该复合选择器中每一个规则与栈中每一个元素匹配
      if (match(elements[i], selectorParts[j])) {
        j++;
      }
    }

    if (j >= selectorParts.length) matched = true;

    if (matched) {
      const sp = specificity(rule.selectors[0]);
      const computedStyle = element.computedStyle;
      for (const declaration of rule.declarations) {
        if (!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = {};
        }

        if (!computedStyle.specificity) {
          computedStyle[declaration.property].value = declaration.value;
          computedStyle.specificity = sp;
        } else if (compare(computedStyle.specificity, sp)) {
          computedStyle[declaration.property].value = declaration.value;
          computedStyle.specificity = sp;
        }
      }
    }
  }
}

// 1. 使用token构建dom树（只含有标签）
// 2. 添加文本节点
// 3. 添加css文本，css层级
let stack = [{type: 'document', children: []}]; // 使用栈的先进后出方式实现
function emit(token) {
  let top = stack[stack.length - 1]; // 栈顶，初始栈顶document
  // console.log('token:', token);
  if (token.type === 'text') {
    if (currentTextNode === null) {
      currentTextNode = {
        type: 'text',
        content: '',
      };
      top.children.push(currentTextNode);
    }
    currentTextNode.content += token.content;
  }
  if (token.type === 'startTag') {
    // 标签开始，入栈
    /**
     * 1. push该标签到document
     * 2. push该标签到stack，作为栈顶
     * 3. 添加父级指向parent
     */
    let element = {
      type: 'element',
      tagName: '',
      children: [],
      attributes: [],
      parent: null,
    }

    element.tagName = token.tagName;
    for (const t in token) {
      if (t !== 'type' && t !== 'tagName') {
        element.attributes.push({
          name: t,
          value: token[t],
        });
      };
    };
    element.parent = top;

    computeCSS(element);

    top.children.push(element);
    // 屏蔽自封闭标签
    if (!token.isSelfClosing) {
      stack.push(element);
    }

    currentTextNode = null;
  }
  if (token.type === 'endTag') {
    // 标签结束，出栈
    if (top.tagName === token.tagName) {
      if (top.tagName === 'style') {
        addCSSRules(top.children[0].content);
      }

      stack.pop();
    } else {
      throw TypeError(top.tagName, '===>', token.tagName);
    }

    currentTextNode = null;
  }
}

function data(c) {
  if (c === '<') {
    return tagOpen;
  } else if (c === EOF) {
    emit({
      type: 'EOF',
    });
    return ;
  } else {
    emit({
      type: 'text',
      content: c,
    })
    return data;
  }
}

function tagOpen(c) {
  // 进入标签, 区分开始标签\结束标签\自封闭标签
  if (c === '/') {
    // 结束标签
    return endTagOpen;
  } else if (c.match(/^[a-zA-Z]$/)) {
    // 标签名
    currentToken = {
      type: 'startTag',
      tagName: '',
    }
    return tagName(c);
  }
}

function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'endTag',
      tagName: '',
    }
    return tagName(c);
  } else if (c === '>') {
    return data;
  }
}

function tagName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === '/') {
    // 自封闭标签
    return selfClosingTag;
  } else if (c.match(/^[a-zA-Z]$/)) {
    // 记录标签名
    currentToken.tagName += c;
    return tagName;
  } else if (c === '>') {
    emit(currentToken);
    return data;
  }
}

function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === '=') {
    // 抛错
  } else if (c === '>') {
    return afterAttributeName(c);
  } else if (c === '/') {
    return afterAttributeName(c);
  } else {
    currentAttribute = {
      name: '',
      value: '',
    };
    return attributeName(c);
  }
}

function attributeName(c) {
  if (c === '=') {
    return attributeValue;
  } else if (c.match(/^[\t\n\f ]$/) || c === '/' || c ==='>') {
    // 单独属性情况, input disabled
    return afterAttributeName(c);
  } else {
    currentAttribute.name += c;
    return attributeName;
  }
}

function attributeValue(c) {
  if (c === '\"') {
    return doubleQuotedAttribute;
  } else if (c === '\'') {
    return singleQuotedAttribute;
  } else if (c.match(/^[a-zA-Z]$/)) {
    return unQuotedAttribute(c);
  }
}

function doubleQuotedAttribute(c) {
  if (c === '\"') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterAttributeName;
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttribute;
  }
}

function singleQuotedAttribute(c) {
  if (c === '\'') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterAttributeName;
  } else {
    currentAttribute.value += c;
    return singleQuotedAttribute;
  }
}

function unQuotedAttribute(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterAttributeName;
  } else if (c === '/') {
    return selfClosingTag;
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else {
    currentAttribute.value += c;
    return unQuotedAttribute;
  }
}

// 一个属性结束
function afterAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === '/') {
    return selfClosingTag;
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else {
    currentAttribute.value += c;
    return unQuotedAttribute;
  }
}

function selfClosingTag(c) {
  if (c === '>') {
    currentToken.isSelfClosing = true;
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  }
}

module.exports.parserHtml = function parserHtml(html) {
  // console.log('html:', html);
  // <html>\n<head>\n    <meta charset="utf-8" />\n</head>        \n<body>\n    <div id="root">hello world!!!</div>\n</body>\n</html>
  let state = data;
  for (const c of html) {
    state = state(c);
  }
  state = state(EOF);
  // console.log(util.inspect(stack, {depth: null}));
  return stack[0];
}
