/* const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
var sandbox = sinon.createSandbox()
var dataset = require('../models/dataset')

describe('dataset.js', () => {
  let goodValue = []
  goodValue.push({
    Campaigns: 10,
    CampaignId: 1,
    CampaignTitle: 'dummy',
    Impressions: 10,
    Leads: 10,
    Cost: 10,
    LinkClicks: 10,
    Variations: 10,
    ArtVariations: 10,
    ConvRate: 10,
    CTR: 0.01,
    RunDate: '2019-06-10',
    CostPerLead: 10,
    ImageUrl: 'http:/asdf/',
    Gender: 'male',
    AdSetId: '1',
    AdSetTitle: 'dummy',
    CreativeTitle: `dummy`,
    AdBody: `dummy` ,
    AgeFromFacebook: `18-24`,
  })

  context('getStatsGrouped', () => {
    it('should returned the stats grouped', () => {
      sandbox.restore()
      let result = dataset.getStatsGrouped(goodValue)
      expect(result).to.have.keys(['header', 'campaigns'])
      expect(result.campaigns).to.deep.equal([['dummy', 10, 10, 10, 10, 0.01, '10.0000', 10, 10]])
    })

    it('should received an invalid object', () => {
      sandbox.restore()
      expect(function () { dataset.getStatsGrouped('Invalid object') }).to.throw('Expected an array')
      expect(dataset.getStatsGrouped([{ invalid: 0 }])).to.have.keys(['header', 'campaigns'])
    })
  })

  context('getStatsSummary', () => {
    it('should returned the summary', () => {
      sandbox.restore()
      let result = dataset.getStatsSummary(goodValue)
      expect(result).to.have.keys(['header', 'summary'])
      expect(result.summary).to.deep.equal([10, 10, 10, 10, 10])
    })

    it('should received an invalid object', () => {
      sandbox.restore()
      expect(function () { dataset.getStatsSummary('Invalid object') }).to.throw('Expected an array')
      expect(dataset.getStatsSummary([{ invalid: 0 }])).to.have.keys(['header', 'summary'])
    })
  })

  context('getStatsUser', () => {
    it('should returned the arrays', () => {
      sandbox.restore()
      let expectedResult = { date: [ '2019-06-10' ],
        leads: [ 10 ],
        impressions: [ 10 ],
        linkClicks: [ 10 ],
        costPerLead: [ 10 ],
        CTR: [ 0.01 ],
        convRate: [ '10.0000' ],
        totalCost: '10.00',
        totalCostPerLead: '10.00',
        totalLeads: 10,
        totalLinkClicks: 10
      }
      let result = dataset.getStatsUser(goodValue  )
      expect(result).to.have.keys(['date', 'leads', 'impressions', 'linkClicks', 'costPerLead', 'CTR', 'convRate', 'totalCost', 'totalCostPerLead', 'totalLeads', 'totalLinkClicks'])
      expect(result).to.deep.equal(expectedResult)
    })

    it('should received an invalid object', () => {
      sandbox.restore()
      expect(function () { dataset.getStatsUser('Invalid object') }).to.throw('Expected an array')
      expect(dataset.getStatsUser([{ invalid: 0 }])).to.have.keys(['date', 'leads', 'impressions', 'linkClicks', 'costPerLead', 'CTR', 'convRate', 'totalCost', 'totalCostPerLead', 'totalLeads', 'totalLinkClicks'])
    })
  })

  context('getAdSets', () => {
    it('should returned the stats grouped', () => {
      sandbox.restore()
      let result = dataset.getAdSetList(goodValue)
      expect(result).to.have.keys(['header', 'adSets'])
      expect(result.adSets).to.deep.equal([[ '1', 'dummy', 'http:/asdf/', 'male', 10 ]])
    })

    it('should received an invalid object', () => {
      sandbox.restore()
      expect(function () { dataset.getAdSetList('Invalid object') }).to.throw('Expected an array')
      expect(dataset.getAdSetList([{ invalid: 0 }])).to.have.keys(['header', 'adSets'])
    })
  })

  context('getImages', () => {
    it('should returned the stats grouped', () => {
      sandbox.restore()
      let result = dataset.getImages(goodValue)
      expect(result).to.have.keys(['header', 'images'])
      expect(result.images).to.deep.equal([['http:/asdf/', 10 ]])
    })

    it('should received an invalid object', () => {
      sandbox.restore()
      expect(function () { dataset.getImages('Invalid object') }).to.throw('Expected an array')
      expect(dataset.getImages([{ invalid: 0 }])).to.have.keys(['header', 'images'])
    })
  })

  context('getTextCombination', () => {
    it('should returned the stats grouped', () => {
      sandbox.restore()
      let result = dataset.getTextCombination(goodValue)
      expect(result).to.have.keys(['header', 'text'])
      expect(result.text).to.deep.equal([['dummy', 'dummy', 10 ]])
    })

    it('should received an invalid object', () => {
      sandbox.restore()
      expect(function () { dataset.getTextCombination('Invalid object') }).to.throw('Expected an array')
      expect(dataset.getTextCombination([{ invalid: 0 }])).to.have.keys(['header', 'text'])
    })
  })

  context('getAges', () => {
    it('should returned the stats grouped', () => {
      sandbox.restore()
      let result = dataset.getAges(goodValue)
      expect(result).to.have.keys(['header', 'ages'])
      expect(result.ages).to.deep.equal([['18-24', 10 ]])
    })

    it('should received an invalid object', () => {
      sandbox.restore()
      expect(function () { dataset.getAges('Invalid object') }).to.throw('Expected an array')
      expect(dataset.getAges([{ invalid: 0 }])).to.have.keys(['header', 'ages'])
    })
  })

  context('getGender', () => {
    it('should returned the stats grouped', () => {
      sandbox.restore()
      let result = dataset.getGender(goodValue)
      expect(result).to.have.keys(['header', 'gender'])
      expect(result.gender).to.deep.equal([['male', 10 ]])
    })

    it('should received an invalid object', () => {
      sandbox.restore()
      expect(function () { dataset.getGender('Invalid object') }).to.throw('Expected an array')
      expect(dataset.getGender([{ invalid: 0 }])).to.have.keys(['header', 'gender'])
    })
  })

})
 */