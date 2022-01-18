/**
 * The RestaurantBookings class, extending DayAvailable class.
 *
 * @author Tomas Marx-Raacz von Hidvég <tendn09@student.lnu.se>
 * @version 1.0.0
 */

'use strict'

import { Day } from './Day.js'

/**
 *
 */
export class RestaurantBookings extends Day {
  /**
   * Constructor with parameter.
   *
   * @param {string} name name of the restaurant booking.
   * @param {number} dayNumber the days number in the week.
   * */
  constructor (name, dayNumber) {
    super(name, dayNumber)
    this.timesAvailable = [{
      startTime: 14,
      endTime: 16,
      booked: false
    }, {
      startTime: 16,
      endTime: 18,
      booked: false
    }, {
      startTime: 18,
      endTime: 20,
      booked: false
    }, {
      startTime: 20,
      endTime: 22,
      booked: false
    }]
  }
}
