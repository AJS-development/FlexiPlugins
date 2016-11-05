var fs = require('fs')
module.exports = {
compile: function(folder){
  var final = "";
    var len = 0;
    var toWrite = [];
  
   var glob = false;
var walk= function(path) {
    if (!glob) {
      glob = path
      path = ""
    } 
  if( fs.existsSync(glob + path) ) {
    fs.readdirSync(glob + path).forEach(function(file,index){
      var curPath = glob + path + "/" + file;
        var sdir = path + "/" + file
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        walk(sdir);
      } else {
          
        parseFile(curPath,sdir);
      }
    });
    
  }
};
function append(num) {
   
    final += num.toString() + " "
    
}
  function parseFile(dir,sdir) {
    //  console.log(dir)
      var file = fs.readFileSync(dir,'utf8')
      if (!file || !dir || !sdir) return
  append(0)   
  
 for (var i = 0; i < sdir.length; i ++) {
    
     
     append(sdir.charCodeAt(i))
 }
      append(0)   
      for (var i = 0; i < file.length; i ++) {
     append(file.charCodeAt(i))
 }
  }
    walk(folder);
    
   return final
},
decompile: function(text,savedir) {
    text = text.split(" ")
    var toggle = false;
    var a = [];

var dir = ""
    for (var i = 0; i < text.length; i ++) {
        var char = parseInt(text[i])
        if (char == 0) {
            if (toggle) {
                
                dir = a.join("")
                a = [];
            } else {
            if (dir.length > 0) {
                var d = dir.split("/")
                var p = d.slice(0,d.length - 1).join("/")
                try {
                    
                    
                    fs.statSync(savedir + p)
                    
                } catch (e) {
                    console.log(e)
                    if (p) fs.mkdirSync(savedir + p)
                
                }
         
               if (dir) fs.writeFileSync(savedir + dir,a.join(""))
            }
                a = [];
                }
            toggle = !toggle
            continue;
        }
        a.push(String.fromCharCode(char))
    }
    if (a.length > 0) {
               if (dir) fs.writeFileSync(savedir + dir,a.join(""))
            }
    a = [];
    
    
}
}
