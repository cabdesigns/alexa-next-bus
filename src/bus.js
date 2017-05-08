'use strict'

let moment = require('moment-timezone')

/**
 * @param {String} name
 * @param {object} dateTime - Moment instance
 * @constructor
 */
function Bus (name, dateTime) {
  this.name = name
  this.dateTime = dateTime
}

/**
 * @return {String} When the bus is due in human speak
 */
Bus.prototype.getHumanTime = function () {
  let now = moment()
  return now.to(this.dateTime, true)
}

/**
 * @return {String}
 */
Bus.prototype.getTime = function () {
  return this.dateTime.format('HH:mm')
}

module.exports = Bus
