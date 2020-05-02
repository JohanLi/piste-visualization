import React, { ReactElement, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import styles from './menu.css';
import axios from 'axios';

interface Resorts {
  name: string;
  slug: string;
  pistes: {
    name: string;
    slug: string;
  }[];
}

// TODO: load from backend, and error handling
export const Menu = (): ReactElement => {
  const { resortSlug, pisteSlug } = useParams<{
    resortSlug: string;
    pisteSlug: string;
  }>();
  const [resorts, setResorts] = useState<Resorts[]>([]);

  useEffect(() => {
    axios
      .request<Resorts[]>({
        method: 'get',
        url: 'http://localhost:8081/resort',
      })
      .then((response) => {
        setResorts(response.data);
      });
  }, []);

  const currentResort = resorts.find((r) => r.slug === resortSlug);
  const currentPiste = currentResort?.pistes.find((p) => p.slug === pisteSlug);

  return (
    <div className={styles.menu}>
      {currentPiste && (
        <Helmet title={`${currentPiste?.name} (${currentResort?.name})`} />
      )}
      <Link to="/graph">Graph</Link>
      <ul>
        {resorts.map((resort) => {
          const piste = resort.pistes.map((p) => (
            <li key={p.slug}>
              <Link to={`/${resort.slug}/${p.slug}`}>{p.name}</Link>
            </li>
          ));

          return (
            <li key={resort.slug}>
              {resort.name}
              <ul>{piste}</ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
