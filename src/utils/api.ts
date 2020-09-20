import axios from 'axios';
import { Graph as GraphType } from '../types';

interface Resort {
  name: string;
  slug: string;
  pistes: Piste[];
}

interface Piste {
  name: string;
  slug: string;
}

export const getResorts = axios
  .request<Resort[]>({
    method: 'get',
    url: 'http://localhost:8081/resort',
  })
  .then((response) => response.data);

export const getGraph = (
  pisteSlugs: string[],
): Promise<{ name: string; slug: string; graph: GraphType[] }[]> =>
  axios
    .request<{ name: string; slug: string; graph: GraphType[] }[]>({
      method: 'get',
      url: 'http://localhost:8081/graph',
      params: {
        pisteSlugs,
      },
    })
    .then((response) => response.data);
