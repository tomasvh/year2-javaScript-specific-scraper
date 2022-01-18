/**
 * The ScraperHelper class.
 *
 * @author Tomas Marx-Raacz von Hidvég <tendn09@student.lnu.se>
 * @version 1.0.0
 */

'use strict'

import fetch from 'node-fetch'
import validator from 'validator'

/**
 *
 */
export class ScraperHelper {
  /**
   * Gets the plain text from an URL.
   *
   * @param {string} url - URL to get text content from.
   * @returns {string} The content as plain text.
   */
  async _getText (url) {
    const response = await fetch(url)
    return response.text()
  }

  /**
   * Gets an Array of scraped strings from an element type.
   *
   * @param {string} htmlElementType - type of html element to look for.
   * @param {object} dom - virtual dom of the checked site
   * @returns {Array} an array of strings for each element innerHTML of the chosen type
   * */
  async getElementInnerHTML (htmlElementType, dom) {
    return Array.from(dom.window.document.querySelectorAll(htmlElementType))
      .map(element => element.innerHTML.trim())
  }

  /**
   * Gets an Array of scraped strings from an element type.
   *
   * @param {string} htmlElementType - type of html element to look for.
   * @param {object} dom - virtual dom of the checked site
   * @returns {Array} an array of numbers for each element.value of the chosen type
   * */
  async getElementOption (htmlElementType, dom) {
    return Array.from(dom.window.document.querySelectorAll(htmlElementType))
      .map(element => element.value.trim())
  }

  /**
   * Gets an Array of scraped strings from an element type.
   *
   * @param {string} htmlElementType - type of html element to look for.
   * @param {object} dom - virtual dom of the checked site
   * @returns {Array} an array of numbers for each element.value of the chosen type
   * */
  async getElementMethod (htmlElementType, dom) {
    return Array.from(dom.window.document.querySelectorAll(htmlElementType))
      .map(element => element.method.trim())
  }

  /**
   * Gets an Array of scraped strings from an element type.
   *
   * @param {string} htmlElementType - type of html element to look for.
   * @param {object} dom virtual dom of the checked site
   * @returns {Array} an array of numbers for each element.value of the chosen type
   * */
  async getElementAction (htmlElementType, dom) {
    return Array.from(dom.window.document.querySelectorAll(htmlElementType))
      .map(element => element.action.trim())
  }

  /**
   * Method for cleaning up an array of strings from the restaurant scrape through regex which includes all sorts of html artifacts.
   *
   * @param {string[]} stringArrayInNeed - Array with unclean strings
   * @returns {string[]} newArray */
  cleanUp (stringArrayInNeed) {
    const newArray = []
    for (const string of stringArrayInNeed) {
      string.replace(/[^A-Za-z0-9.!?]/g, '')
      if (string.includes('Friday')) {
        newArray.push('Friday')
      } else if (string.includes('Saturday')) {
        newArray.push('Saturday')
      } else if (string.includes('Sunday')) {
        newArray.push('Sunday')
      } else if (string.includes('14-16') || string.includes('16-18') || string.includes('18-20') || string.includes('20-22')) {
        newArray.push(string)
      }
    }
    return newArray
  }

  /**
   * Method for fixing and concatenating a base link and an uncomplete link together.
   *
   * @param {string[]} linkArray - array of unfinished links
   * @param {string} url - base url
   * @param {number} index - at which index this uncomplete is going to be cut
   * */
  fixLink (linkArray, url, index) {
    for (let i = 0; i < linkArray.length; i++) {
      if (!validator.isURL(linkArray[i])) {
        linkArray[i] = url + linkArray[i].substring(index)
      } else {
        return
      }
    }
  }
}
