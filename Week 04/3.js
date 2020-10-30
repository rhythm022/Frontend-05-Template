function kmp(source, pattern) {//source主串
  let front = new Array(pattern.length).fill(0);

  {
    let j = 0, i = 1;// j指针指向头部待匹配字符

    while (i < pattern.length) {
      if (pattern[i] === pattern[j]) {// 如果i对应的字符匹配j，i/j都换下一个字符，并且，建立下个字符的i到j的映射
        ++i;
        ++j;
        front[i] = j;
      } else {// 如果i对应的字符不匹配j，
        if (j > 0)
          j = front[j]; // front[j]指向头部中自重复的后部开头
        else
          ++i;
      }
    }
  }

  {
    let i = 0, j = 0; // j指针用于模式串，i指针用于主串
    while (i < source.length) {
     if(pattern[j] === source[i]){
        ++i;++j
      }
      else{
        if (j > 0)
          j = front[j];
        else
          ++i;
      }

      if(j === pattern.length)
        return true
    }

    return false
  }

}


// abcd·abcd·abce·x
console.log(
    kmp('aabaabaaac','aabaaac')

)













































