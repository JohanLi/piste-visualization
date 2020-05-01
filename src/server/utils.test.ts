import { slugify } from './utils';

test('slugify', () => {
  expect(slugify('Björnrike')).toEqual('bjornrike');
  expect(slugify('Åre')).toEqual('are');
  expect(slugify('Romme Alpin')).toEqual('romme-alpin');
  expect(slugify('4 Vallées')).toEqual('4-vallees');
  expect(slugify('St. Anton')).toEqual('st-anton');
  expect(slugify('ficTION&&al--Resort')).toEqual('fictional-resort');
});
