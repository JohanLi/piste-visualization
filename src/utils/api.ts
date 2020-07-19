import axios from 'axios';

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
  .then((response) => {
    return response.data;
  });
