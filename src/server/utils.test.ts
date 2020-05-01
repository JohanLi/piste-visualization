import { createSlug } from './utils';

test('slugify', () => {
  expect(createSlug('Björnrike')).toEqual('bjornrike');
  expect(createSlug('Åre')).toEqual('are');
  expect(createSlug('Romme Alpin')).toEqual('romme-alpin');
  expect(createSlug('4 Vallées')).toEqual('4-vallees');
  expect(createSlug('St. Anton')).toEqual('st-anton');
  expect(createSlug('ficTION&&al--Resort')).toEqual('fictional-resort');
});
