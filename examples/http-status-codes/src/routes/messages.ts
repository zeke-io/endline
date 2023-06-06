import { Router } from 'endline'

// Using an array to simulate a database for testing purposes
const messagesArray: string[] = []

export default function (router: Router) {
  /**
   * GET /messages
   * Gets all submitted messages
   */
  router.GET('/', () => {
    // By default, if the object being returned does not have a body property,
    // the object will be used as the body of the response and the status code will default to 200
    return messagesArray
  })

  /**
   * POST /messages
   * Submits a message
   */
  router.POST('/', ({ body }) => {
    const { message } = body

    if (!message) {
      // However, if you provide a body property, Endline use it to format the body of the response
      // You can also change the status code by adding the status property
      return {
        status: 400,
        body: 'Field "message" is missing in request body',
      }
    }

    messagesArray.push(message)

    return {
      status: 201,
      body: 'Your message has been submitted',
    }
  })

  /**
   * GET /messages/{index}
   * Gets a message with the given index
   */
  router.GET('/:index', ({ params }) => {
    const { index } = params

    const messageIndex = parseInt(index)

    if (isNaN(messageIndex)) {
      return {
        status: 400,
        body: `The index "${index}" is not a valid number`,
      }
    }

    const messageItem = messagesArray[messageIndex]

    if (!messageItem) {
      return {
        status: 404,
        body: `The message with index "${messageIndex}" was not found`,
      }
    }

    return messageItem
  })
}
