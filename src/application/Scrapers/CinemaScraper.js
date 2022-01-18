/**
 * The CinemaScraper class, extending ScraperHelper class.
 *
 * @author Tomas Marx-Raacz von Hidvég <tendn09@student.lnu.se>
 * @version 1.0.0
 */

'use strict'

import { JSDOM } from 'jsdom'
import { ScraperHelper } from './ScraperHelper.js'
import fetch from 'node-fetch'
import { MovieAvailability } from '../helperClasses/MovieAvailability.js'

/**
 *
 */
export class CinemaScraper extends ScraperHelper {
  /**
   * Constructor with parameters.
   *
   * @param {object} cinema - Cinema class object to populate through this part of the application.
   * */
  constructor (cinema) {
    super()
    this.cinema = cinema
  }

  /**
   * Method for getting relevant strings for weekdays and names from scraped site stringArray.
   *
   * @param {Array} stringArray array of strings
   * @returns {Array} newArray.
   */
  scratchWeekDaysAndMenuNames (stringArray) {
    const newArray = []
    for (let i = 0; i < stringArray.length; i++) {
      const element = stringArray[i].toLowerCase()
      if (!(element.toLowerCase().includes('friday') ||
                element.toLowerCase().includes('saturday') ||
                element.toLowerCase().includes('sunday') ||
                element.toLowerCase().includes('pick a movie') ||
                element.toLowerCase().includes('pick a day'))) {
        newArray.push(stringArray[i])
      }
    }
    return newArray
  }

  /**
   * Method for getting relevant strings for weekdays and names from scraped site stringArray.
   *
   * @param {Array} stringArray array of strings
   * @returns {Array} newArray.
   */
  scratchWeekendDayNumbersAndOthers (stringArray) {
    const newArray = []
    for (let i = 0; i < stringArray.length; i++) {
      const element = stringArray[i]
      if (!(element.toLowerCase().includes('05') ||
                element.toLowerCase().includes('06') ||
                element.toLowerCase().includes('07') ||
                element.toLowerCase().includes('movie') ||
                element.length < 1)) {
        newArray.push(element)
      }
    }
    return newArray
  }

  /**
   * Method for constructing an array of movie objects from the two scraped and fixed arrays.
   *
   * @param {Array} revisedMoviesAvailable array of the movies that are available
   * @param {Array} revisedPageOptionNumber array of page option numbers
   * @returns {Array} resultArray.
   */
  constructMovieArray (revisedMoviesAvailable, revisedPageOptionNumber) {
    const resultArray = []
    for (let i = 0; i < revisedMoviesAvailable.length; i++) {
      const newObject = {
        movie: revisedMoviesAvailable[i],
        option: parseFloat(revisedPageOptionNumber[i])
      }
      resultArray.push(newObject)
    }
    return resultArray
  }

  /**
   * Method for artificially construct a query adress through the daysAvailableArray and resultArrays as well as the
   * base url for the cinema site.
   *
   * @param {string} url url to be scraped.
   * @param {Array} daysAvailableArray array of DaysAvailable objects.
   * @param {Array} resultArray array of result objects.
   * @returns {Array} tempArray.
   */
  constructFetchUrls (url, daysAvailableArray, resultArray) {
    const tempArray = []
    for (let i = 0; i < daysAvailableArray.length; i++) {
      for (let j = 0; j < resultArray.length; j++) {
        tempArray.push(`${url}/check?day=0${daysAvailableArray[i].dayNumber}&movie=0${resultArray[j].option}`)
      }
    }
    return tempArray
  }

  /**
   * Method for using the constructed query arrays and collecting the JSON answers.
   *
   * @param {string[]} fetchUrlArray array of urls.
   * @returns {JSON[]} returnArray.
   */
  async checkMovieTimes (fetchUrlArray) {
    const returnArray = []
    for (const element of fetchUrlArray) {
      const completeResponse = await fetch(element).then(response => response.json())

      returnArray.push(completeResponse)
    }
    return returnArray
  }

  /**
   * Create one big string[] from the array of JSON objects.
   *
   * @param {JSON[]} movieTimes .
   * @returns {string[]} tempArray.
   * */
  flattenMovieResponse (movieTimes) {
    const tempArray = []
    for (const element of movieTimes) {
      for (const subElement of element) {
        tempArray.push(subElement)
      }
    }
    return tempArray
  }

  /**
   * Method for populating the Cinema Class object with movies available.
   *
   * @param {Array} revisedMoviesAvailable array of MovieAvailability objects.
   */
  populateMoviesAvailabilityObjects (revisedMoviesAvailable) {
    for (let i = 0; i < this.cinema.bookings.length; i++) {
      for (let j = 0; j < revisedMoviesAvailable.length; j++) {
        this.cinema.bookings[i].availableMovies.push(new MovieAvailability(revisedMoviesAvailable[j], j + 1))
      }
    }
  }

  /**
   * Method for manipulating the boolean in the timesAvailable[] of the CinemaBookingDate Class depending on the returns from the scrape.
   *
   * @param {Array} revisedMovieTimes array of strings
   */
  setMovieAvailability (revisedMovieTimes) {
    for (let headIndex = 0; headIndex < this.cinema.bookings.length; headIndex++) {
      for (let lvl2Index = 0; lvl2Index < this.cinema.bookings[headIndex].availableMovies.length; lvl2Index++) {
        for (let subIndex = 0; subIndex < revisedMovieTimes.length; subIndex++) {
          if (parseFloat(revisedMovieTimes[subIndex].day) === this.cinema.bookings[headIndex].dayNumber && parseFloat(revisedMovieTimes[subIndex].movie) === this.cinema.bookings[headIndex].availableMovies[lvl2Index].movieNumber) {
            if (revisedMovieTimes[subIndex].time.includes('16') && revisedMovieTimes[subIndex].status === 1) {
              this.cinema.bookings[headIndex].availableMovies[lvl2Index].timesAvailable[0].bookable = true
            } else if (revisedMovieTimes[subIndex].time.includes('18') && revisedMovieTimes[subIndex].status === 1) {
              this.cinema.bookings[headIndex].availableMovies[lvl2Index].timesAvailable[1].bookable = true
            } else if (revisedMovieTimes[subIndex].time.includes('20') && revisedMovieTimes[subIndex].status === 1) {
              this.cinema.bookings[headIndex].availableMovies[lvl2Index].timesAvailable[2].bookable = true
            }
          }
        }
      }
    }
  }

  /**
   * Umbrella method for this part of the application.
   *
   * @param {string} url - url for the Cinema.
   * @param {Array} daysAvailableArray - Array of days available from previous steps of the application.
   * @returns {Array} revisedMovieTimes
   * */
  async scrapeCinema (url, daysAvailableArray) {
    try {
      const text = await this._getText(url)
      const dom = new JSDOM(text)

      // getting the movie titles and options(which daynumber and number).
      const moviesAvailable = await this.getElementInnerHTML('option', dom)
      const pageOptionNumbers = await this.getElementOption('option', dom)

      // removing all but movie names
      const revisedMoviesAvailable = this.scratchWeekDaysAndMenuNames(moviesAvailable)

      // Interacting with Cinema object to add the available movies.
      this.populateMoviesAvailabilityObjects(revisedMoviesAvailable)

      // removing all but option numbers.
      const revisedPageOptionNumber = this.scratchWeekendDayNumbersAndOthers(pageOptionNumbers)

      // Adding the two lists together.
      const resultArray = this.constructMovieArray(revisedMoviesAvailable, revisedPageOptionNumber)
      // console.log(resultArray)

      // Construct fetch urls to check movie times.
      const fetchUrlArray = this.constructFetchUrls(url, daysAvailableArray, resultArray)

      // using the list of urls to get the times of the movies and saving responses in an array.
      const movieTimes = (await this.checkMovieTimes(fetchUrlArray))
      // console.log(movieTimes)

      // flattening the array of movies and their availability.
      const revisedMovieTimes = this.flattenMovieResponse(movieTimes)
      // console.log(revisedMovieTimes)

      // setting bookable status to movies in the corresponding cinema object.
      this.setMovieAvailability(revisedMovieTimes)
    } catch (error) {
      console.log(error.message)
    }
  }
}
