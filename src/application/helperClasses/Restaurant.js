/**
 * The Restaurant class.
 *
 * @author Tomas Marx-Raacz von Hidvég <tendn09@student.lnu.se>
 * @version 1.0.0
 */

'use strict'

/**
 *
 */
export class Restaurant {
  /**
   * Constructor with parameter.
   *
   * @param {string} name name of the restaurant.
   * */
  constructor (name) {
    this.name = name
    this.bookings = []
  }
}
