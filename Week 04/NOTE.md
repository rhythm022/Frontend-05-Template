学习笔记


### 2.html
abcd·abce                      abcd·abce
abcd·abcd·abce·x          abcd·abcd·abce·x
主串和模式串共有模式串。模式串不动，主串往左移动。
KMP算法的精神是观察到了已匹配串的自重复行为，中后部存在与头部重复，这意味着主串中后部与模式串头部重复，使得下次匹配从主串中后部开始。
Q:计算机如何发现abcd·abce中中后部abc与头部abc的重复？
A:通过截去模式串头部，如对于模式串abcd·abce：
    abcd·abce
    bcd·abce
    cd·abce
    d·abce
    abce  // 截取后依次能匹配上a/b/c，即发现后部abc与模式串头部重复
    bce
    ce
    
Q:如何存储这种自重复行为？
A:创建一个与模式串长度相同的数组，对应abcd·abce：
后部b对应的空间记1，表明后部b为坏字符时，可从模式串索引位置为1的地方开始下次匹配
后部c对应的空间累加记2，表明后部c为坏字符时，可从模式串索引位置为2的地方开始下次匹配
后部e对应的空间累加记3，表明后部e为坏字符时，可从模式串索引位置为3的地方开始下次匹配


如对于模式串ab·ab·ab·c·x·ab·ab：
    ab·ab·ab·c·x·ab·ab // [0...]
    b·ab·ab·c·x·ab·ab //  [0...]
    ab·ab·c·x·ab·ab // 匹配上ab·ab [0,0,0,1,2,3,4,0,0,0,0,0]
    b·ab·c·x·ab·ab
    ab·c·x·ab·ab 
    b·c·x·ab·ab 
    c·x·ab·ab 
    x·ab·ab 
    ab·ab // 匹配上ab·ab [0,0,0,1,2,3,4,0,0,1,2,3]
    
    
    
    
### 4.Wildcard
ab*cd*abc*a?d应断句为：ab   *cd   *abc   *   a?d
    
    
    
    
    
    
    
    
    
    
    










