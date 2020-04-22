import express, { Request, Response } from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';

import { Coordinate } from '../types';

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

const port = 8081;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/`);
});
