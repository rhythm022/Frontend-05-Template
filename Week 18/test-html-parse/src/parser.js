const css = require("css");

const layout = require("./layout.js");

let currentToken = "";
let currentAttribute = "";
let currentTextNode = null;
const EOF = Symbol("EOF"); // end of file

let stack;

function match(element, selector) {
  // 目前只处理简单选择器

  // 判断是否为文本节点
  if (!selector || !element.attributes) return false;
  if (selector.charAt(0) === ".") {
    let attr = element.attributes.filter((attr) => attr.name === "class");
    if (attr[0] && attr[0].value === selector.replace(".", "")) {
      return true;
    }
  } else if (selector.charAt(0) === "#") {
    let attr = element.attributes.filter((attr) => attr.name === "id");
    if (attr[0] && attr[0].value === selector.replace("#", "")) {
      return true;
    }
  } else {
    if (element.tagName === selector) {
      return true;
    }
  }
  return false;
}

function specificity(selector) {
  let p = [0, 0, 0, 0]; // [inline, id, class, tag]
  const selectorParts = selector.split(" ");
  // div#id.class
  for (const part of selectorParts) {
    if (part.charAt(0) === "#") {
      p[1]++;
    } else if (part.charAt(0) === ".") {
      p[2]++;
    } else {
      p[3]++;
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
  } else {
    return sp1[3] - sp2[3];
  }
}

let rules;
// 把 css 规则暂存到一个数组里
function addCSSRules(text) {
  var ast = css.parse(text);
  rules.push(...ast.stylesheet.rules);
}

function computeCSS(element) {
  let elements = stack.slice().reverse(); // 父元素
  if (!element.computedStyle) {
    element.computedStyle = {}; // 保存 css 属性
  }
  for (let rule of rules) {
    let selectorParts = rule.selectors[0].split(" ").reverse(); // 使选择器的排序和父元素排序相同
    // 第一个选择器和自身元素是否匹配；
    if (!match(element, selectorParts[0])) continue;
    let matched = false;
    let j = 1;
    for (let i = 0; i < elements.length; i++) {
      if (match(elements[i], selectorParts[j])) {
        j++;
      }
    }
    // 为什么会有大于的情况？
    if (j >= selectorParts.length) {
      matched = true;
    }
    // 如果匹配到，为该元素加入CSS规则
    if (matched) {
      let computedStyle = element.computedStyle;
      let sp = specificity(rule.selectors[0]); // 当前选择器的优先级数组
      for (const declaration of rule.declarations) {
        if (!computedStyle[declaration.property])
          computedStyle[declaration.property] = {};
        if (
          !computedStyle[declaration.property].specificity ||
          compare(computedStyle[declaration.property].specificity, sp) < 0
        ) {
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = sp;
        }
      }
    }
  }
}

function emit(token) {
  let top = stack[stack.length - 1];
  if (token.type === "startTag") {
    let element = {
      type: "element",
      children: [],
      attributes: [],
    };
    element.tagName = token.tagName;
    for (const p in token) {
      if (p !== "type" && p !== "tagName") {
        element.attributes.push({
          name: p,
          value: token[p],
        });
      }
    }
    top.children.push(element);
    element.parent = top;

    computeCSS(element);

    if (!token.isSelfClosing) {
      stack.push(element);
    }
    currentTextNode = null;
  } else if (token.type === "endTag") {
    if (token.tagName !== top.tagName) {
      throw new Error("Tag start end doesnot match!");
    } else {
      // ************* 遇到style标签，执行CSS规则的操作***********
      if (top.tagName === "style") {
        top.children.length && addCSSRules(top.children[0].content);
      }
      layout(top);
      stack.pop();
    }
    currentTextNode = null;
  } else if (token.type === "text") {
    if (currentTextNode === null) {
      currentTextNode = { type: "text", content: "" };
      top.children.push(currentTextNode);
    }
    currentTextNode.content += token.content;
  }
}

function data(c) {
  if (c === "<") {
    return tagOpen;
  } else if (c === EOF) {
    emit({
      type: "EOF",
    });
    return;
  } else {
    emit({
      type: "text",
      content: c,
    });
    return data;
  }
}
function tagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = { type: "startTag", tagName: "" };
    return tagName(c);
  } else if (c === "/") {
    return endTagOpen;
  } else {
    emit({
      type: "text",
      content: c,
    });
    return data;
  }
}
function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = { type: "endTag", tagName: "" };
    return tagName(c);
  } else if (c === ">") {
    // error
  } else if (c === EOF) {
    // error
  } else {
  }
}
function tagName(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += c;
    return tagName;
  } else if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c === ">") {
    emit(currentToken);
    return data;
  } else {
    return;
  }
}
function beforeAttributeName(c) {
  if (c === ">") {
    emit(currentToken);
    return data;
  } else if (c === "=") {
    return beforeAttributeName;
  } else if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else {
    currentAttribute = {
      name: "",
      value: "",
    };
    return attributeName(c);
  }
}
function attributeName(c) {
  if (c.match(/^[\t\n\f ]$/) || c === "/" || c === ">" || c === EOF) {
    return afterAttributeName(c);
  } else if (c === "=") {
    return beforeAttributeValue;
  } else if (c === "\u0000") {
  } else if (c === '"' || c === "<" || c === "'") {
  } else {
    currentAttribute.name += c;
    return attributeName;
  }
}
function afterAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c === "=") {
    return beforeAttributeValue;
  } else if (c === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === EOF) {
  } else {
    currentToken[currentAttribute.name] = currentAttribute.value;
    currentAttribute = { name: "", value: "" };
    return beforeAttributeName(c);
  }
}
function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/) || c === "/" || c === ">" || c === EOF) {
    return beforeAttributeValue;
  } else if (c === '"') {
    return DoubleQuoteattributeValue;
  } else if (c === "'") {
    return SingleQuoteattributeValue;
  } else if (c === ">") {
  } else {
    return UnquoteAttributeValue(c);
  }
}
function DoubleQuoteattributeValue(c) {
  if (c === '"') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuoteAttributeValue;
  } else if (c === "\u0000") {
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c;
    return DoubleQuoteattributeValue;
  }
}
function SingleQuoteattributeValue(c) {
  if (c === "'") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuoteAttributeValue;
  } else if (c === "\u0000") {
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c;
    return SingleQuoteattributeValue;
  }
}
function UnquoteAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if (c === "/") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === "\u0000") {
  } else if (["'", '"', "<", "`", "="].indexOf(c) > -1) {
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c;
    return UnquoteAttributeValue;
  }
}
function afterQuoteAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c;
    return DoubleQuoteattributeValue;
    // ?? 怎么确定就是双引号
  }
}
function selfClosingStartTag(c) {
  if (c === ">") {
    currentToken.isSelfClosing = true;
    emit(currentToken);
    return data;
  } else if (c === EOF) {
    // error
  } else {
  }
}

export function parseHTML(html) {
  rules = [];
  currentToken = "";
  currentAttribute = "";
  currentTextNode = null;
  stack = [{ type: "document", children: [] }];

  let state = data;
  for (const c of html) {
    state = state(c);
  }
  state = state(EOF);
  return stack[0];
}
