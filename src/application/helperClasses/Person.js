/**
 * The Person class, extending Individual.
 *
 * @author Tomas Marx-Raacz von Hidvég <tendn09@student.lnu.se>
 * @version 1.0.0
 */

'use strict'

import { DayAvailable } from './DayAvailable.js'
import { Individual } from './Individual.js'

/**
 *
 */
export class Person extends Individual {
  /**
   * Class constructor with parameter.
   *
   * @param {string} name name of person.
   * */
  constructor (name) {
    super(name)
    this.availableList = [new DayAvailable('Friday', 5), new DayAvailable('Saturday', 6), new DayAvailable('Sunday', 7)]
  }
}
