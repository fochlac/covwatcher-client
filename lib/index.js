import { findReport } from './find-report'
import minimist from 'minimist'
import { post } from 'axios'

export function upload() {
	const {
		name = process.env.COVWATCHER_BRANCH_NAME,
		target = process.env.COVWATCHER_BRANCH_TYPE,
		type = process.env.COVWATCHER_REPO_TYPE,
		project = process.env.COVWATCHER_REPO_PROJECT,
		repo = process.env.COVWATCHER_REPO,
		server = process.env.COVWATCHER_SERVER,
		bail,
	} = minimist(process.argv.slice(2))

	const errorCode = bail ? -1 : 0

	if (!['branch', 'pullrequest'].includes(target)) {
		console.log(
			"Error in command line arguments: --target is neither 'branch' nor 'pullrequest'.",
		)
		process.exit(errorCode)
	}
	if (!name) {
		console.log(
			'Error in command line arguments: --name is required. Please set the branchname / the id of the pullrequest.',
		)
		process.exit(errorCode)
	}
	if (!type || !['users', 'project'].includes(type)) {
		console.log(
			"Error in command line arguments: --type is required. Please define the type of the repository. Can be either 'users' or 'project'.",
		)
		process.exit(errorCode)
	}
	if (!project) {
		console.log(
			'Error in command line arguments: --project is required. Please define the name of the project or the user the repository belongs to.',
		)
		process.exit(errorCode)
	}
	if (!repo) {
		console.log(
			'Error in command line arguments: --repo is required. Please define the name of the repository.',
		)
		process.exit(errorCode)
	}

	findReport()
		.then(report =>
			post(`${server}/api/${target}`, {
				name,
				repository: { type, project, repo },
				report,
			}),
		)
		.then(() => {
			console.log('Successfully uploaded coverage report.')
			process.exit(0)
		})
		.catch(err => {
			console.log('Error uploading coverage report:\n', err)
			process.exit(errorCode)
		})
}
