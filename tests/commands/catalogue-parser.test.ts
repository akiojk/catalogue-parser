import { parse } from '../../src/utils/catalogue-parser';
import { runWithAnswers, ENTER } from '../utils';
import * as utils from '../../src/utils';

// silence outputs
jest.mock('inquirer/lib/utils/screen-manager');
jest.mock('../../src/utils');

const logInfo = jest.spyOn(utils, 'logInfo');
const renderQuestion = jest.spyOn(
	require('inquirer/lib/utils/screen-manager').prototype,
	'render'
);

afterEach(() => {
	logInfo.mockReset();
	renderQuestion.mockReset();
});

describe('parser', () => {
	const barcodesA = [{ 'SupplierID': '00001', 'SKU': '647-vyk-317', 'Barcode': 'z2783613083817' }];
	const barcodesB = [{ 'SupplierID': '00001', 'SKU': '947-vyk-317', 'Barcode': 'z2783613083817' },
	{ 'SupplierID': '00002', 'SKU': '647-vyk-317', 'Barcode': 'z2783613083818' }];
	const suppliersA = [{ 'ID': '00001', 'Name': 'Twitterbridge' }, { 'ID': '00002', 'Name': 'Thoughtsphere' }];
	const suppliersB = [{ 'ID': '00001', 'Name': 'Wikivu' }, { 'ID': '00002', 'Name': 'Divavu' }];
	const catalogA = [{ 'SKU': '647-vyk-317', 'Description': 'Walkers Special Old Whiskey' }];
	const catalogB = [{ 'SKU': '647-vyk-317', 'Description': 'Another Walkers Special Old Whiskey' },
	{ 'SKU': '947-vyk-317', 'Description': 'Bread - Raisin' }];

	it('should give correct filtered down results', () => {
		const results = parse(barcodesA, barcodesB, catalogA, catalogB, suppliersA, suppliersB);
		expect(results.length).toBe(2);
		expect(results.map(res => res['Source'])).toContain('B');
	});
});
