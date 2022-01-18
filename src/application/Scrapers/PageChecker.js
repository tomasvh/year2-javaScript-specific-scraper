/**
 * The PageChecker class, extending ScraperHelper.
 *
 * @author Tomas Marx-Raacz von Hidvég <tendn09@student.lnu.se>
 * @version 1.0.0
 */

'use strict'

import { ScraperHelper } from './ScraperHelper.js'
import { JSDOM } from 'jsdom'

/**
 *
 */
export class PageChecker extends ScraperHelper {
  /**
   * Umpbrella method for checking what the page under scrutiny is about and returning a number for higher level function.
   *
   * @param {string} url url to scrape.
   * @param {string} reservationString reservation string.
   * @param {string} cinemaString cinema string.
   * @param {Array} pplArray array of People objects.
   * @returns {number} answer.
   */
  async checkPage (url, reservationString, cinemaString, pplArray) {
    const page = await this._getText(url)

    const dom = new JSDOM(page)

    let answer = 0

    const pArray = Array.from(dom.window.document.querySelectorAll('p'))
      .map(element => element.innerHTML.trim().replace('\n', '').toLowerCase())
      .sort()

    const h1Array = Array.from(dom.window.document.querySelectorAll('h1'))
      .map(element => element.innerHTML.trim().replace('\n', '').toLowerCase())
      .sort()

    const h2Array = Array.from(dom.window.document.querySelectorAll('h2'))
      .map(element => element.innerHTML.trim().replace('\n', '').toLowerCase())
      .sort()

    const answersArray = []

    answersArray.push(await this.checkForKeywords(pArray, reservationString, cinemaString, pplArray))
    answersArray.push(await this.checkForKeywords(h1Array, reservationString, cinemaString, pplArray))
    answersArray.push(await this.checkForKeywords(h2Array, reservationString, cinemaString, pplArray))

    // checking if previous functions come back in any way other than 0 and changes answer parameter if that is the case.
    for (let i = 0; i < answersArray.length; i++) {
      if (answersArray[i] !== 0) {
        answer = answersArray[i]
      }
    }

    return answer
  }

  /**
   * Method that checks for keywords and returning a number for higher level function.
   *
   * @param {Array} answersArray array of answer strings
   * @param {string} reservationString reservation string.
   * @param {string} cinemaString cinemastring.
   * @param {Array} pplArray array of People objects
   * @returns {number} answer.
   */
  async checkForKeywords (answersArray, reservationString, cinemaString, pplArray) {
    let answer = 0
    const checkArray = []
    for (let i = 0; i < pplArray.length; i++) {
      checkArray.push(await this.compare(answersArray, pplArray[i].name.toLowerCase(), i + 3))
    }

    checkArray.push(await this.compare(answersArray, 'our calendar!', 1))

    checkArray.push(await this.compare(answersArray, cinemaString, 2))

    checkArray.push(await this.compare(answersArray, reservationString, 6))

    // checking if previous functions come back in any way other than 0 and changes answer parameter if that is the case.
    for (let i = 0; i < checkArray.length; i++) {
      if (checkArray[i] !== 0) {
        answer = checkArray[i]
      }
    }

    return answer
  }

  /**
   * Method for checking if a string includes a certain keyword.
   *
   * @param {string[]} array - Array of strings to be checked.
   * @param {string} keyWord - String to be checked against.
   * @param {number} number - Number to be returned if it returns true.
   * @returns {boolean} answer.
   * */
  async compare (array, keyWord, number) {
    let answer = 0
    for (let i = 0; i < array.length; i++) {
      if (array[i].toLowerCase().includes(keyWord)) {
        answer = number
      } else {
        answer = 0
      }
    }
    return answer
  }
}
