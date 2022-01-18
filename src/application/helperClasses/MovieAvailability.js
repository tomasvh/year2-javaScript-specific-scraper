/**
 * The MovieAvailability class.
 *
 * @author Tomas Marx-Raacz von Hidvég <tendn09@student.lnu.se>
 * @version 1.0.0
 */

'use strict'

/**
 *
 */
export class MovieAvailability {
  /**
   * Constructor with parameter.
   *
   * @param {string} name name of the movie.
   * @param {number} movieNumber the movies number.
   * */
  constructor (name, movieNumber) {
    this.name = name
    this.movieNumber = movieNumber
    this.timesAvailable = [{
      startTime: 16,
      bookable: false
    }, {
      startTime: 18,
      bookable: false
    }, {
      startTime: 20,
      bookable: false
    }]
  }
}
