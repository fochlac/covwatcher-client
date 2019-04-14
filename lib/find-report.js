import { existsSync, readFile } from 'fs'

import FileHound from 'filehound'
import path from 'path'

function searchDirectory(dirname, isInitialRun) {
	if (!isInitialRun) {
		console.log('Searching for coverage report. currently searching folder: ' + dirname)
	}
	return FileHound.create()
		.paths(dirname)
		.discard(['.*node_modules.*', '.*\\.git.*'])
		.match('clover.xml')
		.find()
		.then(files => {
			if (files.length) {
				console.log('Found report at: ' + files[0])
				return new Promise((resolve, reject) =>
					readFile(files[0], 'utf8', (err, data) => (err ? reject(err) : resolve(data))),
				)
			}
			if (dirname === path.join(dirname, '..')) {
				return Promise.reject('Unable to find a coverage report.')
			}
			return searchDirectory(path.join(dirname, '..'))
		})
}

export const findReport = path => {
	if (path && existsSync(path)) {
		return new Promise((resolve, reject) =>
			readFile(path, 'utf8', (err, data) => (err ? reject(err) : resolve(data))),
		)
	}

	const dirname = __dirname.split('node_modules')[0]
	console.log('Searching for coverage report. Starting recursive search at: ' + dirname)
	return searchDirectory(dirname, true)
}
