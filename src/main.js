import * as core from '@actions/core'
import * as github from '@actions/github'

function getReviewState(state) {
  switch (state) {
    case 'approved':
      return {text: 'approved', emoji: ':white_check_mark:'}
    case 'changes_requested':
      return {text: 'changes requested', emoji: ':pencil:'}
    case 'commented':
      return {text: 'commented', emoji: ':speech_balloon:'}
    case 'dismissed':
      return {text: 'dismissed', emoji: ':negative_squared_cross_mark:'}
    case 'rejected':
      return {text: 'rejected', emoji: ':no_entry_sign:'}
    default:
      return {text: 'unknown', emoji: ':question:'}
  }
}

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run() {
  try {
    // parse github.context.payload
    const payload = github.context.payload
    const prTitle = payload.pull_request.title
    const reviewState = payload.review.state
    const comment = payload.review.review.body
    const prUrl = payload.pull_request._links.html.href

    core.info(`PR Title: ${prTitle}`)
    core.info(`Comment: ${comment}`)
    core.info(`Review State: ${JSON.stringify(getReviewState(reviewState))}`)
    core.info(`PR URL: ${prUrl}`)

    // Get the current time and set as an output
    const time = new Date().toTimeString()
    core.setOutput('time', time)

    // Output the payload for debugging
    core.info(
      `The event payload: ${JSON.stringify(github.context.payload, null, 2)}`
    )
  } catch (error) {
    // Fail the workflow step if an error occurs
    core.setFailed(error.message)
  }
}
