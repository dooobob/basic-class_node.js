console.log('myUtil.js started!');

// module.exports = "kimgura";
// module.exports = function() {};
// module.exports = ["김구라", "해골", "원숭이"];

var num = 1;
var name = '김구라';
var addr = '노량진';

var showData = function() {
    console.log(num + '|' + name + '|' + addr);
};

module.exports.num = num;
module.exports.nmae = name;
module.exports.addr = addr;
module.exports.showData = showData;
