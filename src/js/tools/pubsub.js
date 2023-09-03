/**
 * Code base from article:
 * https://joshbedo.github.io/JS-Design-Patterns/
 */

export default class PubSub {
  static handlers = []

  suscribe (event, handler, context = null, isOnceType = false) {
    if (context === null) { context = handler }
    PubSub.handlers.push({
      event,
      handler: handler.bind(context),
      isOnceType
    })
  }

  publish (eventEmited, ...args) {
    PubSub.handlers = PubSub.handlers.filter(handlerItem => {
      const { event, handler, isOnceType } = handlerItem

      if (eventEmited === event) {
        handler(...args)

        return !isOnceType
      }

      return true
    })
  }
}
