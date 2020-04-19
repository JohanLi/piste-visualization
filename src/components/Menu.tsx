import React, { ReactElement } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import styles from './menu.css';

const resorts = [
  {
    name: 'Björnrike',
    urlKey: 'bjornrike',
    pistes: [
      {
        name: 'Kodiak',
        urlKey: 'kodiak',
      },
      {
        name: 'Riket',
        urlKey: 'riket',
      },
    ],
  },
  {
    name: 'Åre',
    urlKey: 'are',
    pistes: [
      {
        name: 'Gästrappet',
        urlKey: 'gastrappet',
      },
    ],
  },
];

// TODO: load from backend, and error handling
export const Menu = (): ReactElement => {
  const { resort, piste } = useParams<{ resort: string; piste: string }>();

  const currentResort = resorts.find((r) => r.urlKey === resort);
  const currentPiste = currentResort?.pistes.find((p) => p.urlKey === piste);

  return (
    <div className={styles.menu}>
      {currentPiste && (
        <Helmet title={`${currentPiste?.name}, ${currentResort?.name}`} />
      )}
      <ul>
        {resorts.map((resort) => {
          const piste = resort.pistes.map((p) => (
            <li key={p.urlKey}>
              <Link to={`/${resort.urlKey}/${p.urlKey}`}>{p.name}</Link>
            </li>
          ));

          return (
            <li key={resort.urlKey}>
              {resort.name}
              <ul>{piste}</ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
