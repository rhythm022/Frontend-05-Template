import assert from "assert";
import { parseHTML } from "../src/parser";

describe("parse flex:", () => {
  it("<style>.flex{display:flex;height:100;width:100px}.item{width:100px}</style><div class='flex'><div class='item'></div><div class='item'></div></div>", () => {
    let tree = parseHTML(
      "<style>.flex{display:flex;height:100;width:100px}.item{width:100px}</style><div class='flex'><div class='item'></div><div class='item'></div></div>"
    );
    assert.equal(tree.children.length, 2);
  });
  it("<style>.flex{display:flex;flexDirection:row-reverse;justifyContent:flex-end;alignContent:flex-end;alignItems:flex-end}</style><div class='flex'><div class='item'></div></div>", () => {
    let tree = parseHTML(
      "<style>.flex{display:flex;flexDirection:row-reverse;justifyContent:flex-end;alignContent:flex-end;alignItems:flex-end}</style><div class='flex'><div class='item'></div></div>"
    );
    assert.equal(tree.children.length, 2);
  });
  it("<style>.flex{display:flex;flexDirection:cloumn;flexWrap:wrap-reverse;justifyContent:space-between;alignContent:center;}</style><div class='flex'><div class='item'></div></div>", () => {
    let tree = parseHTML(
      "<style>.flex{display:flex;flexDirection:cloumn;flexWrap:wrap-reverse;justifyContent:space-between;alignContent:center;}</style><div class='flex'><div class='item'></div></div>"
    );
    assert.equal(tree.children.length, 2);
  });
  it("<style>.flex{display:flex;flexDirection:cloumn-reverse;justifyContent:space-around;alignContent:space-between;}</style><div class='flex'><div class='item'></div></div>", () => {
    let tree = parseHTML(
      "<style>.flex{display:flex;flexDirection:cloumn-reverse;justifyContent:space-around;alignContent:space-between;}</style><div class='flex'><div class='item'></div></div>"
    );
    assert.equal(tree.children.length, 2);
  });
  it("<style>.flex{display:flex;flexDirection:wrap-reverse;alignContent:space-around;}</style><div class='flex'><div class='item'></div></div>", () => {
    let tree = parseHTML(
      "<style>.flex{display:flex;flexDirection:wrap-reverse;alignContent:space-around;}</style><div class='flex'><div class='item'></div></div>"
    );
    assert.equal(tree.children.length, 2);
  });
  it("<style>.flex{display:flex;flexDirection:wrap-reverse;alignContent:stretch;}</style><div class='flex'><div class='item'></div></div>", () => {
    let tree = parseHTML(
      "<style>.flex{display:flex;flexDirection:wrap-reverse;alignContent:stretch;}</style><div class='flex'><div class='item'></div></div>"
    );
    assert.equal(tree.children.length, 2);
  });
});
describe("parse style:", () => {
  it("<style></style>", () => {
    let tree = parseHTML("<style></style>");
    assert.equal(tree.children[0].tagName, "style");
  });
  it("<style>#id{color:#fff;}</style><div id='id'></div>", () => {
    let tree = parseHTML("<style>#id{color:#fff;}</style><div id='id'></div>");
    assert.equal(tree.children.length, 2);
  });
  it("<style>div{color:#fff;}</style><div></div>", () => {
    let tree = parseHTML("<style>div{color:#fff;}</style><div></div>");
    assert.equal(tree.children.length, 2);
  });
  it("<style>div{color:#fff;} #id{color:#000;} .class{color:#f00;}</style><div id='id' class='class' style='color:#00f'></div>", () => {
    let tree = parseHTML(
      "<style>div{color:#fff;} #id{color:#000;} .class{color:#f00;}</style><div id='id' class='class' style='color:#00f'></div>"
    );
    assert.equal(tree.children.length, 2);
  });
});
describe("parse html:", () => {
  it("<a></a>", () => {
    let tree = parseHTML("<a></a>");
    assert.equal(tree.children[0].tagName, "a");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });
  it("<a ></a>", () => {
    let tree = parseHTML("<a ></a>");
    assert.equal(tree.children[0].tagName, "a");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });
  it("<>", () => {
    let tree = parseHTML("<>");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].type, "text");
  });

  it("<a />", () => {
    let tree = parseHTML("<a />");
    assert.equal(tree.children[0].tagName, "a");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });
  it("<a/>", () => {
    let tree = parseHTML("<a/>");
    assert.equal(tree.children[0].tagName, "a");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });
  it("<a />", () => {
    let tree = parseHTML("<a />");
    assert.equal(tree.children[0].tagName, "a");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });
  it("<a href='//geektime.org'></a>", () => {
    let tree = parseHTML("<a href='//geektime.org'></a>");
    assert.equal(tree.children[0].tagName, "a");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });
  it("<a href='//geektime.org'/>", () => {
    let tree = parseHTML("<a href='//geektime.org'/>");
    assert.equal(tree.children[0].tagName, "a");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });
  it('<a href="hello"></a>', () => {
    let tree = parseHTML('<a href="hello"></a>');
    assert.equal(tree.children[0].tagName, "a");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });
  it('<a href="hello"/>', () => {
    let tree = parseHTML('<a href="hello"/>');
    assert.equal(tree.children[0].tagName, "a");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });
  it("<a id=hello></a>", () => {
    let tree = parseHTML("<a id=hello></a>");
    assert.equal(tree.children[0].tagName, "a");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });
  it("<a id=hello/>", () => {
    let tree = parseHTML("<a id=hello/>");
    assert.equal(tree.children[0].tagName, "a");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });
  it('<a href="hello" id></a>', () => {
    let tree = parseHTML('<a href="hello" id></a>');
    assert.equal(tree.children[0].tagName, "a");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });
  it("<a href id></a>", () => {
    let tree = parseHTML("<a href id></a>");
    assert.equal(tree.children[0].tagName, "a");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });
  it("<a href ></a>", () => {
    let tree = parseHTML("<a href ></a>");
    assert.equal(tree.children[0].tagName, "a");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });
  it("<a href/>", () => {
    let tree = parseHTML("<a href/>");
    assert.equal(tree.children[0].tagName, "a");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });
  it("<a>123</a>", () => {
    let tree = parseHTML("<a>123</a>");
    assert.equal(tree.children[0].tagName, "a");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 1);
  });
});
