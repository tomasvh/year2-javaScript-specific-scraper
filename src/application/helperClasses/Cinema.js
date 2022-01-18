/**
 * The Cinema class.
 *
 * @author Tomas Marx-Raacz von Hidvég <tendn09@student.lnu.se>
 * @version 1.0.0
 */

'use strict'

/**
 *
 */
export class Cinema {
  /**
   * Constructor with parameter.
   *
   * @param {string} name name of the cinema.
   * */
  constructor (name) {
    this.name = name
    this.bookings = []
  }
}
