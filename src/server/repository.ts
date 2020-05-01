import { database } from './database';
import { Coordinate, Graph } from '../types';

export interface Resort {
  id?: number;
  name: string;
  urlKey: string;
}

export interface Piste {
  id?: number;
  resortId: number;
  name: string;
  urlKey: string;
  path: Coordinate[];
  graph: Graph[];
}

export const resortByUrlKey = async (urlKey: string): Promise<number> => {
  const result = await database.query<{ id: number }>(
    `
    SELECT id
    FROM resorts
    WHERE url_key = $1
  `,
    [urlKey],
  );

  return result.rows[0].id;
};

export const insertResort = async (resort: Resort): Promise<number> => {
  const { name, urlKey } = resort;

  const result = await database.query<{ id: number }>(
    `
    INSERT INTO resorts (name, url_key)
    VALUES ($1, $2)
    RETURNING id
  `,
    [name, urlKey],
  );

  return result.rows[0].id;
};

export const updateResort = async (resort: Resort): Promise<boolean> => {
  const { id, name, urlKey } = resort;

  const result = await database.query(
    `
    UPDATE resorts
    SET name = $2, url_key = $3
    WHERE id = $1
  `,
    [id, name, urlKey],
  );

  return Boolean(result.rowCount);
};

export const insertPiste = async (piste: Piste): Promise<number> => {
  const { resortId, name, urlKey, path, graph } = piste;

  const result = await database.query<{ id: number }>(
    `
    INSERT INTO pistes (resort_id, name, url_key, path, graph)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  `,
    [resortId, name, urlKey, JSON.stringify(path), JSON.stringify(graph)],
  );

  return result.rows[0].id;
};

export const updatePiste = async (piste: Piste): Promise<boolean> => {
  const { id, resortId, name, urlKey, path, graph } = piste;

  const result = await database.query<{ id: number }>(
    `
    UPDATE pistes
    SET resort_id = $2, name = $3, url_key = $4, path = $5, graph = $6
    WHERE id = $1
  `,
    [id, resortId, name, urlKey, JSON.stringify(path), JSON.stringify(graph)],
  );

  return Boolean(result.rowCount);
};
