import express, { Request, Response } from 'express';
import { promises as fs } from 'fs';

const app = express();

app.use(express.json());

interface Coordinate {
  lng: number;
  lat: number;
}

// TODO: database
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
