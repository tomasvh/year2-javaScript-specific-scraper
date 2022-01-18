/**
 * The Day class.
 *
 * @author Tomas Marx-Raacz von Hidvég <tendn09@student.lnu.se>
 * @version 1.0.0
 */

'use strict'

/**
 *
 */
export class Day {
  /**
   * Constructor with parameter.
   *
   * @param {string} name name of the day.
   * @param {number} dayNumber the days number of the week.
   * */
  constructor (name, dayNumber) {
    this.name = name
    this.dayNumber = dayNumber
  }
}
