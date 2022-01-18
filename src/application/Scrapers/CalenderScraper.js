import { JSDOM } from 'jsdom'
import { ScraperHelper } from './ScraperHelper.js'

/**
 * The CalenderScraper class, extending ScraperHelper class.
 *
 * @author Tomas Marx-Raacz von Hidvég <tendn09@student.lnu.se>
 * @version 1.0.0
 */
export class CalenderScraper extends ScraperHelper {
  /**
   * Method for getting elements from the calender dom.
   *
   * @param {string} url url string.
   * @returns {Array} array of elements.
   */
  async getTableElements (url) {
    const page = await this._getText(url)
    const dom = new JSDOM(page)

    const headArray = await this.getElementInnerHTML('th', dom)
    const dataArray = await this.getElementInnerHTML('td', dom)

    return this.populateCalenderArray(headArray, dataArray)
  }

  /**
   * Method that creates an Object[] from two other string[] with corresponding indexes.
   *
   * @param {string[]} headArray - Array of string elements from the table-headers of the dom.
   * @param {string[]} dataArray - Array of string elements from the table-data of the dom.
   * @returns {object[]} calenderArray - Array of Calender objects.
   * */
  populateCalenderArray (headArray, dataArray) {
    const calenderArray = []

    for (let i = 0; i < headArray.length; i++) {
      const newCalenderEntry = {
        day: headArray[i],
        answer: dataArray[i].toLowerCase()
      }
      calenderArray.push(newCalenderEntry)
    }
    return calenderArray
  }
}
