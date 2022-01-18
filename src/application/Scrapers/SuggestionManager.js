
import { Suggestion } from '../helperClasses/Suggestion.js'

/**
 * The SuggestionManager class, a class for handling the creation and returning of the strings for final print.
 *
 * @author Tomas Marx-Raacz von Hidvég <tendn09@student.lnu.se>
 * @version 1.0.0
 */
export class SuggestionManager {
/**
 * Constructor with parameter.
 *
 * @param {object} cinema Cinema class object.
 * @param {object} restaurant Restaurant class object
 * */
  constructor (cinema, restaurant) {
    this.cinema = cinema
    this.restaurant = restaurant
  }

  /**
   * Function to sieve through the Cinema object looking for available bookings.
   *
   * @returns {Array} tempArray
   */
  sieveCinema () {
    const tempArray = []
    for (let i = 0; i < this.cinema.bookings.length; i++) {
      for (let j = 0; j < this.cinema.bookings[i].availableMovies.length; j++) {
        for (let k = 0; k < this.cinema.bookings[i].availableMovies[j].timesAvailable.length; k++) {
          if (this.cinema.bookings[i].availableMovies[j].timesAvailable[k].bookable === true) {
            const temp = new Suggestion()
            temp.dayName = this.cinema.bookings[i].name
            temp.movie = this.cinema.bookings[i].availableMovies[j].name
            temp.movieTime = this.cinema.bookings[i].availableMovies[j].timesAvailable[k].startTime
            tempArray.push(temp)
          }
        }
      }
    }
    return tempArray
  }

  /**
   * Function to compare availableMovieBookings towards the Restaurantbookings to fill in the blanks of the suggestions.
   *
   * @param {Array} availableMovieBookings array of Suggestion class objects.
   * @returns {Array} tempArray.
   */
  dinnerCheck (availableMovieBookings) {
    const tempArray = []
    availableMovieBookings.forEach(element => {
      for (let i = 0; i < this.restaurant.bookings.length; i++) {
        if (this.restaurant.bookings[i].name === element.dayName) {
          for (let j = 0; j < this.restaurant.bookings[i].timesAvailable.length; j++) {
            if (this.restaurant.bookings[i].timesAvailable[j].startTime === element.movieTime + 2 && this.restaurant.bookings[i].timesAvailable[j].booked === false) {
              element.dinnerStart = this.restaurant.bookings[i].timesAvailable[j].startTime
              element.dinnerEnd = this.restaurant.bookings[i].timesAvailable[j].endTime
              tempArray.push(element)
            }
          }
        }
      }
    })

    return tempArray
  }

  /**
   * Umbrella function that controlls this manager class.
   *
   * @returns {Array} answerArray
   */
  run () {
    const availableMovieBookings = this.sieveCinema()

    const answerArray = this.dinnerCheck(availableMovieBookings)

    return answerArray
  }
}
