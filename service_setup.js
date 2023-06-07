const { Service } = require('node-windows')

const svc = new Service({
  name: 'Backend Tasks',
  script: require('path').join(__dirname, 'main.js'),
})

svc.on('install', () => {
  svc.start()
})

svc.on('uninstall', () => {
  console.log('Uninstall complete.')
  console.log('The service exists: ', svc.exists)
})

svc.install()

// svc.uninstall()
