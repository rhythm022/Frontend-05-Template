const EOF = Symbol('EOF');
let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;
let stack = [
  {
    type:'document',
    children:[]
  }
]


function emit(token) {
  let top = stack[stack.length - 1]

  if(token.type === 'startTag'){
    let element = {
      type:'element',
      children:[],
      attributes:[]
    }
    element.tagName = token.tagName
    element.parent = top

    for (const p in token) {
      if(p !== 'type' && p !== 'tagName'){
        element.attributes.push({
          name:p,
          value:token[p]
        })
      }
    }

    top.children.push(element)

    if(!token.isSelfClosing){
      stack.push(element)
    }

    currentTextNode = null
  }else if(token.type === 'endTag'){
    if(top.tagName !== token.tagName){
      throw new Error('Tag start end doesn\'t match')
    }else{
      stack.pop()
    }
    currentTextNode = null


  }else if(token.type === 'text'){
    if(currentTextNode === null){
      currentTextNode = {
        type:'text',
        content:''
      }
      top.children.push(currentTextNode)
    }

    currentTextNode.content += token.content
  }
}

// data抛EOF、抛text
function data(c) {
  if (c === '<') {
    return tagOpen;
  } else if (c === EOF) {
    emit({
      type: 'EOF',
    });
    return;
  } else {
    emit({
      type: 'text',
      content: c,
    });
    return data;
  }
}


// 初始化 startTag
function tagOpen(c) {
  if (c === '/') {
    return endTagOpen;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'startTag',
      tagName: '',
    };
    return tagName(c);
  } else {
  }
}

// tagName/遇到> 抛startTag
function tagName(c) {
  if (c.match(/^[\t\n\f ]$/)) { // 前进路径2
    return beforeAttributeName;
  } else if (c === '/') {
    return selfClosingStartTag;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += c;
    return tagName;
  } else if (c === '>') { // 前进路径1
    emit(currentToken);
    return data;
  } else {

  }
}

// 初始化 endTag
function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'endTag',
      tagName: '',
    };
    return tagName(c);
  } else if (c === '>') {

  } else if (c === EOF) {

  } else {

  }
}


// 初始化attributeName
function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === '/' || c === '>' || c === EOF) {
    // 该tag没有属性
    return afterTheAttribute(c);
  } else if (c === '=') {
    //报错
  } else {
    currentAttribute = {
      name: '',
      value: '',
    };
    return attributeName(c);
  }
}

function attributeName(c) {
  if (c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF) {
    return afterTheAttribute(c);
  } else if (c === '=') {
    return beforeAttributeValue;
  } else if (c === '\u0000') {
    // 没讲
  } else if (c === '"' || c === '\'' || c === '<') {
    // 没讲，应该是报错
  } else {
    currentAttribute.name += c;
    return attributeName;
  }
}

function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF) {
    return beforeAttributeValue;
  } else if (c === '"') {
    return doubleQuotedAttributeValue;
  } else if (c === '\'') {
    return singleQuotedAttributeValue;
  } else if (c === '>') {
    return data;
  } else {
    return unQuotedAttributeValue(c);
  }
}

function doubleQuotedAttributeValue(c) {
  if (c === '"') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c === '\u0000') {

  } else if (c === EOF) {

  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function singleQuotedAttributeValue(c) {
  if (c === '\'') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c === '\u0000') {

  } else if (c === EOF) {

  } else {
    currentAttribute.value += c;
    return singleQuotedAttributeValue;
  }
}

// afterQuotedAttributeValue/遇到> 抛startTag
function afterQuotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === '/') {
    return selfClosingStartTag;
  } else if (c === '>') {
    emit(currentToken);
    return data;
  } else if (c === EOF) {

  } else {

  }
}


// unQuotedAttributeValue/遇到> 抛startTag
function unQuotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if (c === '/') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);

    return data;
  } else if (c === '\u0000') {

  } else if (c === '"' || c === '\'' || c === '<' || c === '=' || c === '`') {

  } else if (c === EOF) {

  } else {
    currentAttribute.value += c;

    return unQuotedAttributeValue;
  }
}
// selfClosingStartTag/遇到/> 抛endTag
function selfClosingStartTag(c) {
  if (c === '>') {
    currentToken.isSelfClosing = true;
    emit(currentToken);
    return data;
  } else if (c === 'EOF') {

  } else {

  }
}

function afterTheAttribute(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return afterTheAttribute;
  } else if (c === '/') {
    return selfClosingStartTag;
  } else if (c === '=') {
    return beforeAttributeValue;
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === EOF) {

  } else {
//
  }
}

module.exports.parseHTML = function parseHTML(html) {
  let state = data;

  for (let char of html) {
    state = state(char);
  }
  state = state(EOF);
};
