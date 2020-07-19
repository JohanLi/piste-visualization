import React, { ReactElement, useEffect, useState } from 'react';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import { Container, Grid } from '@material-ui/core';
import axios from 'axios';

import styles from './graph2.css';

interface Piste {
  name: string;
  slug: string;
  resort: {
    name: string;
    slug: string;
  };
}

interface Resorts {
  name: string;
  slug: string;
  pistes: {
    name: string;
    slug: string;
  }[];
}

const palette = ['#ffa600', '#d45087', '#665191', '#003f5c'];
const limit = palette.length;

// while sorting can be done within Autocomplete, the backend will take care of returning sorted data
export const Graph2 = (): ReactElement => {
  const [selected, setSelected] = useState<string[]>([]); // ['hallas-hang', 'riket', 'kopparbacken']
  const [pistes, setPistes] = useState<Piste[]>([]);
  const [inputValue, setInputValue] = React.useState('');
  const [value, setValue] = React.useState<Piste | null>(null);

  useEffect(() => {
    axios
      .request<Resorts[]>({
        method: 'get',
        url: 'http://localhost:8081/resort',
      })
      .then((response) => {
        const pistes: Piste[] = [];

        response.data.forEach((resort) => {
          resort.pistes.forEach((piste) => {
            pistes.push({
              ...piste,
              resort: {
                name: resort.name,
                slug: resort.slug,
              },
            });
          });
        });

        setPistes(pistes);
      });
  }, []);

  if (!pistes.length) {
    return <div>loading...</div>;
  }

  console.log(inputValue);

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} alignItems="center">
        {selected.map((s, i) => {
          const piste = pistes.find((p) => p.slug === s);

          if (!piste) {
            return null;
          }

          return (
            <Grid item xs key={s}>
              <div className={styles.pisteWrapper}>
                <div>
                  <span
                    className={styles.dot}
                    style={{ backgroundColor: palette[i] }}
                  />
                </div>
                <div className={styles.pisteResort}>
                  <div>{piste.name}</div>
                  <div className={styles.resort}>{piste.resort.name}</div>
                </div>
              </div>
            </Grid>
          );
        })}
        {!(selected.length >= 4) && (
          <Grid item xs>
            <Autocomplete
              className={styles.autocomplete}
              value={value}
              inputValue={inputValue}
              onInputChange={(_, newInputValue) => {
                setInputValue(newInputValue);
              }}
              options={pistes.filter((p) => !selected.includes(p.slug))}
              groupBy={(option) => option.resort.name}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Add piste"
                  InputProps={{
                    ...params.InputProps,
                    disableUnderline: true,
                  }}
                />
              )}
              clearOnBlur
              autoHighlight
              blurOnSelect
              onChange={(_, newValue) => {
                if (newValue) {
                  setSelected([...selected, newValue.slug]);
                }

                setInputValue('');
                setValue(null);
              }}
            />
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

// TODO consider displaying a dialog for users to suggest new pistes
