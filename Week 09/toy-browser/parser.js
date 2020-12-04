const EOF = Symbol('EOF')

function data(c){
  if(c === '<'){// 找到了<
    return tagOpen
  }
  else if(c === EOF){//html为''或一直没找到<
    return
  }
  else{
    return data//继续找<
  }
}

function tagOpen(c){
  if(c === '/'){
    return endTagOpen // endTag Open
  }
  else if(c.match(/^[a-zA-Z]$/)){
    return tagName(c) //resume
  }
  else {
    // 处理attribute
    return
  }
}


function endTagOpen(c){
  if(c.match(/^[a-zA-Z]$/)){
    return tagName(c)
  }else if(c === '>'){
    // 报错
  }else if(c === EOF){
    //全文结束
  }else{

  }
}

module.exports.parseHTML = function parseHTML(html){
  let state = data

  for(let char of html){
    state = state(char)
  }
  state = state(EOF)
}
