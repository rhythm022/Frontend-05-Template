function getStyle(element) {
  if (!element.style)
    element.style = {};

  for (let prop in element.computedStyle) {
    element.style[prop] = element.computedStyle[prop].value;

    if (element.style[prop].toString().match(/px$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }

    if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
  }
  return element.style;
}

function layout(element) {
  if (!element.computedStyle) return;

  const elementStyle = getStyle(element);// 预处理

  if (elementStyle.display !== 'flex') return;

  const items = element.children.filter(e => e.type === 'element');// 文本节点不占空间？？

  items.sort(function(a, b) { //order大的，在前？？
    return (a.order || 0) - (b.order || 0);
  });

  const style = elementStyle


      ['width', 'height'].forEach(size => {
    if (style[size] === 'auto' || style[size] === '') {
      style[size] = null;
    }
  });

  if (!style.flexDirection || style.flexDirection === 'auto') {
    style.flexDirection = 'row';
  }

  if (!style.alignItems || style.alignItems === 'auto') {
    style.alignItems = 'stretch';// cross对齐方式
  }
  if (!style.justifyContent || style.justifyContent === 'auto') {
    style.justifyContent = 'flex-start'; // 主方向对齐方式
  }
  if (!style.flexWrap || style.flexWrap === 'auto') {
    style.flexWrap = 'nowrap';
  }
  if (!style.alignContent || style.alignContent === 'auto') {
    style.alignContent = 'stretch';// cross对齐方式
  }

  let mainSize, mainStart, mainEnd, mainSign, mainBase,
      crossSize, crossStart, crossEnd, crossSign, crossBase;

  if (style.flexDirection === 'row') {
    mainSize = 'width';
    mainStart = 'left';
    mainEnd = 'right';
    mainSign = +1;
    mainBase = 0;

    crossSize = 'height';
    crossStart = 'top';
    crossEnd = 'bottom';

  }
  if (style.flexDirection === 'row-reverse') {
    mainSize = 'width';
    mainStart = 'right';
    mainEnd = 'left';
    mainSign = -1;
    mainBase = style.width;

    crossSize = 'height';
    crossStart = 'top';
    crossEnd = 'bottom';
  }

  if (style.flexDirection === 'column') {
    mainSize = 'height';
    mainStart = 'top';
    mainEnd = 'bottom';
    mainSign = +1;
    mainBase = 0;

    crossSize = 'width';
    crossStart = 'left';
    crossEnd = 'right';

  }

  if (style.flexDirection === 'column-reverse') {
    mainSize = 'height';
    mainStart = 'bottom';
    mainEnd = 'top';
    mainSign = -1;
    mainBase = style.height;

    crossSize = 'width';
    crossStart = 'left';
    crossEnd = 'right';
  }

  if (style.flexWrap === 'wrap-reverse') {// 以行为单位反向
    const tmp = crossStart;
    crossStart = crossEnd;
    crossEnd = tmp;
    crossSign = -1;
  } else {
    crossSign = +1;//??
    crossBase = 0;//??

  }

  let isAutoMainSize = false;
  if (!style[mainSize]) {// 父元素没有设置主轴尺寸
    elementStyle[mainSize] = 0;
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      const itemStyle = getStyle(item);
      if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== (void 0)) {
        elementStyle[mainSize] += itemStyle[mainSize];
      }
    }
    isAutoMainSize = true;
  }

  let flexLine = [];
  const flexLines = [flexLine];

  let mainSpace = elementStyle[mainSize];
  let crossSpace = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const itemStyle = getStyle(item);

    if (itemStyle[mainSize] === null) {
      itemStyle[mainSize] = 0;
    }

    if (itemStyle.flex) {//flex说明该子元素可伸缩
      //可伸缩就不占mainSpace了？？
      flexLine.push(item);
    }
    else if (style.flexWrap === 'nowrap' && isAutoMainSize) {//&& ？？
      mainSpace -= itemStyle[mainSize];

      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }
      flexLine.push(item);
    }
    else {
      // 父元素有固定的宽度、子元素有固定宽度

      if (itemStyle[mainSize] > style[mainSize]) {
        itemStyle[mainSize] = style[mainSize]; // 子元素委曲求全
      }

      if (mainSpace < itemStyle[mainSize]) {
        flexLine.mainSpace = mainSpace; // 剩余空间
        flexLine.crossSpace = crossSpace;

        flexLine = [item];
        flexLines.push(flexLine);
        mainSpace = style[mainSize];
        crossSpace = 0;
      }
      else {
        flexLines.push(flexLine);

      }
      mainSpace -= itemStyle[mainSize];

      if(itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)){
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);

      }

    }
  }
  flexLine.mainSpace = mainSpace
}

module.exports = layout;


































