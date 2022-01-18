/**
 * The DayAvailable class, extending Day class.
 *
 * @author Tomas Marx-Raacz von Hidvég <tendn09@student.lnu.se>
 * @version 1.0.0
 */

'use strict'

import { Day } from './Day.js'

/**
 *
 */
export class DayAvailable extends Day {
  /**
   * Constructor with parameter.
   *
   * @param {string} name name of the day.
   * @param {number} dayNumber days number in the week.
   * */
  constructor (name, dayNumber) {
    super(name, dayNumber)
    this.available = false
  }

  /**
   * Function to alter availability boolean.
   *
   * @param {boolean} input boolean input
   */
  setAvailable (input) {
    this.available = input
  }
}
