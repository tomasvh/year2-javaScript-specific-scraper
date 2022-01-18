/**
 * The Application class
 *
 * @author Tomas Marx-Raacz von Hidvég <tendn09@student.lnu.se>
 * @version 1.0.0
 * */

'use strict'

import { Person } from './helperClasses/Person.js'
import { LinkScraper } from './Scrapers/LinkScraper.js'
import { CalenderScraper } from './Scrapers/CalenderScraper.js'
import { PageChecker } from './Scrapers/PageChecker.js'
import { Restaurant } from './helperClasses/Restaurant.js'
import { Cinema } from './helperClasses/Cinema.js'
import { LinkChecker } from './helperClasses/LinkChecker.js'
import { CinemaScraper } from './Scrapers/CinemaScraper.js'
import { CinemaBookingDate } from './helperClasses/CinemaBookingDate.js'
import { RestaurantScraper } from './Scrapers/RestaurantScraper.js'
import { SuggestionManager } from './Scrapers/SuggestionManager.js'

/**
 *
 */
export default class Application {
  /**
   * Class for the application.
   *
   * @class
   * @param {string} url the url to be scraped.
   */
  constructor (url) {
    this.url = url
    this.paul = new Person('Paul')
    this.peter = new Person('Peter')
    this.mary = new Person('Mary')
    this.restaurant = new Restaurant('Zeke\'s Bar')
    this.cinema = new Cinema('Ghost town cinema')
    this.linkList = [new LinkChecker(this.url, false)]
    this.pageChecker = new PageChecker()
    this.calenderScraper = new CalenderScraper()
    this.linkScraper = new LinkScraper()
    this.personList = [this.paul, this.peter, this.mary]
  }

  /**
   * Function for populating the Person objects with availability from the scraped Calender.
   *
   * @param {object[]} scrapedCalenderArray - Array of results from the CalenderScraper.
   * @param {Person} person - The individual to be manipulated.
   * */
  populateCalenderAvailability (scrapedCalenderArray, person) {
    for (let i = 0; i < scrapedCalenderArray.length; i++) {
      if (scrapedCalenderArray[i].answer === 'ok') {
        person.availableList[i].setAvailable(true)
      }
    }
  }

  /**
   * Function for checking the linkList for specific string content.
   *
   * @param {string} stringIdentifier - the word to look for.
   * @param {string[]} linkList - the list of links.
   * @returns {string} link - returns a link if content is found.
   * */
  getLink (stringIdentifier, linkList) {
    let link = ''
    for (let i = 0; i < linkList.length; i++) {
      if (linkList[i].url.includes(stringIdentifier)) {
        link = linkList[i].url
      }
    }
    return link
  }

  /**
   * Method for identifying if individuals are free for a specific day.
   *
   * @param {Array} availabilityArray - an array to store any matches.
   * @param {Person} person1 - individual 1.
   * @param {Person} person2 - individual 2.
   * @param {Person} person3 - individual 3.
   * @param {number} index - index of each of the individuals availabilityList.
   * @returns {Array} - returning the availabilityArray again.
   * */
  checkAvailability (availabilityArray, person1, person2, person3, index) {
    const availableArray = availabilityArray
    if (person1.availableList[index].available === true && person2.availableList[index].available === true && person3.availableList[index].available === true) {
      availableArray.push(person1.availableList[index])
    }
    return availableArray
  }

  /**
   * Umbrella function that checks page for function using PageChecker, Scrapes links using LinkScraper and if found, scrapes Calender using CalenderScraper for the three individuals.
   * */
  async scrapeLinksAndCalender () {
    for (let i = 0; i < this.linkList.length; i++) {
      // As soon as all links possible comes out scraped(true) this will end.
      if (this.linkList[i].scraped === false) {
        const pageCheck = await this.pageChecker.checkPage(this.linkList[i].url, 'reservation', 'cinema', this.personList)
        this.linkList[i].scraped = true
        switch (pageCheck) {
          case 0: {
            const scrapedLinks = await this.linkScraper.extractLinks(this.linkList[i].url)
            for (let index = 0; index < scrapedLinks.length; index++) {
              this.linkList.push(new LinkChecker(scrapedLinks[index], false))
            }
            await this.scrapeLinksAndCalender()
            break
          }
          case 1: {
            const scrapedLinks = await this.linkScraper.extractLinks(this.linkList[i].url)
            for (let index = 0; index < scrapedLinks.length; index++) {
              this.linkList.push(new LinkChecker(scrapedLinks[index], false))
            }
            await this.scrapeLinksAndCalender()
            break
          }
          case 2: {
            await this.scrapeLinksAndCalender()
            break
          }
          case 3: {
            await this.populateCalenderAvailability(await this.calenderScraper.getTableElements(this.linkList[i].url), this.paul)
            await this.scrapeLinksAndCalender()
            break
          }
          case 4: {
            await this.populateCalenderAvailability(await this.calenderScraper.getTableElements(this.linkList[i].url), this.peter)
            await this.scrapeLinksAndCalender()
            break
          }
          case 5: {
            await this.populateCalenderAvailability(await this.calenderScraper.getTableElements(this.linkList[i].url), this.mary)
            await this.scrapeLinksAndCalender()
            break
          }
          case 6: {
            await this.scrapeLinksAndCalender()
            break
          }
        }
      }
    }
  }

  /**
   * Method for overall operation of the program.
   * */
  async run () {
    // Scraping available links.
    await this.scrapeLinksAndCalender()
    console.log('Scraping links...OK')
    // console.log(this.linkList)

    // Scraping available days and setting up Person and Cinema objects for next steps.
    const personAvailabilityArray = []
    for (let i = 0; i < this.paul.availableList.length; i++) {
      this.checkAvailability(personAvailabilityArray, this.paul, this.peter, this.mary, i)
    }
    for (let i = 0; i < personAvailabilityArray.length; i++) {
      this.cinema.bookings.push(new CinemaBookingDate(personAvailabilityArray[i].name, personAvailabilityArray[i].dayNumber))
    }
    console.log('Scraping available days...OK')

    // Scraping cinema through API requests and populating available movies in Cinema.
    const cinemaLink = this.getLink('cinema', this.linkList)
    const cinemaScraper = new CinemaScraper(this.cinema)
    await cinemaScraper.scrapeCinema(cinemaLink, personAvailabilityArray)
    console.log('Scraping showtimes...OK')

    // Scraping restaurant with cookie login and setting up restaurant object for next step.
    const dinnerLink = this.getLink('dinner', this.linkList)
    const dinnerScraper = new RestaurantScraper(dinnerLink, 'zeke', 'coys', this.restaurant, this.cinema)
    await dinnerScraper.run()
    console.log('Scraping possible reservations...OK')
    console.log('')

    // Sieving through the Restaurant object and the Cinema object to identify suggestions and print them.
    const suggestionManager = new SuggestionManager(this.cinema, this.restaurant)
    const printableAnswer = suggestionManager.run()
    console.log('Suggestions')
    console.log('===========')
    printableAnswer.forEach(element => console.log(element.createPrintString()))
  }
}
