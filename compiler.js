var fs = require('fs')

module.exports = function(folder){
  var final;
    var len = 0;
    var toWrite = [];
var walk= function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        path(curPath);
      } else {
        parseFile(curPath);
      }
    });
    
  }
};
  
  function parseFile(dir) {
      var buf = fs.readFileSync(dir,'utf8')
      len += buf.length*2 + 2 + dir.length*2
      
    toWrite.push({b:buf,f:dir})
  }
    var offset = 0;
  final = new ArrayBuffer(len + 1)
  var view= new DataView(buf)
  for (var i in toWrite) {
      
      var write = toWrite[i]
       view.setUint8(0, 0);
      offset ++;
      for (var j =0;j< write.f.length;j++) {
          var char = write.f.charCodeAt(j);
          view.setUint8(offset, char);
          offset ++;
      }
      view.setUint8(0, 0);
      offset ++;
      for (var j =0;j< write.b.length;j++) {
          var char = write.b.charCodeAt(j);
          view.setUint8(offset, char);
          offset ++;
      }
     
      
  }
    view.setUint8(offset,1)
    return String.fromCharCode.apply(null, new Uint16Array(final));
    
}

module.exports = function(str) {
     var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
    var view = new DataView(buf)
    
    var offset = 0;
    var char;
    var data = [];
    var a = "";
    var current = false
  
    var toggle = false
while (1==1) {
    char = view.getUint8(offset)
    offset ++;
    
    
    if (char ==  0) {
        if (toggle) {
            if (current) current.d = a
            
        
        } else {
       if (current) current.b = a
     current = {
        d: '',
        b: ''
    }
   
     data.push(current)
        }
          a = ""
        toggle = !toggle
        continue;
    }
    if (char == 1) {
        if (current) current.b = a
        break;
    }
      a += String.fromCharCode(char)
}
    return data
}
