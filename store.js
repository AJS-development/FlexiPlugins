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
  search(a) {
    var title = [];
    var desc = [];
    var others = []
    this.list.forEach((item)=>{
      if (item.name) {
        var b = item.name.toLowerCase();
        if (b.indexOf(a.toLowerCase()) != -1) {
          title.push(item)
          return;
        }
      }
      if (item.description) {
        if (item.description.toLowerCase().indexOf(a.toLowerCase()) != -1) {
         desc.push(item) 
        return;
        }
      }
      var b = a.split(" ")
      var f = 0;
      b.every((c)=>{
        if (f > 5) {
          others.push(item)
        return false;
          
        }
        if (item.title && item.title.toLowerCase().indexOf(c.toLowerCase()) != -1) {
          f += 2;
        return true;
        }
        if (item.description && item.description.toLowerCase().indexOf(c.toLowerCase()) != -1) {
         f ++;
         return true;
        }
      })
      
      
    })
    var final = [];
    final.concat(title);
    final.concat(desc);
    final.concat(others);
    return final
    
  }
  
}
