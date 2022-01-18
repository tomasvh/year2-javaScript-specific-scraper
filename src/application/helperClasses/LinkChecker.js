/**
 * The LinkChecker class.
 *
 * @author Tomas Marx-Raacz von Hidvég <tendn09@student.lnu.se>
 * @version 1.0.0
 */

'use strict'

/**
 *
 */
export class LinkChecker {
  /**
   * Constructor with parameter.
   *
   * @param {string} url url to be checked.
   * @param {boolean} scraped boolean that checks if the url is checked or not.
   * */
  constructor (url, scraped) {
    this.url = url
    this.scraped = scraped
  }
}
