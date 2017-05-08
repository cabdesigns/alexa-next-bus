'use strict'

const Promise = require('bluebird')
const rp = require('request-promise')
const moment = require('moment-timezone')
const Bus = require('../src/bus')

/**
 * @param {String} appId
 * @param {String} appKey
 * @return {{fetchNextBuses: (function(*, *))}}
 */
module.exports = function (appId, appKey) {
  return {
    /**
     * Fetch next buses and apply callback
     * @param {String[]} atcoCodes
     * @param {function} callback
     * @todo
     */
    fetchNextBuses: (atcoCodes, callback) => {
      let buses = []
      let timetables = []

      atcoCodes.forEach(atcoCode => {
        timetables.push(
          rp(buildApiPath(atcoCode))
        )
      })

      Promise.all(timetables)
        .then(responses => {
          responses.forEach((response) => {
            buses = buses.concat(parseNextBuses(response))
          })
        })
        .catch(e => {
          console.log(e)
        })
        .finally(() => {
          buses.sort(sortBuses)
          callback(buses)
        })
    }

  }

  /**
   * @param {String} atcoCode
   * @return {String}
   */
  function buildApiPath (atcoCode) {
    const host = 'https://transportapi.com'
    const basePath = '/v3/uk/bus/stop/'
    const path = `${atcoCode}/live.json?app_id=${appId}&app_key=${appKey}&group=route&nextbuses=yes`
    return `${host}${basePath}${path}`
  }

  /**
   * @param {object} body
   * @return {Array}
   */
  function parseNextBuses (body) {
    let parsed = JSON.parse(body)

    if (parsed.hasOwnProperty('error')) {
      throw new Error(`Transport API error encountered: ${parsed.error}`)
    }

    let nextBuses = []

    Object.keys(parsed.departures).forEach(key => {
      parsed.departures[key].forEach(bus => {
        const busTime = getDateTime(bus)
        nextBuses.push(new Bus(key, busTime))
      })
    })

    return nextBuses
  }

  /**
   * Get date time object with timezone included
   * @note TransportAPI values are Europe/London
   * @param {object} bus - Raw bus object from API
   * @return {object} Moment instance
   */
  function getDateTime (bus) {
    let departureDate = bus.expected_departure_date
    let departureTime = bus.aimed_departure_time
    let busDateTime = `${departureDate} ${departureTime}`
    let busTime = moment.tz(busDateTime, 'Europe/London')
    return busTime
  }

  /**
   * Sort by bus time ASC
   * @todo Move somewhere else
   * @param {Bus} a
   * @param {Bus} b
   * @return {number}
   */
  function sortBuses (a, b) {
    if (a.dateTime < b.dateTime) { return -1 }
    if (a.dateTime > b.dateTime) { return 1 }
    return 0
  }
}
