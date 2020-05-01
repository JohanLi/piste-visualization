import { database } from './database';
import { Coordinate, Graph } from '../types';

export interface Resort {
  id?: number;
  name: string;
  slug: string;
}

export interface Piste {
  id?: number;
  resortId: number;
  name: string;
  slug: string;
  path: Coordinate[];
  graph: Graph[];
}

export const resortByUrlKey = async (slug: string): Promise<number> => {
  const result = await database.query<{ id: number }>(
    `
    SELECT id
    FROM resorts
    WHERE slug = $1
  `,
    [slug],
  );

  return result.rows[0].id;
};

export const insertResort = async (resort: Resort): Promise<number> => {
  const { name, slug } = resort;

  const result = await database.query<{ id: number }>(
    `
    INSERT INTO resorts (name, slug)
    VALUES ($1, $2)
    RETURNING id
  `,
    [name, slug],
  );

  return result.rows[0].id;
};

export const updateResort = async (resort: Resort): Promise<boolean> => {
  const { id, name, slug } = resort;

  const result = await database.query(
    `
    UPDATE resorts
    SET name = $2, slug = $3
    WHERE id = $1
  `,
    [id, name, slug],
  );

  return Boolean(result.rowCount);
};

export const insertPiste = async (piste: Piste): Promise<number> => {
  const { resortId, name, slug, path, graph } = piste;

  const result = await database.query<{ id: number }>(
    `
    INSERT INTO pistes (resort_id, name, slug, path, graph)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  `,
    [resortId, name, slug, JSON.stringify(path), JSON.stringify(graph)],
  );

  return result.rows[0].id;
};

export const updatePiste = async (piste: Piste): Promise<boolean> => {
  const { id, resortId, name, slug, path, graph } = piste;

  const result = await database.query<{ id: number }>(
    `
    UPDATE pistes
    SET resort_id = $2, name = $3, slug = $4, path = $5, graph = $6
    WHERE id = $1
  `,
    [id, resortId, name, slug, JSON.stringify(path), JSON.stringify(graph)],
  );

  return Boolean(result.rowCount);
};
