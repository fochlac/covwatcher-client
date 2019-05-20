import fetch from 'node-fetch'
import { findReport } from './find-report'
import { getValidatedSettings } from './settings';

export function upload() {
	const {
		name,
		target,
		type,
		project,
		repo,
		server,
		errorCode,
		directory,
		task,
		lcov
	} = getValidatedSettings()

	return findReport(directory)
		.then(report => fetch(`${server}/api/${target}`, {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name,
				repository: { type, project, repo },
				report,
				lcov,
				task
			})
		}))
		.then(() => {
			console.log('Successfully uploaded coverage report.')
			process.exit(0)
		})
		.catch(err => {
			console.log('Error uploading coverage report:\n', err)
			process.exit(errorCode)
		})
}
