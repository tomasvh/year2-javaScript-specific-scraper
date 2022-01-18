/**
 * The RestaurantScraper class, extending ScraperHelper.
 *
 * @author Tomas Marx-Raacz von Hidvég <tendn09@student.lnu.se>
 * @version 1.0.0
 */

'use strict'

import { ScraperHelper } from './ScraperHelper.js'
import { JSDOM } from 'jsdom'
import axios from 'axios'
import qs from 'qs'
import { RestaurantBookings } from '../helperClasses/RestaurantBookings.js'

/**
 *
 */
export class RestaurantScraper extends ScraperHelper {
  /**
   * Constructor with parameters.
   *
   * @param {string} url url to be scraped.
   * @param {string} userName username of the user.
   * @param {string} passWord password for the user.
   * @param {object} restaurant the Restaurant object.
   * @param {object} cinema the Cinema object.
   * */
  constructor (url, userName, passWord, restaurant, cinema) {
    super()
    this.restaurant = restaurant
    this.url = url
    this.userName = userName
    this.passWord = passWord
    this.cinema = cinema
  }

  /**
   * Function to steer the API call using a session cookie, the automatic redirect did not work so a two step call with a cancelled POST redirect
   * which axion considered an error was made, cookie extracted from the error response and a further GET using the cookie was made
   * to reach the actual site.
   *
   * @param {Array} typeArray - Array of types extracted from the initial site scrape (to reduce hardcoding).
   * @param {string} methodString - Another parameter that got extracted from the first site describing which method to call.
   * @param {string} url - the updated link from the initial scrape.
   * @returns {Array} returnArray.
   * */
  async fetchSite (typeArray, methodString, url) {
    // Imitating the form.
    const data = qs.stringify({
      username: this.userName,
      password: this.passWord,
      submit: 'login'
    })

    // Setting the options.
    let config = {
      method: methodString, // The scraped method from the restaurant startpage.
      url: url, // The scraped URL
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded' // The form of data transmission to use when sending form.
      },
      maxRedirects: 0, // Disabling redirect.
      data: data
    }

    const cookieAnswerArray = []
    const linkAnswerArray = []
    await axios(config)
      .catch(function (error) {
        cookieAnswerArray.push(error.response.headers['set-cookie']) // Gathering the error message to extract cookie.
        linkAnswerArray.push(error.response.headers.location) // Gathering the new url ending from error.
      })

    const cookieString = cookieAnswerArray[0][0]
    const splitCookieArray = cookieString.split(';') // Extracting the actual cookie from the cookie string.

    this.fixLink(linkAnswerArray, this.url, 0)

    // Secondary call options.
    config = {
      method: 'GET',
      url: linkAnswerArray[0],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: splitCookieArray[0]
      },
      data: data
    }

    const resultArray = []

    await axios(config).then(function (response) {
      resultArray.push(response.data) // Extracting the site by putting it to an Array.
    }).catch(function (error) {
      console.log(error)
    })

    return resultArray
  }

  /**
   * Function to input the result of the scrape into the Restaurant object.
   *
   * @param {Array} relevantTimesArray the scraped times.
   * */
  manipulateRestaurant (relevantTimesArray) {
    for (let i = 0; i < relevantTimesArray.length; i++) {
      for (let j = 0; j < this.restaurant.bookings.length; j++) {
        if (relevantTimesArray[i] === this.restaurant.bookings[j].name) {
          this.checkBooked(relevantTimesArray, i + 1, i + 4, j)
        }
      }
    }
  }

  /**
   * Checking an array of times for booked spots and manipulate RestaurantBookings object.
   *
   * @param {Array} relevantTimesArray the array of scraped times.
   * @param {number} index1 first index
   * @param {number} index2 second index
   * @param {number} jIndex the index in the bookings
   * */
  checkBooked (relevantTimesArray, index1, index2, jIndex) {
    for (let i = index1; i <= index2; i++) {
      if (relevantTimesArray[i].includes('booked')) {
        this.restaurant.bookings[jIndex].timesAvailable[i - 1].booked = true
      }
    }
  }

  /**
   * Umbrella function for the Class, running this portion of the application.
   * */
  async run () {
    // Creating RestaurantBookings objects with respect for Cinema times available.
    for (let i = 0; i < this.cinema.bookings.length; i++) {
      this.restaurant.bookings.push(new RestaurantBookings(this.cinema.bookings[i].name, this.cinema.bookings[i].dayNumber))
    }

    const text = await this._getText(this.url)

    const dom = new JSDOM(text)

    const methodArray = await this.getElementMethod('form', dom)
    const actionArray = await this.getElementAction('form', dom)

    this.fixLink(actionArray, this.url, 2)

    const dinnerTimesSiteArray = await this.fetchSite(this.url, methodArray[0], actionArray[0])

    try {
      const finalDom = new JSDOM(dinnerTimesSiteArray[0])

      const timeScrapeArray = await this.getElementInnerHTML('span', finalDom)
      const fixedTimesArray = this.cleanUp(timeScrapeArray)

      const relevantTimesArray = []

      for (let i = 0; i < fixedTimesArray.length; i++) {
        for (let j = 0; j < this.restaurant.bookings.length; j++) {
          if (fixedTimesArray[i] === this.restaurant.bookings[j].name) {
            relevantTimesArray.push(fixedTimesArray[i])
            relevantTimesArray.push(fixedTimesArray[i + 1])
            relevantTimesArray.push(fixedTimesArray[i + 2])
            relevantTimesArray.push(fixedTimesArray[i + 3])
            relevantTimesArray.push(fixedTimesArray[i + 4])
          }
        }
      }
      this.manipulateRestaurant(relevantTimesArray)
    } catch (error) {
      console.log(error.message)
    }
  }
}
