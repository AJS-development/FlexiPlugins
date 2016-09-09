"use strict";
var request = require('request');
module.exports = class store {
  constructor(defaultr) {
    this.repos = [];
    this.default = defaultr
    this.list = [];
    this.compile();
  }
  checkifvalid(a) {
    return true
  }
  compile() {
    request(this.default + "/plugins.json",function (error, response, body) {
        if (!error && response.statusCode == 200) {
          if (!this.checkifvalid(body)) return;
          var a = JSON.parse(body);
          this.list.concat(a);
        }
    });
    this.repos.forEach((repo)=>{
       request(repo + "/plugins.json",function (error, response, body) {
        if (!error && response.statusCode == 200) {
          if (!this.checkifvalid(body)) return;
          var a = JSON.parse(body);
          this.list.concat(a);
        }
    });
    });
    
  }
  search() {
    
    
  }
  
}
