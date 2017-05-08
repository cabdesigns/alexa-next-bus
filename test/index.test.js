'use strict'

let expect = require('chai').expect
let chai = require('chai')
chai.use(require('chai-spies'))

let index = require('../src/index')
let moment = require('moment-timezone')
let Bus = require('../src/bus')
let mockBuses = [
  new Bus('7', moment.tz('2017-05-05 17:05', 'UTC')),
  new Bus('7A', moment.tz('2017-05-05 17:10', 'UTC'))
]

describe('NextBus', () => {
  beforeEach(() => {
    process.env.ATCO_CODES = '["450011119", "450010285"]'

    this.transportApi = {
      fetchNextBuses: function (atcoCodes, callBack) {
        callBack(mockBuses)
      }
    }

    this.emit = () => {}
  })

  it('should create voice template', () => {
    expect(index.createVoiceTemplate(mockBuses)).to.equal(
      '7 in 5 minutes. 7A in 10 minutes. '
    )
  })

  it('should create card template', () => {
    expect(index.createCardTemplate(mockBuses)).to.equal(
      '17:05 - 7\n17:10 - 7A\n'
    )
  })

  describe('intent', () => {
    it('should emit next bus data with card', () => {
      let spy = chai.spy.on(this, 'emit')
      index.nextBusIntent(this.transportApi, this.emit)
      expect(spy).to.have.been.called.with(
        ':tellWithCard',
        '7 in 5 minutes. 7A in 10 minutes. ',
        'Bus timetable',
        '17:05 - 7\n17:10 - 7A\n'
      )
    })
  })
})
