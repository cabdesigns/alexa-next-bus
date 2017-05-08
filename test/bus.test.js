'use strict'

let expect = require('chai').expect
let moment = require('moment-timezone')
let Bus = require('../src/bus')
let busTime = moment.tz('2017-05-05 17:05', 'UTC')
let bus = new Bus('7', busTime)

describe('Bus', () => {
  beforeEach(() => {
    process.env.TZ = 'UTC'
    moment.now = function () {
      // Fri, 05 May 2017 17:00:00 GMT
      return 1494003600000
    }
  })

  it('should set name', () => {
    expect(bus.name).to.equal('7')
  })

  it('should set date time', () => {
    expect(bus.dateTime).to.equal(busTime)
  })

  it('should get time', () => {
    expect(bus.getTime()).to.equal('17:05')
  })

  it('should get human time', () => {
    expect(bus.getHumanTime()).to.equal('5 minutes')
  })
})
