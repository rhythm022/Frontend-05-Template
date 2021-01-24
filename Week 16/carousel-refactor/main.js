import { h } from './vue';



import { Carousel } from './Carousel';
let d = [
  { img: 'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg', url: 'https://time.geekbang.org/' },
  { img: 'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg', url: 'https://time.geekbang.org/' },
  { img: 'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg', url: 'https://time.geekbang.org/' },
  { img: 'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg', url: 'https://time.geekbang.org/' },
];
let a = <Carousel id="a"
  src={d}
  onChange={(event) => console.log(event.detail.position)}
  onClick={(event) => window.location.href = event.detail.data.url}
></Carousel>;

a.mountTo(document.body);




/*
import {Button}from './Button'


let b = <Button>
  content
</Button>


b.mountTo(document.body);
*/


/*
import { List } from './List'

let d = [
  { img: 'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg', url: 'https://time.geekbang.org/', title: '1' },
  { img: 'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg', url: 'https://time.geekbang.org/', title: '2' },
  { img: 'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg', url: 'https://time.geekbang.org/', title: '3' },
  { img: 'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg', url: 'https://time.geekbang.org/', title: '4' },
];
let b = <List data={d}>
  {
    (record) => (
      <div>
        <img src={record.img} />
        <a href={record.url}>{record.title}</a>
      </div>
    )
  }
</List>


b.mountTo(document.body);
*/