function layout(element) {
  // 没有样式时，跳过
  if (!element.computedStyle) return;
  // 对样式进行预处理
  let elementStyle = getStyle(element);

  // 只处理 flex 模式
  if (elementStyle.display !== "flex") return;

  // 过滤掉文本节点
  let items = element.children.filter((e) => e.type === "element");

  // 支持order属性
  items.sort(function (a, b) {
    return (a.order || 0) - (b.order || 0);
  });

  // 重新赋值 ？？
  let style = elementStyle;

  ["width", "height"].forEach((size) => {
    if (style[size] === "auto" || style[size] === "") {
      style[size] = null; // 后面统一判断
    }
  });

  // 设置默认值
  if (!style.flexDirection || style.flexDirection === "auto") {
    style.flexDirection = "row";
  }
  if (!style.justifyContent || style.justifyContent === "auto") {
    style.justifyContent = "flex-start";
  }
  if (!style.alignContent || style.alignContent === "auto") {
    style.alignContent = "flex-start";
  }
  if (!style.alignItems || style.alignItems === "auto") {
    style.alignItems = "stretch";
  }
  if (!style.flexWrap || style.flexWrap === "auto") {
    style.flexWrap = "nowrap";
  }

  let mainSize, // 主轴尺寸 width/height
    mainStart,
    mainEnd,
    mainSign, // 符号 +1/-1
    mainBase,
    crossSize,
    crossStart,
    crossEnd,
    crossSign,
    crossBase;
  if (style.flexDirection === "row") {
    mainSize = "width";
    mainStart = "left";
    mainEnd = "right";
    mainSign = +1;
    mainBase = 0;

    crossSize = "height";
    crossStart = "top";
    crossEnd = "bottom";
  }
  if (style.flexDirection === "row-reverse") {
    mainSize = "width";
    mainStart = "right";
    mainEnd = "left";
    mainSign = -1;
    mainBase = style.width;

    crossSize = "height";
    crossStart = "top";
    crossEnd = "bottom";
  }
  if (style.flexDirection === "cloumn") {
    mainSize = "height";
    mainStart = "top";
    mainEnd = "bottom";
    mainSign = +1;
    mainBase = 0;

    crossSize = "width";
    crossStart = "left";
    crossEnd = "right";
  }
  if (style.flexDirection === "cloumn-reverse") {
    mainSize = "height";
    mainStart = "bottom";
    mainEnd = "top";
    mainSign = -1;
    mainBase = 0;

    crossSize = "width";
    crossStart = "left";
    crossEnd = "right";
  }
  if (style.flexDirection === "wrap-reverse") {
    let tmp = crossStart;
    crossStart = crossEnd;
    crossEnd = tmp;
    crossSign = -1;
  } else {
    crossBase = 0;
    crossSign = +1;
  }

  let isAutoMainSize = false;
  if (!style[mainSize]) {
    style[mainSize] = 0;
    for (const item of items) {
      let itemStyle = getStyle(item);
      // ??? item mainSize 判断条件
      if (itemStyle[mainSize] !== null && itemStyle[mainSize] !== void 0) {
        style[mainSize] += itemStyle[mainSize];
      }
    }
    isAutoMainSize = true;
  }

  // 开始元素进行(hang)
  var flexLine = [],
    flexLines = [flexLine],
    mainSpace = style[mainSize], // 剩余空间
    crossSpace = 0;
  for (const item of items) {
    let itemStyle = getStyle(item);

    if (itemStyle[mainSize] === null) {
      itemStyle[mainSize] = 0;
    }

    if (itemStyle.flex) {
      flexLine.push(item);
    } else if (itemStyle.flexWrap === "nowrap" && isAutoMainSize) {
      mainSize -= itemStyle[mainSize];
      // 交叉轴尺寸
      if (itemStyle[crossSize] !== null && itemStyle[mainSize] !== void 0) {
        // crossSize 取最大值
        crossSpace = Math.max(itemStyle[crossSize], crossSpace);
      }
      flexLine.push(item);
    } else {
      // 元素超过 mainSize 时,进行压缩
      if (itemStyle[mainSize] > style[mainSize]) {
        itemStyle[mainSize] = style[mainSize];
      }
      // mainSpace 不足时换行
      if (itemStyle[mainSize] > mainSpace) {
        flexLine.mainSpace = mainSpace;
        flexLine.crossSpace = crossSpace;
        // 新行
        flexLine = [item];
        flexLines.push(flexLine);
        mainSpace = style[mainSize];
        crossSpace = 0;
      } else {
        flexLine.push(item);
      }
      mainSpace -= itemStyle[mainSize];
      // 交叉轴尺寸
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== void 0) {
        // crossSize 取最大值
        crossSpace = Math.max(itemStyle[crossSize], crossSpace);
      }
    }
    flexLine.mainSpace = mainSpace;

    // 设置一下 crossSpace
    if (style.flexWrap === "nowrap" || isAutoMainSize) {
      flexLine.crossSpace =
        style[crossSize] !== undefined ? style[crossSize] : crossSpace;
    } else {
      flexLine.crossSpace = crossSpace;
    }

    // 计算主轴
    if (mainSpace < 0) {
      // 只会发生在单行
      // 元素进行等比压缩
      const scale = style[mainSize] / style[mainSize] - mainSpace; // <1
      let currentMain = mainBase;
      for (const item of items) {
        itemStyle = getStyle(item);
        if (itemStyle.flex) {
          itemStyle[mainSize] = 0;
        }
        itemStyle[mainSize] = itemStyle[mainSize] * scale;
        itemStyle[mainStart] = currentMain;
        itemStyle[mainEnd] =
          itemStyle[mainStart] + mainSign * itemStyle[mainSize];
        currentMain = itemStyle[mainEnd];
      }
    } else {
      // process each flex line
      flexLines.forEach((flexLine) => {
        let mainSpace = flexLine.mainSpace;
        let flexTotal = 0;
        // 寻找flexTotal
        for (const item of items) {
          let itemStyle = getStyle(item);
          if (itemStyle.flex !== null && itemStyle.flex !== void 0) {
            flexTotal += itemStyle.flex;
            continue;
          }
        }

        if (flexTotal > 0) {
          // there is flexible flex items
          let currentMain = mainBase;
          for (const item of items) {
            let itemStyle = getStyle(item);
            if (itemStyle.flex) {
              itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
            }
            itemStyle[mainStart] = currentMain;
            itemStyle[mainEnd] =
              itemStyle[mainStart] + itemStyle[mainSize] * mainSign;
            currentMain = itemStyle[mainEnd];
          }
        } else {
          // there is **NO** flexible flex items, which means,justifycontent should work
          let step, currentMain;
          if (style.justifyContent === "flex-start") {
            currentMain = mainBase;
            step = 0;
          }
          if (style.justifyContent === "flex-end") {
            currentMain = mainSpace * mainSign + mainBase;
            step = 0;
          }
          if (style.justifyContent === "center") {
            currentMain = (mainSpace / 2) * mianSign + mainBase;
            step = 0;
          }
          if (style.justifyContent === "space-between") {
            currentMain = mainBase;
            step = (mainSpace / (items.length - 1)) * mainSign;
          }
          if (style.justifyContent === "space-around") {
            step = (mainSpace / items.length) * mainSign;
            currentMain = step / 2 + mainBase;
          }
          for (const item of items) {
            let itemStyle = getStyle(item);
            itemStyle[mainStart] = currentMain;
            itemStyle[mainEnd] =
              itemStyle[mainStart] + mainSign * itemStyle[mainSize];
            currentMain = itemStyle[mainEnd] + step;
          }
        }
      });
    }

    // 计算交叉轴 compute the cross axis sizes
    // align-content; align-item; align-self
    if (!style[crossSize]) {
      // auto sizing
      crossSpace = 0;
      style[crossSize] = 0;
      for (const flexLine of flexLines) {
        style[crossSize] = style[crossSize] + flexLine.crossSpace;
      }
    } else {
      crossSpace = style[crossSize];
      for (const flexLine of flexLines) {
        crossSpace -= flexLine.crossSpace;
      }
    }
    if (style.flexWrap === "wrap-reverse") {
      crossBase = style[crossSize];
    } else {
      crossBase = 0;
    }

    let step;
    if (style.alignContent === "flex-start") {
      crossBase += 0;
      step = 0;
    }
    if (style.alignContent === "flex-end") {
      crossBase += crossSign * crossSpace;
      step = 0;
    }
    if (style.alignContent === "center") {
      crossBase += (crossSign * crossSpace) / 2;
      step = 0;
    }
    if (style.alignContent === "space-between") {
      crossBase += 0;
      step = crossSpace / (flexLines.length - 1);
    }
    if (style.alignContent === "space-around") {
      step = crossSpace / flexLines.length;
      crossBase += (crossSign * step) / 2;
    }
    if (style.alignContent === "stretch") {
      crossBase += 0;
      step = 0;
    }
    flexLines.forEach((items) => {
      let lineCrossSize =
        style.alignContent === "stretch"
          ? items.crossSpace + crossSpace / flexLines.length
          : items.crossSpace;
      for (const item of items) {
        let itemStyle = getStyle(item);
        // align-self > align-items
        let align = itemStyle.alignSelf || style.alignItems;
        if (itemStyle[crossSize] === null || itemStyle[crossSize] === void 0)
          itemStyle[crossSize] = align === "stretch" ? lineCrossSize : 0;

        if (align === "flex-start") {
          itemStyle[crossStart] = crossBase;
          itemStyle[crossEnd] =
            itemStyle[crossStart] + crossSign * itemStyle[crossSize];
        }
        if (align === "flex-end") {
          itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
          itemStyle[crossStart] =
            itemStyle[crossEnd] - crossSize * itemStyle[crossSize];
        }
        if (align === "center") {
          itemStyle[crossStart] =
            crossBase +
            (crossSign * (lineCrossSize - itemStyle[crossSize])) / 2;
          itemStyle[crossEnd] =
            itemStyle[crossStart] + crossSign * itemStyle[crossSize];
        }
        if (align === "strech") {
          itemStyle[crossStart] = crossBase;
          itemStyle[crossEnd] =
            crossBase +
            crossSign *
              (itemStyle[crossSize] !== null &&
                itemStyle[crossSize] !== void 0);
          itemStyle[crossSize] =
            crossSign * (itemStyle[crossEnd] - itemStyle[crossStart]);
        }
        crossBase += crossSign * (lineCrossSize + step);
      }
    });
  }
  // console.log(flexLines);
}

function getStyle(element) {
  if (!element.style) {
    element.style = {};
  }

  // console.log('-----style----')
  for (const prop in element.computedStyle) {
    // console.log(prop)
    element.style[prop] = element.computedStyle[prop].value;
    // 'XXpx' 转换成数字
    if (element.style[prop].toString().match(/px$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
    // 纯数字转换类型
    if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
  }
  return element.style;
}

module.exports = layout;
