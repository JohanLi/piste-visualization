import { WGS84toSWEREF99TM, altitudeAt } from './lantmateriet';

test('Able to convert WGS84 to SWEREF99TM', async () => {
  expect(
    await WGS84toSWEREF99TM({
      lat: 62.41438463737702,
      lng: 13.991788404712926,
    }),
  ).toEqual({ n: 6920750.599, e: 447912.769 });

  expect(
    await WGS84toSWEREF99TM({ lat: 63.4104436, lng: 13.0891908 }),
  ).toEqual({ n: 7032743.929, e: 404584.618 });
});

test('Able to obtain the altitude at a given SWEREF99TM coordinate', async () => {
  expect(await altitudeAt({ n: 6920750.599, e: 447912.769 })).toEqual(947);
  expect(await altitudeAt({ n: 7032743.929, e: 404584.618 })).toEqual(760);
});
