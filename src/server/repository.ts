import { db } from './database';
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

export const getResorts = async (): Promise<
  {
    name: string;
    slug: string;
    pisteNames: string;
    pisteSlugs: string;
  }[]
> => {
  const result = await db.query(
    `
    SELECT
      r.name,
      r.slug,
      string_agg(p.name, ',') AS "pisteNames",
      string_agg(p.slug, ',') AS "pisteSlugs"
    FROM resorts r
    INNER JOIN pistes p ON p.resort_id = r.id
    GROUP BY r.id;
  `,
  );

  return result.rows;
};

export const insertResort = async (resort: Resort): Promise<number> => {
  const { name, slug } = resort;

  const result = await db.query(
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

  const result = await db.query(
    `
    UPDATE resorts
    SET name = $2, slug = $3
    WHERE id = $1
  `,
    [id, name, slug],
  );

  return Boolean(result.rowCount);
};

export const pisteBySlug = async (slug: string): Promise<Piste> => {
  const result = await db.query(
    `
    SELECT id, resort_id AS "resortId", name, slug, path, graph
    FROM pistes
    WHERE slug = $1
  `,
    [slug],
  );

  return result.rows[0];
};

export const insertPiste = async (piste: Piste): Promise<number> => {
  const { resortId, name, slug, path, graph } = piste;

  const result = await db.query(
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

  const result = await db.query(
    `
    UPDATE pistes
    SET resort_id = $2, name = $3, slug = $4, path = $5, graph = $6
    WHERE id = $1
  `,
    [id, resortId, name, slug, JSON.stringify(path), JSON.stringify(graph)],
  );

  return Boolean(result.rowCount);
};

export const getGraph = async (
  pisteSlugs: string[],
): Promise<{ name: string; slug: string; graph: Graph[] }[]> => {
  const result = await db.query(
    `
    SELECT name, slug, graph
    FROM pistes
    WHERE slug = ANY ($1)
  `,
    [pisteSlugs],
  );

  return result.rows.map((row) => ({
    name: row.name,
    slug: row.slug,
    graph: row.graph,
  }));
};
