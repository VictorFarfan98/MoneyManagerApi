const rewire = require('rewire')
const expect = require('chai').expect
const should = require('chai').should()
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const sinon = require('sinon')
const { dateAdd } = require('../../utils/dateAdd')

chai.use(chaiAsPromised)
chai.should()

describe('utils/dateAdd', function () {
  beforeEach(function () {
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('dateAdd', function () {
    it('add Years', function (done) {
      // Arrange
      let originalDate = new Date('2015-03-25')
      let expectedDate = new Date('2018-03-25')

      // Act
      let result = dateAdd(originalDate, 'year', 3)

      // Assert
      result.should.deep.equal(expectedDate)
      done()
    })

    it('add Years - leap-year', function (done) {
      // Arrange
      let originalDate = new Date('2020-02-29')
      let expectedDate = new Date('2021-02-28')

      // Act
      let result = dateAdd(originalDate, 'year', 1)

      // Assert
      result.should.deep.equal(expectedDate)
      done()
    })

    it('add Quarter', function (done) {
      // Arrange
      let originalDate = new Date('2015-03-25')
      let expectedDate = new Date('2015-09-25')

      // Act
      let result = dateAdd(originalDate, 'quarter', 2)

      // Assert
      result.should.deep.equal(expectedDate)
      done()
    })

    it('add Month', function (done) {
      // Arrange
      let originalDate = new Date('2015-03-25')
      let expectedDate = new Date('2015-09-25')

      // Act
      let result = dateAdd(originalDate, 'month', 6)

      // Assert
      result.should.deep.equal(expectedDate)
      done()
    })

    it('add Weeks', function (done) {
      // Arrange
      let originalDate = new Date('2015-03-02')
      let expectedDate = new Date('2015-03-16')

      // Act
      let result = dateAdd(originalDate, 'week', 2)

      // Assert
      result.should.deep.equal(expectedDate)
      done()
    })

    it('add Days', function (done) {
      // Arrange
      let originalDate = new Date('2015-03-02')
      let expectedDate = new Date('2015-03-16')

      // Act
      let result = dateAdd(originalDate, 'day', 14)

      // Assert
      result.should.deep.equal(expectedDate)
      done()
    })

    it('add Hours', function (done) {
      // Arrange
      let originalDate = new Date('2015-03-25T10:00:00Z')
      let expectedDate = new Date('2015-03-25T18:00:00Z')

      // Act
      let result = dateAdd(originalDate, 'hour', 8)

      // Assert
      result.should.deep.equal(expectedDate)
      done()
    })

    it('add Minutes', function (done) {
      // Arrange
      let originalDate = new Date('2015-03-25T10:00:00Z')
      let expectedDate = new Date('2015-03-25T12:00:00Z')

      // Act
      let result = dateAdd(originalDate, 'minute', 120)

      // Assert
      result.should.deep.equal(expectedDate)
      done()
    })

    it('add Seconds', function (done) {
      // Arrange
      // originalDate = '2015-03-25T10:00:00Z'
      let expectedDate = new Date('2015-03-25T11:00:00Z')

      // Act
      let result = dateAdd('2015-03-25T10:00:00Z', 'second', 3600)

      // Assert
      result.should.deep.equal(expectedDate)
      done()
    })

    it('add error', function (done) {
      // Arrange
      let originalDate = new Date('2015-03-25T10:00:00Z')

      // Act
      let result = dateAdd(originalDate, 'fake', 3600)

      // Assert
      should.not.exist(result)
      done()
    })
  })
})
