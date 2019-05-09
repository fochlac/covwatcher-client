import fetch from 'node-fetch'
import { findReport } from './find-report'
import minimist from 'minimist'

export function upload() {
	const {
		n = process.env.COVWATCHER_BRANCH_NAME,
		t = process.env.COVWATCHER_BRANCH_TYPE,
		y = process.env.COVWATCHER_REPO_TYPE,
		p = process.env.COVWATCHER_REPO_PROJECT,
		r = process.env.COVWATCHER_REPO,
		s = process.env.COVWATCHER_SERVER,
		d = process.env.COVWATCHER_REPORT,
		l,
		b,
		h,
		a,
	} = minimist(process.argv.slice(2))
	const {
		name = n,
		target = t,
		type = y,
		project = p,
		repo = r,
		server = s,
		bail = b,
		directory = d,
		help = h,
		task = a,
		lcov = l
	} = minimist(process.argv.slice(2))

	if (help) {
		console.log(
			'	-n	--name		[name]			name of the branch or if this is a pullrequest its id\n',
			'	-t	--target	[target]		branchtype, can be "branch" or "pullrequest"\n',
			'	-y	--type		[type]			repository type, can be "users" or "project"\n',
			'	-p	--project	[projectname]	name of the project or user the repository is part of\n',
			'	-r	--repo		[repo]			name of the repository\n',
			'	-s	--server	[server]		full url to the server running covwatcher. defaults to "localhost:51337"\n',
			'	-d	--directory	[directory]		full path to the coverage report\n',
			'	-l	--lcov		[server]		url to a hosted lcov report\n',
			'	-a	--task						whether to create a task if the diff coverage is low\n',
			'	-b	--bail						whether to throw on error"\n',
			'	-h	--help						print help\n',
		)
		process.exit(0)
	}

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
	if (!type || !['users', 'projects'].includes(type)) {
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
	if (!server) {
		console.log(
			'Error in command line arguments: --server is required. Please define the url of the server.',
		)
		process.exit(errorCode)
	}

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
