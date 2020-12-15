const css = require('css');

let rules = [];

function addCSSRules(text) {
  const ast = css.parse(text);
  // console.log(JSON.stringify(ast, null, '    '));
  rules.push(...ast.stylesheet.rules);
}
function specificity(selector){
  const p = [0,0,0,0]
  const selectorParts = selector.split(' ')// 假设part是简单选择器
  for (const part of selectorParts) {
    if(part.charAt(0) === '#'){
      p[1] += 1
    }
    else if(part.charAt(0) === '.'){
      p[2] += 1
    }
    else{
      p[3] += 1
    }
  }
  return p
}


function compare(sp1,sp2){
  if(sp1[0] - sp2[0]) return sp1[0] - sp2[0]
  if(sp1[1] - sp2[1]) return sp1[1] - sp2[1]
  if(sp1[2] - sp2[2]) return sp1[2] - sp2[2]

  return sp1[3] - sp2[3]
}
function computeCSS(element,ancestorElements) {
  // element 当前element
  // ancestorElements 当前element的祖先元素
  // rules stylesheet
  // 有了这三个就可以找出当前element的style

  if (!element.computedStyle) {
    element.computedStyle = {};
  }

  for (const rule of rules) {
    const selectorParts = rule.selectors[0].split(' ').reverse();

    if (!match(element, selectorParts[0])) continue;

    let matched = false;

    let j = 1;
    for (let i = 0; i < ancestorElements.length; i++) {
      if (match(ancestorElements[i], selectorParts[j])) {// 从parent开始匹配，不需要连续匹配上，只需要所有的选择器有匹配
        j++;
      }
    }

    if (j >= selectorParts.length) {
      matched = true;
    }

    if(matched){
      const sp = specificity(rule.selectors[0])

      const computedStyle = element.computedStyle

      for (const declaration of rule.declarations) {
        if(!computedStyle[declaration.property]){
          computedStyle[declaration.property] = {}
        }
        // computedStyle[declaration.property].value = declaration.value

        if(!computedStyle[declaration.property].specificity){
          computedStyle[declaration.property].specificity = sp
          computedStyle[declaration.property].value = declaration.value

        }else if(compare(computedStyle[declaration.property].specificity,sp) < 0){
          computedStyle[declaration.property].specificity = sp
          computedStyle[declaration.property].value = declaration.value
        }
      }

    }
  }
}

function match(element,selector) {
  if(!element.attributes || !selector )return false //只有开始标签有attributes、有祖先元素但没有祖先选择器直接false

  if(selector.charAt(0) === '#'){
    const attr = element.attributes.filter(attr =>attr.name === 'id')[0]

    if(attr && attr.value === selector.replace('#','')) return true
  }
  else if(selector.charAt(0) === '.'){
    const attr = element.attributes.filter(attr =>attr.name === 'class')[0]

    if(attr && attr.value === selector.replace('.','')) return true
  }
  else{
    if(element.tagName === selector){
      return true
    }
  }
}





module.exports = {
  computeCSS,
  addCSSRules
}
