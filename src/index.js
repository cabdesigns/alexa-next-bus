'use strict'

const Alexa = require('alexa-sdk')
const transportApi = require('./transport')(
  process.env.TRANSPORT_API_APP_ID,
  process.env.TRANSPORT_API_APP_KEY
)

exports.handler = (event, context, callback) => {
  let alexa = Alexa.handler(event, context, callback)
  alexa.appId = process.env.SKILL_ID
  alexa.registerHandlers(handlers)
  alexa.execute()
}

let handlers = {
  'LaunchRequest': function () {
    this.emit('NextBusIntent')
  },
  'NextBusIntent': function () {
    exports.nextBusIntent(transportApi, this.emit)
  }
}

/**
 * Get next buses and emit
 * @param {object} transportApi
 * @param {function} emit
 */
exports.nextBusIntent = function (transportApi, emit) {
  let atcoCodes = JSON.parse(process.env.ATCO_CODES)
  transportApi.fetchNextBuses(atcoCodes, buses => {
    // @todo make configurable
    let immediateBuses = buses.slice(0, 3)

    emit(
      ':tellWithCard',
      exports.createVoiceTemplate(immediateBuses),
      'Bus timetable',
      exports.createCardTemplate(immediateBuses)
    )
  })
}

/**
 * @param {Bus[]} buses
 * @return {String}
 */
exports.createVoiceTemplate = function (buses) {
  let template = ''

  buses.forEach(bus => {
    template += `${bus.name} in ${bus.getHumanTime()}. `
  })

  return template
}

/**
 * @param {Bus[]} buses
 * @return {String}
 */
exports.createCardTemplate = function (buses) {
  let template = ''

  buses.forEach(bus => {
    template += `${bus.getTime()} - ${bus.name}\n`
  })

  return template
}
