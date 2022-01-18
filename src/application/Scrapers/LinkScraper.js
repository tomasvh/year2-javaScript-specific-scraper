/**
 * The LinkScraper class, extending ScraperHelper class.
 *
 * @author Ellen Nu <en999zz@student.lnu.se>
 * @author Tomas Marx-Raacz von Hidvég <tendn09@student.lnu.se> secondary author for changes.
 * @version 1.0.1
 */

import { JSDOM } from 'jsdom'
import { ScraperHelper } from './ScraperHelper.js'

/**
 * Encapsulates a link scraper.
 */
export class LinkScraper extends ScraperHelper {
  /**
   * Extracts the unique absolute links on a web page.
   *
   * @param {string} url - The URL of the web page to scrape.
   * @returns {string[]} The unique and absolute links.
   */
  async extractLinks (url) {
    const text = await this._getText(url)

    const dom = new JSDOM(text)

    const links = Array.from(dom.window.document.querySelectorAll('a'))
    this.getStringFromHTMLElement(links)

    this.fixLink(links, url, 2)

    links.sort()

    return [...new Set(links)]
  }

  /**
   * Small helper function to convert from a HTMLAnchorElement to an actual link in JSDOM.
   *
   * @param {Array} array the array of HTMLAnchorElements.
   * */
  getStringFromHTMLElement (array) {
    for (let i = 0; i < array.length; i++) {
      array[i] = array[i].href
    }
  }
}
