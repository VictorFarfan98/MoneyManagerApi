const rewire = require('rewire')

const assert = require('assert')
const expect = require('chai').expect
const should = require('chai').should()
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const sinon = require('sinon')

const dashboard = rewire('../controllers/v1/dashboard')
const security = require('../utils/security')
const mySqlrepository = require('../services/opiRepository')

chai.use(chaiAsPromised)
chai.should()

let createError

describe('controllers/v1/dashboard', function () {
  beforeEach('this function is used to set up the default values for requests', function () {
    createError = dashboard.__get__('createError')
    createError = sinon.spy(createError)
    dashboard.__set__('createError', createError)
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('getStatsDataset0', function () {
    it('should return an internal server error response', function (done) {
      // Arrange
      let req = {
        params: {
          field: 'location'
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      let res = {}
      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').throws()
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset0(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(500)

      done()
    })

    it('should return an unauthorized response', function (done) {
      // Arrange
      let req = {
        params: {
          field: 'location'
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      let res = {}
      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(false)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset0(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(401)

      done()
    })

    it('should return a not found response', function (done) {
      // Arrange
      let req = {
        params: {
          field: 'fakeField'
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      let res = {
        json: sinon.spy()
      }
      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset0(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(404)

      done()
    })

    it('should return a internal server error for repository error', function (done) {
      // Arrange
      let req = {
        params: {
          field: 'location'
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset0').yields({ error: 'something went wrong' })
      dashboard.__set__('repository', mySqlrepository)

      var res = {}

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset0(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(500)
      expect(getStatsDataSetStub).to.be.calledOnce

      done()
    })

    it('should return a internal server error for unexpected response from repository', function (done) {
      // Arrange
      let req = {
        params: {
          field: 'location'
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      const successResponse = 'unexpected response'

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset0').yields(null, successResponse)
      dashboard.__set__('repository', mySqlrepository)

      var res = {}

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset0(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(500)
      expect(getStatsDataSetStub).to.be.calledOnce

      done()
    })

    it('should return a success response', function (done) {
      // Arrange
      let req = {
        params: {
          field: 'location'
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      const successResponse = [
        [
          {
            'location': 'AltaVerapaz',
            'count': 205
          },
          {
            'location': 'BajaVerapaz',
            'count': 96
          },
          {
            'location': 'Chimaltenango',
            'count': 247
          }
        ]
      ]

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset0').yields(null, successResponse)
      dashboard.__set__('repository', mySqlrepository)

      var res = { json: testJson }

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset0(req, res, next)

      function testJson(response) {
        // Assert
        expect(securityStub).to.be.calledOnce
        next.calledOnce.should.be.false
        createError.calledOnce.should.be.false
        expect(getStatsDataSetStub).to.be.calledOnce

        // Validate response
        response.success.should.equal(true)
        response.should.have.property('payload')
        response.payload.header[0].should.equal('location')
        response.payload.location.length.should.equal(3)

        done()
      }
    })
  })

  describe('getStatsDataset1', function () {
    it('should return an internal server error response', function (done) {
      // Arrange
      let req = {
        params: {
          field: 'location'
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      let res = {}
      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').throws()
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset1(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(500)

      done()
    })

    it('should return an unauthorized response', function (done) {
      // Arrange
      let req = {
        params: {
          field: 'location'
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      let res = {}
      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(false)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset1(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(401)

      done()
    })

    it('should return a not found response', function (done) {
      // Arrange
      let req = {
        params: {
          field: 'fakeField'
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      let res = {
        json: sinon.spy()
      }
      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset1(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(404)

      done()
    })

    it('should return a internal server error for repository error', function (done) {
      // Arrange
      let req = {
        params: {
          field: 'location'
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset1').yields({ error: 'something went wrong' })
      dashboard.__set__('repository', mySqlrepository)

      var res = {}

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset1(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(500)
      expect(getStatsDataSetStub).to.be.calledOnce

      done()
    })

    it('should return a success response', function (done) {
      // Arrange
      let req = {
        params: {
          field: 'location'
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      const successResponse = [
        [
          {
            'location': ''
          },
          {
            'location': 'BajaVerapaz'
          },
          {
            'location': 'Chimaltenango'
          }
        ]
      ]

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset1').yields(null, successResponse)
      dashboard.__set__('repository', mySqlrepository)

      var res = { json: testJson }

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset1(req, res, next)

      function testJson(response) {
        // Assert
        expect(securityStub).to.be.calledOnce
        next.calledOnce.should.be.false
        createError.calledOnce.should.be.false
        expect(getStatsDataSetStub).to.be.calledOnce

        // Validate response
        response.success.should.equal(true)
        response.should.have.property('payload')
        response.payload.should.have.property('values')
        response.payload.values.length.should.equal(4)

        done()
      }
    })
  })

  describe('getStatsDataset2', function () {
    it('should return an internal server error response', function (done) {
      // Arrange
      let req = {
        params: {
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      let res = {}
      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').throws()
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset2(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(500)

      done()
    })

    it('should return an unauthorized response', function (done) {
      // Arrange
      let req = {
        params: {
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      let res = {}
      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(false)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset2(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(401)

      done()
    })

    it('should return a internal server error for repository error', function (done) {
      // Arrange
      let req = {
        params: {
          field: 'location'
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset2').yields({ error: 'something went wrong' })
      dashboard.__set__('repository', mySqlrepository)

      var res = {}

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset2(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(500)
      expect(getStatsDataSetStub).to.be.calledOnce

      done()
    })

    it('should return a success response', function (done) {
      // Arrange
      let req = {
        headers: {
          nonce: 'This is fake'
        }
      }

      const successResponse = [[
        { id: '-LnO2cja3zVFqnottSDb', name: 'Batres' },
        { id: '-LaVi3XTFBpSUBf6PyX2', name: 'Carnívoro' },
        { id: '-Lnmh0Ew552MSi9gEZlI', name: 'PARA BAILAR, PARA LLORAR.' }
      ]]

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset2').yields(null, successResponse)
      dashboard.__set__('repository', mySqlrepository)

      var res = { json: testJson }

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset2(req, res, next)

      function testJson(response) {
        // Assert
        expect(securityStub).to.be.calledOnce
        next.calledOnce.should.be.false
        createError.calledOnce.should.be.false
        expect(getStatsDataSetStub).to.be.calledOnce

        // Validate response
        response.success.should.equal(true)
        response.should.have.property('payload')
        response.payload.should.have.property('challenges')
        response.payload.challenges.length.should.equal(3)

        done()
      }
    })
  })

  describe('getStatsDataset3', function () {
    it('should return an internal server error response', function (done) {
      // Arrange
      let req = {
        params: {
          filters: 'eydjaGFsbGVuZ2UnOiBbIi0xcXdlbHJrbGxqYXNkIl19' // value: {'challenge': ["-1qwelrklljasd"]}
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      let res = {}
      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').throws()
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset3(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(500)

      done()
    })

    it('should return an unauthorized response', function (done) {
      // Arrange
      let req = {
        params: {
          filters: 'eydjaGFsbGVuZ2UnOiBbIi0xcXdlbHJrbGxqYXNkIl19' // value: {"gender"["female","male"]}
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      let res = {}
      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(false)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset3(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(401)

      done()
    })

    it('should return a bad request response', function (done) {
      // Arrange
      let req = {
        params: {
          filters: 'eydjaGFsbGVuZ2UnWyItMXF3ZWxya2xsamFzZCJdfQ==' // value: {'challenge'["-1qwelrklljasd"]}
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      let res = {
        json: sinon.spy()
      }
      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset3(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(400)

      done()
    })

    it('should return a internal server error for repository error', function (done) {
      // Arrange
      let req = {
        params: {
          filters: 'eydjaGFsbGVuZ2UnOiBbIi0xcXdlbHJrbGxqYXNkIl19' // value: {'challenge': ["-1qwelrklljasd"]}
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      const filterParam = { 'challenge': ["-1qwelrklljasd"] }

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset3').yields({ error: 'something went wrong' })
      dashboard.__set__('repository', mySqlrepository)

      var res = {}

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset3(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(500)
      expect(getStatsDataSetStub).to.be.calledOnce
      getStatsDataSetStub.getCall(0).args[0].should.deep.equal(filterParam)

      done()
    })

    it('should return a internal server error for unexpected response from repository', function (done) {
      // Arrange
      let req = {
        params: {
          filters: 'eydjaGFsbGVuZ2UnOiBbIi0xcXdlbHJrbGxqYXNkIl19' // value: {'challenge': ["-1qwelrklljasd"]}
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      const filterParam = { 'challenge': ["-1qwelrklljasd"] }

      const successResponse = 'fake response'

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset3').yields(null, successResponse)
      dashboard.__set__('repository', mySqlrepository)

      var res = {}

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset3(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(500)
      expect(getStatsDataSetStub).to.be.calledOnce
      getStatsDataSetStub.getCall(0).args[0].should.deep.equal(filterParam)

      done()
    })

    it('should return a success response without filters', function (done) {
      // Arrange
      let req = {
        params: {
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      const successResponse = [[
        { question: '¿En que tipo de situación es mejor comer embutidos?' },
        { question: '¿Cuál es el supermercado más limpio y ordenado?' },
        { question: '¿Qué le harán las hienas a Simba si decide volver?' },
        { question: '¿Cuáles sabores de yogurt has probado?' }
      ]]

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset3').yields(null, successResponse)
      dashboard.__set__('repository', mySqlrepository)

      var res = { json: testJson }

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset3(req, res, next)

      function testJson(response) {
        // Assert
        expect(securityStub).to.be.calledOnce
        next.calledOnce.should.be.false
        createError.calledOnce.should.be.false
        expect(getStatsDataSetStub).to.be.calledOnce
        getStatsDataSetStub.getCall(0).args[0].should.deep.equal({})

        // Validate response
        response.success.should.equal(true)
        response.should.have.property('payload')
        response.payload.should.have.property('questions')
        response.payload.questions.length.should.equal(4)

        done()
      }
    })

    it('should return a success response with filters', function (done) {
      // Arrange
      let req = {
        params: {
          filters: 'eydjaGFsbGVuZ2UnOiBbIi0xcXdlbHJrbGxqYXNkIl19' // value: {'challenge': ["-1qwelrklljasd"]}
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      const filterParam = { 'challenge': ['-1qwelrklljasd'] }

      const successResponse = [[
        { question: '¿En que tipo de situación es mejor comer embutidos?' },
        { question: '¿Cuál es el supermercado más limpio y ordenado?' },
        { question: '¿Qué le harán las hienas a Simba si decide volver?' },
        { question: '¿Cuáles sabores de yogurt has probado?' }
      ]]

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset3').yields(null, successResponse)
      dashboard.__set__('repository', mySqlrepository)

      var res = { json: testJson }

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset3(req, res, next)

      function testJson(response) {
        // Assert
        expect(securityStub).to.be.calledOnce
        next.calledOnce.should.be.false
        createError.calledOnce.should.be.false
        expect(getStatsDataSetStub).to.be.calledOnce
        getStatsDataSetStub.getCall(0).args[0].should.deep.equal(filterParam)

        // Validate response
        response.success.should.equal(true)
        response.should.have.property('payload')
        response.payload.should.have.property('questions')
        response.payload.questions.length.should.equal(4)

        done()
      }
    })
  })

  describe('getStatsDataset4', function () {
    it('should return an internal server error response', function (done) {
      // Arrange
      let req = {
        params: {
          filters: 'eyJnZW5kZXIiWyJmZW1hbGUiLCJtYWxlIl19' // value: {"gender"["female","male"]}
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      let res = {}
      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').throws()
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset4(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(500)

      done()
    })

    it('should return an unauthorized response', function (done) {
      // Arrange
      let req = {
        params: {
          filters: 'eyJnZW5kZXIiWyJmZW1hbGUiLCJtYWxlIl19' // value: {"gender"["female","male"]}
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      let res = {}
      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(false)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset4(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(401)

      done()
    })

    it('should return a bad request response', function (done) {
      // Arrange
      let req = {
        params: {
          filters: 'eyJnZW5kZXIiWyJmZW1hbGUiLCJtYWxlIl19' // value: {"gender"["female","male"]}
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      let res = {
        json: sinon.spy()
      }
      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset4(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(400)

      done()
    })

    it('should return a internal server error for repository error', function (done) {
      // Arrange
      let req = {
        params: {
          filters: 'eydhZ2VSYW5nZSc6IFsiQSwgMCBhIDE3Il19' // value: {'ageRange': ["A, 0 a 17"]}
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      const filterParam = { 'ageRange': ['A, 0 a 17'] }

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset4').yields({ error: 'something went wrong' })
      dashboard.__set__('repository', mySqlrepository)

      var res = {}

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset4(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(500)
      expect(getStatsDataSetStub).to.be.calledOnce
      getStatsDataSetStub.getCall(0).args[0].should.deep.equal(filterParam)

      done()
    })

    it('should return a internal server error for unexpected response from repository', function (done) {
      // Arrange
      let req = {
        params: {
          filters: 'eydhZ2VSYW5nZSc6IFsiQSwgMCBhIDE3Il19' // value: {'ageRange': ["A, 0 a 17"]}
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      const filterParam = { 'ageRange': ['A, 0 a 17'] }

      const successResponse = 'fake response'

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset4').yields(null, successResponse)
      dashboard.__set__('repository', mySqlrepository)

      var res = {}

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset4(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(500)
      expect(getStatsDataSetStub).to.be.calledOnce
      getStatsDataSetStub.getCall(0).args[0].should.deep.equal(filterParam)

      done()
    })

    it('should return a success response without filters', function (done) {
      // Arrange
      let req = {
        params: {
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      const successResponse = [[
        { count: 732, answer: '1 pie' },
        { count: 84, answer: 'Locales particulares' },
        { count: 1395, answer: 'Neil Amstrong' },
        { count: 28677, answer: 'Si' }
      ]]

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset4').yields(null, successResponse)
      dashboard.__set__('repository', mySqlrepository)

      var res = { json: testJson }

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset4(req, res, next)

      function testJson(response) {
        // Assert
        expect(securityStub).to.be.calledOnce
        next.calledOnce.should.be.false
        createError.calledOnce.should.be.false
        expect(getStatsDataSetStub).to.be.calledOnce
        getStatsDataSetStub.getCall(0).args[0].should.deep.equal({})

        // Validate response
        response.success.should.equal(true)
        response.should.have.property('payload')
        response.payload.should.have.property('answer')
        response.payload.answer.length.should.equal(4)

        done()
      }
    })

    it('should return a success response with filters', function (done) {
      // Arrange
      let req = {
        params: {
          filters: 'eydhZ2VSYW5nZSc6IFsiQSwgMCBhIDE3Il19' // value: {'ageRange': ["A, 0 a 17"]}
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      const filterParam = { 'ageRange': ['A, 0 a 17'] }

      const successResponse = [[
        { count: 732, answer: '1 pie' },
        { count: 84, answer: 'Locales particulares' },
        { count: 1395, answer: 'Neil Amstrong' },
        { count: 28677, answer: 'Si' }
      ]]

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset4').yields(null, successResponse)
      dashboard.__set__('repository', mySqlrepository)

      var res = { json: testJson }

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset4(req, res, next)

      function testJson(response) {
        // Assert
        expect(securityStub).to.be.calledOnce
        next.calledOnce.should.be.false
        createError.calledOnce.should.be.false
        expect(getStatsDataSetStub).to.be.calledOnce
        getStatsDataSetStub.getCall(0).args[0].should.deep.equal(filterParam)

        // Validate response
        response.success.should.equal(true)
        response.should.have.property('payload')
        response.payload.should.have.property('answer')
        response.payload.answer.length.should.equal(4)

        done()
      }
    })
  })

  describe('getStatsDataset5', function () {
    it('should return an internal server error response', function (done) {
      // Arrange
      let req = {
        params: {
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      let res = {}
      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').throws()
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset5(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(500)

      done()
    })

    it('should return an unauthorized response', function (done) {
      // Arrange
      let req = {
        params: {
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      let res = {}
      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(false)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset5(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(401)

      done()
    })

    it('should return a bad request response', function (done) {
      // Arrange
      let req = {
        params: {
          filters: 'eyJnZW5kZXIiWyJmZW1hbGUiLCJtYWxlIl19' // value: {"gender"["female","male"]}
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      let res = {
        json: sinon.spy()
      }
      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset5(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(400)

      done()
    })

    it('should return a internal server error for repository error', function (done) {
      // Arrange
      let req = {
        params: {
          filters: 'eydhZ2VSYW5nZSc6IFsiQSwgMCBhIDE3Il19' // value: {'ageRange': ["A, 0 a 17"]}
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      const filterParam = { 'ageRange': ['A, 0 a 17'] }

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset5').yields({ error: 'something went wrong' })
      dashboard.__set__('repository', mySqlrepository)

      var res = {}

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset5(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(500)
      expect(getStatsDataSetStub).to.be.calledOnce
      getStatsDataSetStub.getCall(0).args[0].should.deep.equal(filterParam)

      done()
    })

    it('should return a internal server error for unexpected response from repository', function (done) {
      // Arrange
      let req = {
        params: {
          filters: 'eydhZ2VSYW5nZSc6IFsiQSwgMCBhIDE3Il19' // value: {'ageRange': ["A, 0 a 17"]}
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      const filterParam = { 'ageRange': ['A, 0 a 17'] }

      const successResponse = 'fake response'

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset5').yields(null, successResponse)
      dashboard.__set__('repository', mySqlrepository)

      var res = {}

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset5(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(500)
      expect(getStatsDataSetStub).to.be.calledOnce
      getStatsDataSetStub.getCall(0).args[0].should.deep.equal(filterParam)

      done()
    })

    it('should return a success response without filters', function (done) {
      // Arrange
      let req = {
        params: {
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      const successResponse = [[{ count: 11052 }]]

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset5').yields(null, successResponse)
      dashboard.__set__('repository', mySqlrepository)

      var res = { json: testJson }

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset5(req, res, next)

      function testJson(response) {
        // Assert
        expect(securityStub).to.be.calledOnce
        next.calledOnce.should.be.false
        createError.calledOnce.should.be.false
        expect(getStatsDataSetStub).to.be.calledOnce
        getStatsDataSetStub.getCall(0).args[0].should.deep.equal({})

        // Validate response
        response.success.should.equal(true)
        response.should.have.property('payload')
        response.payload.should.have.property('count')
        response.payload.count.should.equal(11052)

        done()
      }
    })

    it('should return a success response with filters', function (done) {
      // Arrange
      let req = {
        params: {
          filters: 'eydhZ2VSYW5nZSc6IFsiQSwgMCBhIDE3Il19' // value: {'ageRange': ["A, 0 a 17"]}
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      const filterParam = { 'ageRange': ['A, 0 a 17'] }

      const successResponse = [[{ count: 11052 }]]

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset5').yields(null, successResponse)
      dashboard.__set__('repository', mySqlrepository)

      var res = { json: testJson }

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset5(req, res, next)

      function testJson(response) {
        // Assert
        expect(securityStub).to.be.calledOnce
        next.calledOnce.should.be.false
        createError.calledOnce.should.be.false
        expect(getStatsDataSetStub).to.be.calledOnce
        getStatsDataSetStub.getCall(0).args[0].should.deep.equal(filterParam)

        // Validate response
        response.success.should.equal(true)
        response.should.have.property('payload')
        response.payload.should.have.property('count')
        response.payload.count.should.equal(11052)

        done()
      }
    })
  })

  describe('getStatsDataset6', function () {
    it('should return an internal server error response', function (done) {
      // Arrange
      let req = {
        params: {
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      let res = {}
      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').throws()
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset6(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(500)

      done()
    })

    it('should return an unauthorized response', function (done) {
      // Arrange
      let req = {
        params: {
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      let res = {}
      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(false)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset6(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(401)

      done()
    })

    it('should return a bad request response', function (done) {
      // Arrange
      let req = {
        params: {
          filters: 'eyJnZW5kZXIiWyJmZW1hbGUiLCJtYWxlIl19' // value: {"gender"["female","male"]}
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      let res = {
        json: sinon.spy()
      }
      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset6(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(400)

      done()
    })

    it('should return a internal server error for repository error', function (done) {
      // Arrange
      let req = {
        params: {
          filters: 'eydhZ2VSYW5nZSc6IFsiQSwgMCBhIDE3Il19' // value: {'ageRange': ["A, 0 a 17"]}
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      const filterParam = { 'ageRange': ['A, 0 a 17'] }

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset6').yields({ error: 'something went wrong' })
      dashboard.__set__('repository', mySqlrepository)

      var res = {}

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset6(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(500)
      expect(getStatsDataSetStub).to.be.calledOnce
      getStatsDataSetStub.getCall(0).args[0].should.deep.equal(filterParam)

      done()
    })

    it('should return a internal server error for unexpected response from repository', function (done) {
      // Arrange
      let req = {
        params: {
          filters: 'eydhZ2VSYW5nZSc6IFsiQSwgMCBhIDE3Il19' // value: {'ageRange': ["A, 0 a 17"]}
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      const filterParam = { 'ageRange': ['A, 0 a 17'] }

      const successResponse = 'fake response'

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset6').yields(null, successResponse)
      dashboard.__set__('repository', mySqlrepository)

      var res = {}

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset6(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(500)
      expect(getStatsDataSetStub).to.be.calledOnce
      getStatsDataSetStub.getCall(0).args[0].should.deep.equal(filterParam)

      done()
    })

    it('should return a success response without filters', function (done) {
      // Arrange
      let req = {
        params: {
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      const successResponse = [
        [
          {
            'count': 11167
          }
        ]
      ]

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset6').yields(null, successResponse)
      dashboard.__set__('repository', mySqlrepository)

      var res = { json: testJson }

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset6(req, res, next)

      function testJson(response) {
        // Assert
        expect(securityStub).to.be.calledOnce
        next.calledOnce.should.be.false
        createError.calledOnce.should.be.false
        expect(getStatsDataSetStub).to.be.calledOnce
        getStatsDataSetStub.getCall(0).args[0].should.deep.equal({})

        // Validate response
        response.success.should.equal(true)
        response.should.have.property('payload')
        response.payload.should.have.property('count')
        response.payload.count.should.equal(11167)

        done()
      }
    })

    it('should return a success response with filters', function (done) {
      // Arrange
      let req = {
        params: {
          filters: 'eydhZ2VSYW5nZSc6IFsiQSwgMCBhIDE3Il19' // value: {'ageRange': ["A, 0 a 17"]}
        },
        headers: {
          nonce: 'This is fake'
        }
      }
      const filterParam = { 'ageRange': ['A, 0 a 17'] }

      const successResponse = [
        [
          {
            'count': 11167
          }
        ]
      ]

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset6').yields(null, successResponse)
      dashboard.__set__('repository', mySqlrepository)

      var res = { json: testJson }

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset6(req, res, next)

      function testJson(response) {
        // Assert
        expect(securityStub).to.be.calledOnce
        next.calledOnce.should.be.false
        createError.calledOnce.should.be.false
        expect(getStatsDataSetStub).to.be.calledOnce
        getStatsDataSetStub.getCall(0).args[0].should.deep.equal(filterParam)

        // Validate response
        response.success.should.equal(true)
        response.should.have.property('payload')
        response.payload.should.have.property('count')
        response.payload.count.should.equal(11167)

        done()
      }
    })
  })

  describe('getStatsDataset7', function () {
    it('should return an internal server error response', function (done) {
      // Arrange
      let req = {
        params: {
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      let res = {}
      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').throws()
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset7(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(500)

      done()
    })

    it('should return an unauthorized response', function (done) {
      // Arrange
      let req = {
        params: {
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      let res = {}
      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(false)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset7(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(401)

      done()
    })

    it('should return a not found response', function (done) {
      // Arrange
      let req = {
        params: {
          field: 'fakeField'
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      let res = {
        json: sinon.spy()
      }
      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset7(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(404)

      done()
    })

    it('should return a bad request response', function (done) {
      // Arrange
      let req = {
        params: {
          field: 'ageRange',
          filters: 'eyJnZW5kZXIiWyJmZW1hbGUiLCJtYWxlIl19' // value: {"gender"["female","male"]}
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      let res = {
        json: sinon.spy()
      }
      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset7(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(400)

      done()
    })

    it('should return a internal server error for repository error', function (done) {
      // Arrange
      const fieldParam = 'ageRange'
      let req = {
        params: {
          field: fieldParam,
          filters: 'eydhZ2VSYW5nZSc6IFsiQSwgMCBhIDE3Il19' // value: {'ageRange': ["A, 0 a 17"]}
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      const filterParam = { 'ageRange': ['A, 0 a 17'] }

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset7').yields({ error: 'something went wrong' })
      dashboard.__set__('repository', mySqlrepository)

      var res = {}

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset7(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(500)
      expect(getStatsDataSetStub).to.be.calledOnce
      getStatsDataSetStub.getCall(0).args[0].should.deep.equal(fieldParam)
      getStatsDataSetStub.getCall(0).args[1].should.deep.equal(filterParam)

      done()
    })

    it('should return a internal server error for unexpected response from repository', function (done) {
      // Arrange
      const fieldParam = 'ageRange'
      let req = {
        params: {
          field: fieldParam,
          filters: 'eydhZ2VSYW5nZSc6IFsiQSwgMCBhIDE3Il19' // value: {'ageRange': ["A, 0 a 17"]}
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      const filterParam = { 'ageRange': ['A, 0 a 17'] }

      const successResponse = 'fake response'

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset7').yields(null, successResponse)
      dashboard.__set__('repository', mySqlrepository)

      var res = {}

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset7(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(500)
      expect(getStatsDataSetStub).to.be.calledOnce
      getStatsDataSetStub.getCall(0).args[0].should.deep.equal(fieldParam)
      getStatsDataSetStub.getCall(0).args[1].should.deep.equal(filterParam)

      done()
    })

    it('should return a success response without filters', function (done) {
      // Arrange
      const fieldParam = 'ageRange'
      let req = {
        params: {
          field: fieldParam
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      const successResponse = [
        [
          {
            ageRange: 'A, 0 a 17', count: 350
          },
          {
            ageRange: '', count: 500
          }
        ]
      ]

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset7').yields(null, successResponse)
      dashboard.__set__('repository', mySqlrepository)

      var res = { json: testJson }

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset7(req, res, next)

      function testJson(response) {
        // Assert
        expect(securityStub).to.be.calledOnce
        next.calledOnce.should.be.false
        createError.calledOnce.should.be.false
        expect(getStatsDataSetStub).to.be.calledOnce
        getStatsDataSetStub.getCall(0).args[0].should.deep.equal(fieldParam)
        getStatsDataSetStub.getCall(0).args[1].should.deep.equal({})

        // Validate response
        response.success.should.equal(true)
        response.should.have.property('payload')
        response.payload.header[0].should.equal('ageRange')
        response.payload.ageRange.length.should.equal(2)

        done()
      }
    })

    it('should return a success response with filters', function (done) {
      // Arrange
      const fieldParam = 'ageRange'
      let req = {
        params: {
          field: fieldParam,
          filters: 'eydhZ2VSYW5nZSc6IFsiQSwgMCBhIDE3Il19' // value: {'ageRange': ["A, 0 a 17"]}
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      const filterParam = { 'ageRange': ['A, 0 a 17'] }

      const successResponse = [
        [
          {
            ageRange: 'A, 0 a 17', count: 350
          }
        ]
      ]

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset7').yields(null, successResponse)
      dashboard.__set__('repository', mySqlrepository)

      var res = { json: testJson }

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset7(req, res, next)

      function testJson(response) {
        // Assert
        expect(securityStub).to.be.calledOnce
        next.calledOnce.should.be.false
        createError.calledOnce.should.be.false
        expect(getStatsDataSetStub).to.be.calledOnce
        getStatsDataSetStub.getCall(0).args[0].should.deep.equal(fieldParam)
        getStatsDataSetStub.getCall(0).args[1].should.deep.equal(filterParam)

        // Validate response
        response.success.should.equal(true)
        response.should.have.property('payload')
        response.payload.header[0].should.equal('ageRange')
        response.payload.ageRange.length.should.equal(1)

        done()
      }
    })
  })

  describe('getStatsDataset8', function () {
    it('should return an internal server error response', function (done) {
      // Arrange
      let req = {
        params: {
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      let res = {}
      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').throws()
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset8(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(500)

      done()
    })

    it('should return an unauthorized response', function (done) {
      // Arrange
      let req = {
        params: {
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      let res = {}
      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(false)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset8(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(401)

      done()
    })

    it('should return a internal server error for repository error', function (done) {
      // Arrange
      let req = {
        params: {
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset8').yields({ error: 'something went wrong' })
      dashboard.__set__('repository', mySqlrepository)

      var res = {}

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset8(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(500)
      expect(getStatsDataSetStub).to.be.calledOnce

      done()
    })

    it('should return a internal server error for unexpected response from repository', function (done) {
      // Arrange
      let req = {
        params: {
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      const successResponse = 'fake response'

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset8').yields(null, successResponse)
      dashboard.__set__('repository', mySqlrepository)

      var res = {}

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset8(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(500)
      expect(getStatsDataSetStub).to.be.calledOnce

      done()
    })

    it('should return a success response', function (done) {
      // Arrange
      let req = {
        params: {
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      const successResponse = [[{ count: 11052 }]]

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset8').yields(null, successResponse)
      dashboard.__set__('repository', mySqlrepository)

      var res = { json: testJson }

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset8(req, res, next)

      function testJson(response) {
        // Assert
        expect(securityStub).to.be.calledOnce
        next.calledOnce.should.be.false
        createError.calledOnce.should.be.false
        expect(getStatsDataSetStub).to.be.calledOnce

        // Validate response
        response.success.should.equal(true)
        response.should.have.property('payload')
        response.payload.should.have.property('count')
        response.payload.count.should.equal(11052)

        done()
      }
    })
  })

  describe('getStatsDataset9', function () {
    it('should return an internal server error response', function (done) {
      // Arrange
      let req = {
        params: {
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      let res = {}
      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').throws()
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset9(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(500)

      done()
    })

    it('should return an unauthorized response', function (done) {
      // Arrange
      let req = {
        params: {
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      let res = {}
      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(false)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset9(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(401)

      done()
    })

    it('should return a bad request response', function (done) {
      // Arrange
      let req = {
        params: {
          filters: 'eyJnZW5kZXIiWyJmZW1hbGUiLCJtYWxlIl19' // value: {"gender"["female","male"]}
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      let res = {
        json: sinon.spy()
      }
      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset9(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(400)

      done()
    })

    it('should return a internal server error for repository error', function (done) {
      // Arrange
      let req = {
        params: {
          filters: 'eyAnY2hhbGxlbmdlJzpbJy1MX3NER1E1RDg5dmtCM2pzUVFPJ10gfQ==' // value: { 'challenge':['-L_sDGQ5D89vkB3jsQQO'] }
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      const filterParam = { 'challenge': ['-L_sDGQ5D89vkB3jsQQO'] }

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset9').yields({ error: 'something went wrong' })
      dashboard.__set__('repository', mySqlrepository)

      var res = {}

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset9(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(500)
      expect(getStatsDataSetStub).to.be.calledOnce
      getStatsDataSetStub.getCall(0).args[0].should.deep.equal(filterParam)

      done()
    })

    it('should return a internal server error for unexpected response from repository', function (done) {
      // Arrange
      let req = {
        params: {
          filters: 'eyAnY2hhbGxlbmdlJzpbJy1MX3NER1E1RDg5dmtCM2pzUVFPJ10gfQ==' // value: { 'challenge':['-L_sDGQ5D89vkB3jsQQO'] }
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      const filterParam = { 'challenge': ['-L_sDGQ5D89vkB3jsQQO'] }

      const successResponse = 'fake response'

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset9').yields(null, successResponse)
      dashboard.__set__('repository', mySqlrepository)

      var res = {}

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset9(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(500)
      expect(getStatsDataSetStub).to.be.calledOnce
      getStatsDataSetStub.getCall(0).args[0].should.deep.equal(filterParam)

      done()
    })

    it('should return a success response without filters', function (done) {
      // Arrange
      let req = {
        params: {
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      const successResponse = [
        [
          {
            'positive': 1,
            'negative': 5,
            'neutral': 10,
            'total': 16
          }
        ]
      ]

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset9').yields(null, successResponse)
      dashboard.__set__('repository', mySqlrepository)

      var res = { json: testJson }

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset9(req, res, next)

      function testJson(response) {
        // Assert
        expect(securityStub).to.be.calledOnce
        next.calledOnce.should.be.false
        createError.calledOnce.should.be.false
        expect(getStatsDataSetStub).to.be.calledOnce
        getStatsDataSetStub.getCall(0).args[0].should.deep.equal({})

        // Validate response
        response.success.should.equal(true)
        response.should.have.property('payload')
        response.payload.should.have.property('positive')
        response.payload.should.have.property('negative')
        response.payload.should.have.property('neutral')
        response.payload.should.have.property('total')
        response.payload.positive.should.equal(1)
        response.payload.negative.should.equal(5)
        response.payload.neutral.should.equal(10)
        response.payload.total.should.equal(16)

        done()
      }
    })

    it('should return a success response with filters', function (done) {
      // Arrange
      let req = {
        params: {
          filters: 'eyAnY2hhbGxlbmdlJzpbJy1MX3NER1E1RDg5dmtCM2pzUVFPJ10gfQ==' // value: { 'challenge':['-L_sDGQ5D89vkB3jsQQO'] }
        },
        headers: {
          nonce: 'This is fake'
        }
      }
      const filterParam = { 'challenge': ['-L_sDGQ5D89vkB3jsQQO'] }

      const successResponse = [
        [
          {
            'positive': 1,
            'negative': 5,
            'neutral': 10,
            'total': 16
          }
        ]
      ]

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset9').yields(null, successResponse)
      dashboard.__set__('repository', mySqlrepository)

      var res = { json: testJson }

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset9(req, res, next)

      function testJson(response) {
        // Assert
        expect(securityStub).to.be.calledOnce
        next.calledOnce.should.be.false
        createError.calledOnce.should.be.false
        expect(getStatsDataSetStub).to.be.calledOnce
        getStatsDataSetStub.getCall(0).args[0].should.deep.equal(filterParam)

        // Validate response
        // Validate response
        response.success.should.equal(true)
        response.should.have.property('payload')
        response.payload.should.have.property('positive')
        response.payload.should.have.property('negative')
        response.payload.should.have.property('neutral')
        response.payload.should.have.property('total')
        response.payload.positive.should.equal(1)
        response.payload.negative.should.equal(5)
        response.payload.neutral.should.equal(10)
        response.payload.total.should.equal(16)

        done()
      }
    })
  })

  describe('getStatsDataset10', function () {
    it('should return an internal server error response', function (done) {
      // Arrange
      let req = {
        params: {
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      let res = {}
      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').throws()
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset10(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(500)

      done()
    })

    it('should return an unauthorized response', function (done) {
      // Arrange
      let req = {
        params: {
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      let res = {}
      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(false)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset10(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(401)

      done()
    })

    it('should return a bad request response', function (done) {
      // Arrange
      let req = {
        params: {
          filters: 'eyJnZW5kZXIiWyJmZW1hbGUiLCJtYWxlIl19' // value: {"gender"["female","male"]}
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      let res = {
        json: sinon.spy()
      }
      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset10(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(400)

      done()
    })

    it('should return a internal server error for repository error', function (done) {
      // Arrange
      let req = {
        params: {
          filters: 'eyAnY2hhbGxlbmdlJzpbJy1MX3NER1E1RDg5dmtCM2pzUVFPJ10gfQ==' // value: { 'challenge':['-L_sDGQ5D89vkB3jsQQO'] }
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      const filterParam = { 'challenge': ['-L_sDGQ5D89vkB3jsQQO'] }

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset10').yields({ error: 'something went wrong' })
      dashboard.__set__('repository', mySqlrepository)

      var res = {}

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset10(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(500)
      expect(getStatsDataSetStub).to.be.calledOnce
      getStatsDataSetStub.getCall(0).args[0].should.deep.equal(filterParam)

      done()
    })

    it('should return a internal server error for unexpected response from repository', function (done) {
      // Arrange
      let req = {
        params: {
          filters: 'eyAnY2hhbGxlbmdlJzpbJy1MX3NER1E1RDg5dmtCM2pzUVFPJ10gfQ==' // value: { 'challenge':['-L_sDGQ5D89vkB3jsQQO'] }
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      const filterParam = { 'challenge': ['-L_sDGQ5D89vkB3jsQQO'] }

      const successResponse = 'fake response'

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset10').yields(null, successResponse)
      dashboard.__set__('repository', mySqlrepository)

      var res = {}

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset10(req, res, next)

      // Assert
      expect(securityStub).to.be.calledOnce
      next.calledOnce.should.be.true
      createError.calledOnce.should.be.true
      createError.getCall(0).args[0].should.equal(500)
      expect(getStatsDataSetStub).to.be.calledOnce
      getStatsDataSetStub.getCall(0).args[0].should.deep.equal(filterParam)

      done()
    })

    it('should return a success response without filters', function (done) {
      // Arrange
      let req = {
        params: {
        },
        headers: {
          nonce: 'This is fake'
        }
      }

      const successResponse = [
        [
          {
            "email": "munozfrancorodrigo@gmail.com",
            "gender": "Hombre",
            "ageRange": "E, 36 a 40",
            "answer": "Microondas"
          },
          {
            "email": "munozfrancorodrigo@gmail.com",
            "gender": "Hombre",
            "ageRange": "E, 36 a 40",
            "answer": "Acabados, precio y marca"
          }
        ]
      ]

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset10').yields(null, successResponse)
      dashboard.__set__('repository', mySqlrepository)

      var res = { json: testJson }

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset10(req, res, next)

      function testJson(response) {
        // Assert
        expect(securityStub).to.be.calledOnce
        next.calledOnce.should.be.false
        createError.calledOnce.should.be.false
        expect(getStatsDataSetStub).to.be.calledOnce
        getStatsDataSetStub.getCall(0).args[0].should.deep.equal({})

        // Validate response
        response.success.should.equal(true)
        response.should.have.property('payload')
        response.payload.should.have.property('header')
        response.payload.should.have.property('result')

        done()
      }
    })

    it('should return a success response with filters', function (done) {
      // Arrange
      let req = {
        params: {
          filters: 'eyAnY2hhbGxlbmdlJzpbJy1MX3NER1E1RDg5dmtCM2pzUVFPJ10gfQ==' // value: { 'challenge':['-L_sDGQ5D89vkB3jsQQO'] }
        },
        headers: {
          nonce: 'This is fake'
        }
      }
      const filterParam = { 'challenge': ['-L_sDGQ5D89vkB3jsQQO'] }


      const successResponse = [
        [
          {
            "email": "munozfrancorodrigo@gmail.com",
            "gender": "Hombre",
            "ageRange": "E, 36 a 40",
            "answer": "Microondas"
          },
          {
            "email": "munozfrancorodrigo@gmail.com",
            "gender": "Hombre",
            "ageRange": "E, 36 a 40",
            "answer": "Acabados, precio y marca"
          }
        ]
      ]

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset10').yields(null, successResponse)
      dashboard.__set__('repository', mySqlrepository)

      var res = { json: testJson }

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset10(req, res, next)

      function testJson(response) {
        // Assert
        expect(securityStub).to.be.calledOnce
        next.calledOnce.should.be.false
        createError.calledOnce.should.be.false
        expect(getStatsDataSetStub).to.be.calledOnce
        getStatsDataSetStub.getCall(0).args[0].should.deep.equal(filterParam)

        // Validate response
        response.success.should.equal(true)
        response.should.have.property('payload')
        response.payload.should.have.property('header')
        response.payload.should.have.property('result')

        done()
      }
    })

    it('should return an empty response', function (done) {
      // Arrange
      let req = {
        params: {
          filters: 'eyAnY2hhbGxlbmdlJzpbJy1MX3NER1E1RDg5dmtCM2pzUVFPJ10gfQ==' // value: { 'challenge':['-L_sDGQ5D89vkB3jsQQO'] }
        },
        headers: {
          nonce: 'This is fake'
        }
      }
      const filterParam = { 'challenge': ['-L_sDGQ5D89vkB3jsQQO'] }


      const successResponse = [
        [
        ]
      ]

      let getStatsDataSetStub = sinon.stub(mySqlrepository, 'getStatsDataset10').yields(null, successResponse)
      dashboard.__set__('repository', mySqlrepository)

      var res = { json: testJson }

      let next = sinon.spy()

      let securityStub = sinon.stub(security, 'validateNonceAES').returns(true)
      dashboard.__set__('security.validateNonceAES', securityStub)

      // Act
      dashboard.getStatsDataset10(req, res, next)

      function testJson(response) {
        // Assert
        expect(securityStub).to.be.calledOnce
        next.calledOnce.should.be.false
        createError.calledOnce.should.be.false
        expect(getStatsDataSetStub).to.be.calledOnce
        getStatsDataSetStub.getCall(0).args[0].should.deep.equal(filterParam)

        // Validate response
        response.success.should.equal(true)
        response.should.have.property('payload')
        response.payload.should.have.property('header')
        response.payload.should.have.property('result')
        response.payload.header.length.should.equal(0)
        response.payload.result.length.should.equal(0)

        done()
      }
    })
  })
})
