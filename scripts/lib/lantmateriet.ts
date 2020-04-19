import axios from 'axios';

interface Coordinate {
  lng: number;
  lat: number;
}

interface SWEREF99TMCoordinate {
  n: number;
  e: number;
}

export const WGS84toSWEREF99TM = async (coordinate: Coordinate): Promise<SWEREF99TMCoordinate> => {
  const { data } = await axios.get('https://www.lantmateriet.se/api/epi/Transform', {
    params: {
      type: '2',
      x: coordinate.lat,
      y: coordinate.lng,
      z: '0',
      id: '16461',
    },
  });

  const SWEREF99TM = JSON.parse(data).responses[1];

  return {
    n: Number(SWEREF99TM.CalculatedX),
    e: Number(SWEREF99TM.CalculatedY),
  };
};

export const altitudeAt = async (coordinate: SWEREF99TMCoordinate): Promise<number> => {
  const { data } = await axios.get(`https://kso.etjanster.lantmateriet.se/height/${coordinate.n}/${coordinate.e}`);
  return data;
};


