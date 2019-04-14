import { findReport } from '../find-report'

describe('findReport', () => {
	it('should find a report', () => {
		return findReport().then(result => {
			expect(result).toEqual('teststring\n')
		})
	})
})
