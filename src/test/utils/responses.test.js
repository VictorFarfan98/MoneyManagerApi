const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const responses = require('../../utils/responses')

chai.use(sinonChai)
chai.should()

describe('utils/responses', () => {
  afterEach(() => {
    sinon.restore()
  })

  // Use fake token generator from api user for this test case
  context('webResponse', () => {
    it('should return a success response', (done) => {
      // Arrange
      // Act
      let result = responses.webResponse(true, { message: 'success message' }, false)

      // Assert
      result.success.should.equal(true)
      result.should.have.property('payload')
      done()
    })

    it('should return an error response with false as token parameter', (done) => {
      // Arrange
      // Act
      let result = responses.webResponse(false, { message: 'error message' }, false)

      // Assert
      result.success.should.equal(false)
      result.should.have.property('error')
      result.token.should.equal(false)
      done()
    })

    it('should return an error response with true as token parameter', (done) => {
      // Arrange
      // Act
      let result = responses.webResponse(false, { message: 'error message' }, true)

      // Assert
      result.success.should.equal(false)
      result.should.have.property('error')
      result.token.should.equal(true)
      done()
    })
  })
})
