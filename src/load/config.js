const fs = require('fs')
const Project = require('../components/Project')

let params = [ 'Auth0-JKSUri', 'Auth0-audience', 'Auth0-issuer', 
  'App-WIG-Validation-Message', 'App-Predictive-Validation-Message'
]

let dict = {}
let project = new Project()
let parameterCount = 0

function loadingData (callback) {
  console.debug('Loading data...')
  project.load(() => {
    // Try to get all the required params
    params.some(function (param) {
      console.debug(`Getting param ${param}`)
      let temp = project.getParameter(param)
      if (temp) {
        dict[param] = temp
        parameterCount++
      } else {
        callback(new Error('Unable to get ' + param))
      }
      // Calling callback
      if (parameterCount === params.length) {
        callback()
      }
      // stop if temp is undefined
      return temp === undefined
    })
  })
}

loadingData((err) => {
  if (err) {
    console.info(err.messag)
    process.exit(1)
  } else {
    fs.writeFileSync(`${__dirname}/config.json`, JSON.stringify(dict, null, 2))
  }
})
