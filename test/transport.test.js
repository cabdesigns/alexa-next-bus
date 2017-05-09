'use strict'

let expect = require('chai').expect
let nock = require('nock')
let moment = require('moment-timezone')
let transportApiId = '1234'
let transportApiKey = 'ABCD'
let transportApi = require('../src/transport')(transportApiId, transportApiKey)
let atcoCodes = ['450011119', '450010285']

describe('Transport', () => {
  beforeEach(() => {
    process.env.TZ = 'UTC'
  })

  describe('when timezone is GMT', () => {
    beforeEach(function () {
      moment.now = function () {
        // Sat, 11 Feb 2017 18:00:00 GMT
        return 1486836000000
      }
    })

    it('should return next buses sorted by time ASC', () => {
      stubBuses('2017-02-11')

      return transportApi.fetchNextBuses(atcoCodes, nextBuses => {
        expect(nextBuses[0].name).to.equal('7S')
        expect(nextBuses[0].getTime()).to.equal('18:00')
        expect(nextBuses[0].getHumanTime()).to.equal('a few seconds')

        expect(nextBuses[1].name).to.equal('7')
        expect(nextBuses[1].getTime()).to.equal('18:07')
        expect(nextBuses[1].getHumanTime()).to.equal('7 minutes')

        expect(nextBuses.length).to.equal(6)
      })
    })
  })

  describe('when timezone is BST', () => {
    beforeEach(() => {
      moment.now = () => {
        // Fri, 05 May 2017 17:00:00 GMT
        return 1494003600000
      }
    })

    it('should return next buses sorted by time ASC', () => {
      stubBuses('2017-05-05')

      return transportApi.fetchNextBuses(atcoCodes, nextBuses => {
        expect(nextBuses[0].name).to.equal('7S')
        expect(nextBuses[0].getTime()).to.equal('18:00')
        expect(nextBuses[0].getHumanTime()).to.equal('a few seconds')

        expect(nextBuses[1].name).to.equal('7')
        expect(nextBuses[1].getTime()).to.equal('18:07')
        expect(nextBuses[1].getHumanTime()).to.equal('7 minutes')

        expect(nextBuses.length).to.equal(6)
      })
    })
  })
})

/**
 * @param {String} date YYYY-MM-DD format
 */
function stubBuses (date) {
  nock('https://transportapi.com')
    .get('/v3/uk/bus/stop/450011119/live.json?app_id=1234&app_key=ABCD&group=route&nextbuses=yes')
    .reply(200, {
      'departures': {
        '7': [
          {
            'date': date,
            'aimed_departure_time': '18:07',
            'expected_departure_time': '18:07',
            'best_departure_estimate': '18:07'
          },
          {
            'date': date,
            'aimed_departure_time': '18:55',
            'expected_departure_time': '18:56',
            'best_departure_estimate': '18:56'
          },
          {
            'date': date,
            'aimed_departure_time': '19:56',
            'expected_departure_time': null,
            'best_departure_estimate': '19:56'
          }
        ]
      }
    })

  nock('https://transportapi.com')
    .get('/v3/uk/bus/stop/450010285/live.json?app_id=1234&app_key=ABCD&group=route&nextbuses=yes')
    .reply(200, {
      'departures': {
        '7A': [
          {
            'date': date,
            'aimed_departure_time': '18:08',
            'expected_departure_time': '18:08',
            'best_departure_estimate': '18:08'
          },
          {
            'date': date,
            'aimed_departure_time': '18:20',
            'expected_departure_time': '18:20',
            'best_departure_estimate': '18:20'
          }
        ],
        '7S': [
          {
            'date': date,
            'aimed_departure_time': '18:00',
            'expected_departure_time': '18:00',
            'best_departure_estimate': '18:00'
          }
        ]
      }
    })
}
