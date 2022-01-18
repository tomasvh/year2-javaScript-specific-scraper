/**
 * The Application class
 *
 * @author Tomas Marx-Raacz von Hidvég <tendn09@student.lnu.se>
 * @version 1.0.0
 * */

'use strict'

import Application from './application/Application.js'

/**
 * Start of appplication.
 */
const main = async () => {
  try {
    const [,, url] = process.argv
    const theApp = new Application(url.toString())
    await theApp.run()
  } catch (error) {
    console.error(error.message)
  }
}

main()
