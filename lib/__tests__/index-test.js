import { existsSync, readFile } from 'fs'

import FileHound from 'filehound'
import fetch from 'node-fetch'
import path from 'path'
import { upload } from '..'

jest.mock('filehound', () => {
	function FileHound() {
		return this
	}

	FileHound.create = () => {
		return FileHound
	}
	FileHound.paths = jest.fn(() => {
		return FileHound
	})
	FileHound.discard = () => {
		return FileHound
	}
	FileHound.match = () => {
		return FileHound
	}
	FileHound.find = jest
		.fn()
		.mockReturnValueOnce(Promise.resolve([]))
		.mockReturnValueOnce(Promise.resolve(['testpath']))

	return FileHound
})

jest.mock('fs', () => {
	return {
		existsSync: jest.fn(() => true),
		readFile: jest.fn((_a, _b, cb) => cb(null, 'testreport')),
	}
})

jest.mock('path', () => {
	return {
		join: jest.fn(() => '/test/path/for/this/test/'),
	}
})

jest.mock('node-fetch', () => jest.fn(() => Promise.resolve()))

jest.spyOn(process, 'exit').mockImplementation(val => {
	if (val !== 0) throw new Error('exit')
})

const params = [
	'',
	'',
	'-b',
	'-t',
	'branch',
	'-n',
	'name',
	'-y',
	'users',
	'-p',
	'project',
	'-r',
	'repo',
	'-s',
	'http://test.server.com:12345/',
	'-d',
	'/test/directory/clover.xml',
	'-l',
	'http://test.server.com:12345/lcovReport/',
	'-a',
]

describe('upload', () => {
	beforeEach(() => {
		jest.spyOn(global.console, 'log').mockImplementation(() => undefined)
	})
	afterEach(() => {
		global.console.log.mockRestore()
		fetch.mockClear()
		process.exit.mockClear()
		path.join.mockClear()
		existsSync.mockClear()
		readFile.mockClear()
		FileHound.find.mockClear()
		FileHound.paths.mockClear()
	})

	it('should print help and quit on -h', () => {
		process.argv = ['', '', '-h', '-b']
		expect(() => upload()).toThrowError()
		expect(console.log).toMatchSnapshot()
	})

	it('should print error and quit if missing target', () => {
		process.argv = params.slice(0, 3)
		expect(() => upload()).toThrowError()
		expect(console.log).toMatchSnapshot()
	})

	it('should print error and quit if invalid target', () => {
		process.argv = params.slice(0, 4).concat(['invalidValue'])
		expect(() => upload()).toThrowError()
		expect(console.log).toMatchSnapshot()
	})

	it('should print error and quit if missing name', () => {
		process.argv = params.slice(0, 5)
		expect(() => upload()).toThrowError()
		expect(console.log).toMatchSnapshot()
	})

	it('should print error and quit if missing type', () => {
		process.argv = params.slice(0, 7)
		expect(() => upload()).toThrowError()
		expect(console.log).toMatchSnapshot()
	})

	it('should print error and quit if invalid type', () => {
		process.argv = params.slice(0, 8).concat(['invalid'])
		expect(() => upload()).toThrowError()
		expect(console.log).toMatchSnapshot()
	})

	it('should print error and quit if missing project', () => {
		process.argv = params.slice(0, 9)
		expect(() => upload()).toThrowError()
		expect(console.log).toMatchSnapshot()
	})

	it('should print error and quit if missing repo', () => {
		process.argv = params.slice(0, 11)
		expect(() => upload()).toThrowError()
		expect(console.log).toMatchSnapshot()
	})

	it('should print error and quit if missing repo', () => {
		process.argv = params.slice(0, 11)
		expect(() => upload()).toThrowError()
		expect(console.log).toMatchSnapshot()
	})

	it('should print error and quit if missing server', () => {
		process.argv = params.slice(0, 13)
		expect(() => upload()).toThrowError()
		expect(console.log).toMatchSnapshot()
	})

	it('should find test report and upload it to the server', async () => {
		process.argv = params.slice(0, 15)

		await upload()

		expect(FileHound.find).toBeCalledTimes(2)
		expect(FileHound.paths.mock.calls[1]).toMatchSnapshot()
		expect(existsSync).toBeCalledTimes(0)
		expect(readFile).toBeCalledTimes(1)

		expect(fetch.mock.calls).toMatchSnapshot()
	})

	it('should use passed in report and upload it to the server', async () => {
		process.argv = params.slice(0, 17)

		await upload()

		expect(FileHound.find).toBeCalledTimes(0)
		expect(existsSync).toBeCalledTimes(1)
		expect(readFile).toBeCalledTimes(1)

		expect(console.log).toMatchSnapshot()
		expect(fetch.mock.calls).toMatchSnapshot()
	})

	it('should also pass lcov prop to fetch', async () => {
		process.argv = params.slice(0, 19)

		await upload()

		expect(FileHound.find).toBeCalledTimes(0)
		expect(existsSync).toBeCalledTimes(1)
		expect(readFile).toBeCalledTimes(1)

		expect(console.log).toMatchSnapshot()
		expect(fetch.mock.calls).toMatchSnapshot()
	})

	it('should also pass task = true prop to fetch', async () => {
		process.argv = params.slice(0, 20)

		await upload()

		expect(FileHound.find).toBeCalledTimes(0)
		expect(existsSync).toBeCalledTimes(1)
		expect(readFile).toBeCalledTimes(1)

		expect(console.log).toMatchSnapshot()
		expect(fetch.mock.calls).toMatchSnapshot()
	})

	it('should go into catch on error', async () => {
		process.argv = params.slice(0, 17)
		readFile.mockImplementation((a, b, cb) => cb(true, null))
		let error
		try {
			await upload()
		} catch (err) {
			error = err
		}
		expect(error).toBeTruthy()
		expect(FileHound.find).toBeCalledTimes(0)
		expect(existsSync).toBeCalledTimes(1)
		expect(readFile).toBeCalledTimes(1)

		expect(console.log).toMatchSnapshot()
		expect(fetch).toBeCalledTimes(0)
	})
})
