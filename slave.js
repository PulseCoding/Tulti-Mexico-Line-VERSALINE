var Service = require('node-windows').Service


var svc = new Service({
  name:'PULSE VERSALINE SERVICE',
  description: 'Control of the PULSE code',
  script: __dirname + '\\mex-tul-line-Varsaline.js',
  env: {
    name: "HOME",
    value: process.env["USERPROFILE"]
  }
})


svc.on('install',function(){
  svc.start()
})

svc.install()
