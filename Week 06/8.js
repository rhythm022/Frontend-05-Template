
    function encodeUTF8(str) {
        const arr = []

        for (let i = 0; i < str.length; i++) {
            const point = str.charCodeAt(i)

            if (point < 128) {
                //0000 - 007f
                // 0   - 127 占用1字节
                arr.push(point)
            } else if (point < 2048) {
                // 0080 - 07ff
                // 110xxxxx 10xxxxxx
                arr.push((point >> 6) | 192) // 110 + 高5位
                arr.push((point & 63) | 128) // 10 + 低6位
            } else if (point <= 0xffff) {
                // 0800 - ffff
                // 1110xxxx 10xxxxxx 10xxxxxx
                arr.push((point >> 12) | 224) // 110 + 高4位
                arr.push((point >> 6) & 63 | 128) // 10 + 中6位
                arr.push((point & 63) | 128)// 10 + 低6位
            }

        }
        return Buffer.from(arr)
    }

    var str = '一二'
    console.log(
        encodeUTF8(str),
        Buffer.from(str,'utf8'),
    )