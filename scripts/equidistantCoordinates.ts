import {
  getDistance,
  getGreatCircleBearing,
  computeDestinationPoint,
} from 'geolib';

import { Coordinate } from '../src/types';

// TODO: consider a distance of 5 and an increment of 2. Coordinate after 4 is not generated – is this OK?
export const equidistantCoordinates = (
  coordinates: Coordinate[],
  increment = 2,
): Coordinate[] => {
  const equidistantCoordinates: Coordinate[] = [];

  let cursor = 0;
  let totalDistance = 0;

  coordinates.forEach((current, i) => {
    const next = coordinates[i + 1];

    if (!next) {
      return;
    }

    const previousDistance = totalDistance;
    totalDistance += getDistance(current, next, 0.01);

    let bearing;

    while (cursor < totalDistance) {
      if (!bearing) {
        bearing = getGreatCircleBearing(current, next);
      }

      const coordinate = computeDestinationPoint(
        current,
        cursor - previousDistance,
        bearing,
      );

      equidistantCoordinates.push({
        lat: coordinate.latitude,
        lng: coordinate.longitude,
      });

      cursor += increment;
    }
  });

  return equidistantCoordinates;
};
