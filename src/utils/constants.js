const projectName = 'iGen'

/** Default fallback of the remaining time if not time is provided (10min) */
const defaultTime = 600

/** Minimum allowed time to be set on the timer*/
const MIN_TIME = 0

/** Maximum allowed time to be set on the timer (99hs 59min 59sec) */
const MAX_TIME = 215999

// TODO: change to 750px
/** Mobile view max width breakpoint */
const mobileViewMQ = '(max-width: 650px)'

export { projectName, mobileViewMQ, defaultTime, MIN_TIME, MAX_TIME }
