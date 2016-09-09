module.exports = class parser() {
  constructor(dir,version,extra,data,dev) {
    this.dir = dir;
    this.dev = dev
    this.version = version;
    this.extra = extra;
    this.plugins = [];
    this.data = data;
    this.pdata = {};
  }
  getExtra(p) {
    if (!this.extra) return;
    this.extra.forEach((extra)=>{
      if (!p[extra]) return;
      this.pdata[extra].concat(p[extra]);
    })
  }
  checkDir() {
     if (!fs.existsSync(this.dir)) {
    fs.mkdir(this.dir);
  }
  }
  isPlugin(file) {
    try {
    var a = fs.readFileSync(file,"utf8")
    
    catch(e) {
      console.log("Plugin " + file + " couldnt be loaded because file is inaccesable")
    }
    try {
    var b = require(a);
    if (!b.pluginData) {
      console.log("Plugin " + file + " couldnt be loaded because it is missing the plugin data")
    return false;  
    }
    if (!b.init) {
      console.log("Plugin " + file + " couldnt be loaded because it is missing the init() function")
      return false;
    }
    if (b.pluginData.minVersion && this.version && b.pluginData.minVersion.replace(/\./g,'') < this.version.replace(/\./g,'')) {
      console.log("plugin " + file + " couldnt be loaded because it is not compatable with version " + this.version)
      return false;
    }
    return b;
    } catch (e) {
     console.log("Plugin " + file + " couldnt be loaded because the code has errors;")
    }
    return false;
  }
  dispMsg(v,file) {
    var name = (v.pluginData.name) ? v.pluginData.name : file;
    var author = (v.pluginData.author) ? v.pluginData.author : "Unknown";
    var version = (v.pluginData.version) ? v.pluginData.version : "1.0.0"
    console.log("Loaded plugin " + name + " by " + author + " v" + version)
  }
  prepare() {
    this.plugins = {};
    this.pdata = {};
     if (!this.extra) return;
    this.extra.forEach((extra)=>{
     this.pdata[extra] = []; 
    }
  }
  parse() {
    this.prepare()
    this.checkDir()
    var files = fs.readdirSync(this.dir + "/");
    for (var i in files) {
      var file = this.dir + "/" + files[i] + "/index.js";
      var v = this.isPlugin(file);
     if (!v) continue
     v.init(this.data);
     this.getExtra(v);
     this.plugins[files[i]] = v;
     var g = (v.pluginData.saveAs) ? v.pluginData.saveAs : files[i]
     this.dispMsg(v,g)
    }
  }
  
}
