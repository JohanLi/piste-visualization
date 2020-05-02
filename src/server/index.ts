import express, { Request, Response } from 'express';
import cors from 'cors';

import {
  insertPiste,
  insertResort,
  pisteBySlug,
  resortsAndPistes,
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

app.get('/resort', async (_req: Request, res: Response) => {
  try {
    const resorts = (await resortsAndPistes()).map((resort) => {
      const names = resort.pisteNames.split(',');
      const slugs = resort.pisteSlugs.split(',');

      return {
        name: resort.name,
        slug: resort.slug,
        pistes: names.map((name, i) => ({
          name,
          slug: slugs[i],
        })),
      };
    });

    res.json(resorts);
  } catch (e) {
    res.json([]);
  }
});

app.get(
  '/piste',
  async (req: Request<{}, {}, {}, { slug: string }>, res: Response) => {
    const { slug } = req.query;

    try {
      const piste = await pisteBySlug(slug);
      res.json(piste);
    } catch (e) {
      res.json([]);
    }
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
        resortId: number;
        name: string;
        path: Coordinate[];
      }
    >,
    res: Response,
  ) => {
    let { id } = req.body;
    const { resortId, name, path } = req.body;

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
