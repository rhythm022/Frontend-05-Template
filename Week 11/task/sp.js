/**
 * 请写出下面选择器的优先级： [inline id class tag]
 * div#a.b .c[id=x] 0 1 3 1 
 * #a:not(#b)       0 2 0 0 
 * *.a              0 0 1 0 
 * div.a            0 0 1 1
 */

const n = 256 ** 2;

let se = [
    {
        selectors: 'div#a.b .c[id=x]',
        sp: (0 * n ** 3) + (1 * n ** 2) + (3 * n ** 1) + 1,
    },
    {
        selectors: '#a:not(#b)',
        sp: (0 * n ** 3) + (2 * n ** 2) + (0 * n ** 1) + 0,
    },
    {
        selectors: '*.a',
        sp: (0 * n ** 3) + (0 * n ** 2) + (1 * n ** 1) + 0,
    },
    {
        selectors: 'div.a',
        sp: (0 * n ** 3) + (0 * n ** 2) + (1 * n ** 1) + 1,
    },
];

const max = se.sort((a, b) => b.sp - a.sp)[0].selectors;
console.log(max);
