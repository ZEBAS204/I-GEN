import { readFileSync } from 'fs'
import { resolve } from 'path'

const dir = (e) => resolve(__dirname, e)

/**
 * Get the last commit revision id of the current branch of the project
 * @returns {string}
 */
export const getGitRevision = () => {
	try {
		const rev = readFileSync(dir('../.git/HEAD')).toString().trim()
		if (rev.indexOf(':') === -1) {
			return rev
		}

		return readFileSync(dir(`../.git/${rev.substring(5)}`))
			.toString()
			.trim()
			.slice(0, 7)
	} catch (err) {
		console.error('Failed to get Git revision.', err)
		return '?'
	}
}

/**
 * Get the current git branch of the project
 * @returns {string}
 */
export const getGitBranch = () => {
	try {
		const rev = readFileSync(dir('../.git/HEAD')).toString().trim()
		if (rev.indexOf(':') === -1) {
			return 'DETACHED'
		}

		return rev.split('/').pop()
	} catch (err) {
		console.error('Failed to get Git branch.', err)
		return '?'
	}
}
