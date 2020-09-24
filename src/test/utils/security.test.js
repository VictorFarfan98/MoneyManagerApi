const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const rewire = require('rewire')
const security = rewire('../../utils/security')

const CryptoJS = require('crypto-js')

chai.use(sinonChai)

describe('utils/security', () => {
  afterEach(() => {
    sinon.restore()
  })

  // Use fake token generator from api user for this test case
  context('validateNoceAES', () => {
    it('Should throw exception validating nonce', (done) => {
      // Arrange
      let cryptoJSStub = sinon.stub(CryptoJS.AES, 'decrypt').throws()
      security.__set__('CryptoJS.AES.decrypt', cryptoJSStub)

      // Act
      let secTest = security.validateNonceAES('U2FsdGVkX1+Y6tHorOnvmnnjUztysSQjEyO7soBUKxT+SmFCXm4wcpWuUWGUFqTsQvUrJBYjtEwO80afwcetxmujCWP3kc74DnwfTBgKHGq7e/km8SKRohRuWB/obR60YcMOYKuqlwQ1SsA2+IauREQyx+JqLeK5KGyWDIUoKdLGd1aLe2FqjMvjx8JKl9mOv/8hce0GiSA8mx1evVv9955BraytKTSUZXEqs7Ngs5f9qq3xjFRfwgEmtlhXmCZw')

      // Assert
      expect(secTest).to.be.false
      done()
    })

    it('Should validate nonce', (done) => {
      // Arrange
      // Act
      let secTest = security.validateNonceAES('U2FsdGVkX1+Y6tHorOnvmnnjUztysSQjEyO7soBUKxT+SmFCXm4wcpWuUWGUFqTsQvUrJBYjtEwO80afwcetxmujCWP3kc74DnwfTBgKHGq7e/km8SKRohRuWB/obR60YcMOYKuqlwQ1SsA2+IauREQyx+JqLeK5KGyWDIUoKdLGd1aLe2FqjMvjx8JKl9mOv/8hce0GiSA8mx1evVv9955BraytKTSUZXEqs7Ngs5f9qq3xjFRfwgEmtlhXmCZw')

      // Assert
      expect(secTest).to.be.true
      done()
    })

    it('Should give expired token message', (done) => {
      // Arrange
      // Act
      let fakeToken = security.validateNonceAES('U2FsdGVkX1+YBMNQNjssbfsmcqmJIyouowkWZap/5WIUPcDlC9e3XLBV0rhL9qkj3hUUHzLsFOjdkSRXK/jfofqEYnNJb0KWfNFcRBt3Dd2S9OH94DqYGuKpSKLCfbGxQ6NiiHQcsBz6ZttYyx+Pe2ihyoieb/WbgbRVzFBAwMV1a55JeOFaXS8/9+RKBCTx8rorzS25UuBPdFH9Ibz+a5G1e0kTWh64MULY0QkWXhg=')

      // Assert
      expect(fakeToken).to.be.false
      expect(security.customError).to.be.equal('Expired token, please log in again')
      done()
    })

    it('Should five token modified error', (done) => {
      // Arrange
      // Act
      let fakeToken = security.validateNonceAES('askdfjks')

      // Assert
      expect(fakeToken).to.be.false
      expect(security.customError).to.be.equal('The token has been modified, please log in again')
      done()
    })
  })
})
