const { execSync } = require('child_process')
const { version } = require('../package.json')
const tag = execSync('git describe --tags')

if (!tag.includes(version)) {
	try {
		console.log('-- SET GIT CONFIG --')
		execSync('git config --global user.email "low@fochlac.com"')
		execSync('git config --global user.name "Circle Ci Build Bot"')
		console.log('-- PUBLISH PACKAGE --')
		execSync('npm publish')
		console.log('-- TAG COMMIT --')
		execSync(`git tag -a release/${version} -m "created tag"`)
		console.log('-- PUSH TAG --')
		execSync('git push --tags')
	} catch (err) {
		process.exit(-1)
	}
} else {
	console.log('No publish needed')
}
