/**
 * The CinemaBookingDate class, extending Day class.
 *
 * @author Tomas Marx-Raacz von Hidvég <tendn09@student.lnu.se>
 * @version 1.0.0
 */

'use strict'

import { Day } from './Day.js'

/**
 *
 */
export class CinemaBookingDate extends Day {
  /**
   * Constructor with parameter.
   *
   * @param {string} name name of the day of the booking.
   * @param {number} dayNumber the days number in the week.
   * */
  constructor (name, dayNumber) {
    super(name, dayNumber)
    this.availableMovies = []
  }
}
