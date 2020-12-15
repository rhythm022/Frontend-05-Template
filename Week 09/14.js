function specificity(selector) {
  const point = [0,0,0,0];

  const selectorParts = selector.split(' ').filter(p => p.length);

  for (const part of selectorParts) {// part为复合选择器
    const ps = part.split(/([#\.]\w+)/).filter(x => x.length);

    for(let p of ps){
      if(p.charAt(0) === '#'){
        console.log('有一个id选择器：',p);
        point[1] += 1
      }
      else if(p.charAt(0) === '.'){
        console.log('有一个class选择器：',p);

        point[2] += 1
      }
      else{
        console.log('有一个tagName选择器：',p);
        point[3] += 1
      }
    }
  }

  return point
}

console.log(
    specificity('div#id.class3.class2 div.class1#id')

);
