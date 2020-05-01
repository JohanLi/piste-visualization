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
import { Coordinate, Graph } from '../types';
import { slugify } from './utils';

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
    const urlKey = slugify(name);

    if (!id) {
      id = await insertResort({ name, urlKey });
    } else {
      await updateResort({ id, name, urlKey });
    }

    res.json({ id, name, urlKey });
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
        graph: Graph[];
      }
    >,
    res: Response,
  ) => {
    let { id } = req.body;
    const { resortUrlKey, name, path, graph } = req.body;

    const resortId = await resortByUrlKey(resortUrlKey);
    const urlKey = slugify(name);

    if (!id) {
      id = await insertPiste({ resortId, name, urlKey, path, graph });
    } else {
      await updatePiste({ id, resortId, name, urlKey, path, graph });
    }

    res.json({ id, resortId, name, urlKey, path, graph });
  },
);

const port = 8081;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/`);
});
