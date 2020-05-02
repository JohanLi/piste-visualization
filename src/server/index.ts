import express, { Request, Response } from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';

import {
  insertPiste,
  insertResort,
  resortByUrlKey,
  updatePiste,
  updateResort,
} from './repository';
import { cache } from './database';
import { Coordinate, Graph } from '../types';
import { createSlug } from './utils';
import { equidistantCoordinates } from '../../scripts/equidistantCoordinates';
import { altitudeAt, WGS84toSWEREF99TM } from '../../scripts/lib/lantmateriet';

const app = express();

app.use(express.json());
app.use(cors());

// TODO: database
app.get(
  '/piste',
  async (
    req: Request<{}, {}, {}, { resort: string; piste: string }>,
    res: Response,
  ) => {
    const { resort, piste } = req.query;

    try {
      const coordinates = await fs.readFile(
        `./src/server/data/${resort}-${piste}-coordinates.json`,
        'utf-8',
      );

      res.json(JSON.parse(coordinates));
    } catch (e) {
      res.json([]);
    }
  },
);

app.post(
  '/piste',
  async (
    req: Request<
      {},
      {},
      { resort: string; piste: string; coordinates: Coordinate[] }
    >,
    res: Response,
  ) => {
    const { resort, piste, coordinates } = req.body;

    await fs.writeFile(
      `./src/server/data/${resort}-${piste}-coordinates.json`,
      JSON.stringify(coordinates, null, 2),
    );

    res.sendStatus(200);
  },
);

app.put(
  '/resort',
  async (
    req: Request<{}, {}, { id?: number; name: string }>,
    res: Response,
  ) => {
    let { id } = req.body;
    const { name } = req.body;
    const slug = createSlug(name);

    if (!id) {
      id = await insertResort({ name, slug });
    } else {
      await updateResort({ id, name, slug });
    }

    res.json({ id, name, slug });
  },
);

app.put(
  '/piste',
  async (
    req: Request<
      {},
      {},
      {
        id?: number;
        resortUrlKey: string;
        name: string;
        path: Coordinate[];
      }
    >,
    res: Response,
  ) => {
    let { id } = req.body;
    const { resortUrlKey, name, path } = req.body;
    const resortId = await resortByUrlKey(resortUrlKey);

    const slug = createSlug(name);

    const graph: Graph[] = [];
    const increment = 2; // the resolution of Lantmäteriet's altitude data
    let totalDistance = 0;

    const equidistantPath = equidistantCoordinates(path, increment);

    for (const coordinate of equidistantPath) {
      const altitudeKey = `altitude:${coordinate.lat}:${coordinate.lng}`;
      const altitudeCache = await cache.get(altitudeKey);
      let altitude = 0;

      if (altitudeCache === null) {
        const swerefCoordinate = await WGS84toSWEREF99TM(coordinate);
        altitude = await altitudeAt(swerefCoordinate);
        await cache.set(altitudeKey, altitude);
      } else {
        altitude = Number(altitudeCache);
      }

      graph.push({
        x: totalDistance,
        y: altitude,
      });

      totalDistance += increment;
    }

    if (!id) {
      id = await insertPiste({ resortId, name, slug, path, graph });
    } else {
      await updatePiste({ id, resortId, name, slug, path, graph });
    }

    res.json({ id, resortId, name, slug, path, graph });
  },
);

const port = 8081;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/`);
});
