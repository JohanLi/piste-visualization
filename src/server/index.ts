import express, { Request, Response } from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';

const app = express();

app.use(express.json());
app.use(cors());

interface Coordinate {
  lng: number;
  lat: number;
}

// TODO: database
app.get(
  '/piste',
  async (
    req: Request<{}, {}, {}, { resort: string; piste: string }>,
    res: Response,
  ) => {
    const { resort, piste } = req.query;

    const coordinates = await fs.readFile(
      `./src/server/data/${resort}-${piste}-coordinates.json`,
      'utf-8',
    );

    res.json(JSON.parse(coordinates));
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
