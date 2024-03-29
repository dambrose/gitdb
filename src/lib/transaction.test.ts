import {describe, expect, test} from '@jest/globals';

import transaction, {transactions} from './transaction.js';

describe('transaction', () => {

	test('abc', async () => {

		const array = await transaction(() => Promise.all([
			timeout(() => 'a', 300),
			timeout(() => 'b', 200),
			timeout(() => 'c', 100)
		]));
		expect(array.join('')).toBe('abc');

	});

	test('123', async () => {

		const array = [];

		const t1 = transaction(async () => {
			const a = [];
			a.push(await timeout(() => '1', 300));
			a.push(await timeout(() => '2', 200));
			a.push(await timeout(() => '3', 100));
			array.push(...a);
		});

		await t1;

		expect(array.join('')).toBe('123');

	});

	test('123456', async () => {

		const array = [];

		const t1 = transaction(async () => {
			const a = [];
			a.push(await timeout(() => '1', 300));
			a.push(await timeout(() => '2', 200));
			a.push(await timeout(() => '3', 100));
			array.push(...a);
		});

		const t2 = transaction(async () => {
			const a = [];
			a.push(await timeout(() => '4', 100));
			a.push(await timeout(() => '5', 200));
			a.push(await timeout(() => '6', 300));
			array.push(...a);
		});

		expect(transactions.length).toBe(2);

		await t1;

		expect(transactions.length).toBe(1);

		await t2;

		expect(transactions.length).toBe(0);
		expect(array.join('')).toBe('123456');

	});

	test('error 456', async () => {

		let array = [];

		const t1 = transaction(async () => {
			const a = [];
			a.push(await timeout(() => '1', 300));
			a.push(await timeout(() => 'e', 200));
			a.push(await timeout(() => '3', 100));
			array.push(...a);
		});

		const t2 = transaction(async () => {
			const a = [];
			a.push(await timeout(() => '4', 100));
			a.push(await timeout(() => '5', 200));
			a.push(await timeout(() => '6', 300));
			array.push(...a);
		});

		try {
			await t1;
		} catch (err) {
			//console.error(err.message);
		}

		try {
			await t2;
		} catch (err) {
			//console.error(err.message);
		}

		expect(array.join('')).toBe('456');

	});

});

function timeout(func: () => string, delay: number) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			const res = func();
			if (res === 'e') reject(new Error('Error e'));
			resolve(res);
		}, delay);
	});
}