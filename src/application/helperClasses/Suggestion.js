/**
 * The Suggestion class, a class for storing the possible suggestions.
 *
 * @author Tomas Marx-Raacz von Hidvég <tendn09@student.lnu.se>
 * @version 1.0.0
 */
export class Suggestion {
  /**
   * Constructor without parameters.
   */
  constructor () {
    this.dayName = ''
    this.movie = ''
    this.movieTime = 0
    this.dinnerStart = 0
    this.dinnerEnd = 0
  }

  /**
   * Function to create the string to print for the suggestion.
   *
   * @returns {string} printableString
   */
  createPrintString () {
    const printableString = `On ${this.dayName}, "${this.movie}" begins at ${this.movieTime.toString()}:00, and there is a free table to book between ${this.dinnerStart.toString()}:00-${this.dinnerEnd.toString()}:00.`
    return printableString
  }
}
