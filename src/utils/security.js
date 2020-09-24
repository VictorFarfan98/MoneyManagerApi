'use strict'
const CryptoJS = require('crypto-js')
const secret = `&>B+y?>(>48/OU90.kxDM>clp)G8D5=]S.?%3i[.z06oH65Y^r-4kZJ[0eNf.jU~z6]$QGDrg=>~W#D?<9)`
const shortSecret = `zUTy5MJ^MN?2%+U1`
const { dateAdd } = require('./dateAdd')

class Security {
  constructor () {
    this.customError = ''
    this.userId = 0
    this.userExtId = 'undefined'
  }

  validateNonceAES (nonce) {
    try {
      // Decripting the message in data array
      let bytes = CryptoJS.AES.decrypt(nonce, secret)
      let text = bytes.toString(CryptoJS.enc.Utf8)
      let data = text.split('|')
      let message = `${data[0]}|${data[1]}|${data[2]}|${data[3]}`
      let sha1 = CryptoJS.HmacSHA1(message, shortSecret)
      // Comparing the sha1
      if (`${JSON.stringify(sha1)}` === data[4]) {
        let expirationDate = dateAdd(new Date(data[2]), 'minute', data[3])
        let today = dateAdd(new Date().toUTCString(), 'minute', 0)
        if (expirationDate > today) {
          // Setting the user ids and external
          let userParsed = JSON.parse(data[0])
          this.userId = data[1]
          this.userExtId = `${userParsed.Provider}|${userParsed.ExtId}`
          return true
        } else {
          this.customError = 'Expired token, please log in again'
          return false
        }
      } else {
        this.customError = 'The token has been modified, please log in again'
        return false
      }
    } catch (ex) {
      this.customError = 'There was an error with the access token, please log in again'
      return false
    }
  }
}

module.exports = new Security()
