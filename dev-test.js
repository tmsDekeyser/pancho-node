const Block = require('./block.js');

const block = new Block('D-day', "0f0f0f0f0f0f", "1f1f1f1f1f", "This is a block yo");
console.log(block.toString());

const fooBlock = Block.mineBlock(Block.genisisBlock(), 'foo');
console.log(fooBlock.toString());
