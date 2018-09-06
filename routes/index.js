var express = require('express');
var router = express.Router();

var async = require('async');
var Web3 = require('web3');


router.get('/', function(req, res, next) {
  let currentPageNumber = req.query.page ? Number(req.query.page): 1; // check the GET parameter, 'page'
  let latestNumber;
  
  var config = req.app.get('config');  
  var web3 = new Web3();
  web3.setProvider(config.provider);
  
  async.waterfall([
    function(callback) {
      web3.eth.getBlock("latest", false, function(err, result) {
        callback(err, result);
      });
    }, function(lastBlock, callback) {
      var blocks = [];
      
      var blockCount = config.blocksPerPage;
      latestNumber = lastBlock.number
      let latestNumberOnthePage = latestNumber - (currentPageNumber - 1) * blockCount;
      
      if (latestNumberOnthePage - blockCount < 0) { 
        blockCount = latestNumberOnthePage + 1;
      }
      
      async.times(blockCount, function(n, next) {
        web3.eth.getBlock(latestNumberOnthePage - n, true, function(err, block) { // error handling
          next(err, block);
        });
      }, function(err, blocks) { // got all blocks
        callback(err, blocks);
      });
    }
  ], function(err, blocks) {
    if (err) {
      return next(err);
    }
    
    var txs = [];
    blocks.forEach(function(block) {
      block.transactions.forEach(function(tx) {
        if (txs.length === config.limitTransactions) {
          return;
        }
        txs.push(tx);
      });
    });
    res.render('index', {
      blocks: blocks, txs: txs, currentPageNumber: currentPageNumber, 
      pages: Math.ceil(latestNumber / config.blocksPerPage), pagesFromMe: config.pagesFromMe});
  });
  
});

module.exports = router;
