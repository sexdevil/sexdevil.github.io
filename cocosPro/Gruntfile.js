module.exports = function (grunt) {
  var root = process.cwd() + "/";

var moduleMap = require('./moduleConfig.json').module;


  var jsAddedCache;
  jsAddedCache = {};
  var jsList = ['cocos2d/CCBoot.js'];

  jsList = jsList.concat(getJsListOfModule(moduleMap, 'cocos2d', ''));
   console.log(jsList)
  
    grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: '',
        stripBanners:true
      },
      dist: {
        src: ['src/*.js'],
        dest: 'dest/main.js'
      },
      cocos:{
          src:jsList,
          dest:'dest/cocos2d.js'
      }
    },
    watch: {
  scripts: {
    files: ['src/*.js'],
    tasks: ['concat'],
    options: {
      spawn: false,
    },
  },
},
  projectRoot: root



  });
  




function getJsListOfModule(moduleMap, moduleName, dir) {
  if (jsAddedCache[moduleName])
    return null;
  dir = dir || "";
  var jsList = [];
  var tempList = moduleMap[moduleName];
  if (!tempList)
    throw "can not find module [" + moduleName + "]";
  for (var i = 0, li = tempList.length; i < li; i++) {
    var item = tempList[i];
    if (jsAddedCache[item])
      continue;
    var ext = extname(item);
    if (!ext) {
      var arr = getJsListOfModule(moduleMap, item, dir);
      if (arr)
        jsList = jsList.concat(arr);
    }
    else if (ext.toLowerCase() == ".js")
      jsList.push(join(dir, item));
    jsAddedCache[item] = 1;
  }
  return jsList;
}
  
  function extname(pathStr) {
  var temp = /(\.[^\.\/\?\\]*)(\?.*)?$/.exec(pathStr);
  return temp ? temp[1] : null;
}

function join() {
  var l = arguments.length;
  var result = "";
  for (var i = 0; i < l; i++) {
    result = (result + (result == "" ? "" : "/") + arguments[i]).replace(/(\/|\\\\)$/, "");
  }
  return result;
};
  
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // 默认任务
  grunt.registerTask('default', ['concat']);
};