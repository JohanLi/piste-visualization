import React, { ReactElement, useEffect, useState } from 'react';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import { Container, Grid } from '@material-ui/core';
import { Clear } from '@material-ui/icons';

import styles from './graph2.css';
import { getResorts, getGraph } from '../utils/api';
import { Graph as GraphType } from '../types';
import { Graph } from './Graph';

interface Piste {
  name: string;
  slug: string;
  resort: {
    name: string;
    slug: string;
  };
}

const palette = ['#ffa600', '#d45087', '#665191', '#003f5c'];

export const Graph2 = (): ReactElement | null => {
  const [value, setValue] = React.useState<Piste | null>(null);
  const [inputValue, setInputValue] = React.useState('');

  // ['hallas-hang', 'riket', 'kopparbacken']
  const [selectedPisteSlugs, setSelectedPisteSlugs] = useState<string[]>([]);

  const [pistes, setPistes] = useState<Piste[]>([]);

  const [pistes2, setPistes2] = useState<
    { name: string; slug: string; graph: GraphType[] }[]
    >([]);

  useEffect(() => {
    getResorts.then((resorts) => {
      const pistes: Piste[] = [];

      resorts.forEach((resort) => {
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
    })
  }, []);

  useEffect(() => {
    if (!selectedPisteSlugs.length) {
      setPistes2([]);
      return;
    }

    getGraph(selectedPisteSlugs).then((response) => {
      setPistes2(response);
    })
  }, [selectedPisteSlugs])

  if (!pistes.length) {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Grid container alignItems="center">
        {selectedPisteSlugs.map((slug, i) => {
          const piste = pistes.find((p) => p.slug === slug);

          if (!piste) {
            return null;
          }

          return (
            <Grid item xs={12} md key={slug}>
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
                <div className={styles.clear}
                     onClick={() => setSelectedPisteSlugs(selectedPisteSlugs.filter((s) => s !== slug))}>
                  <Clear style={{ color: '#999' }}/>
                </div>
              </div>
            </Grid>
          );
        })}
        {!(selectedPisteSlugs.length >= palette.length) && (
          <Grid item xs={12} md>
            <Autocomplete
              className={styles.autocomplete}
              value={value}
              inputValue={inputValue}
              onInputChange={(_, newInputValue) => {
                setInputValue(newInputValue);
              }}
              options={pistes.filter((p) => !selectedPisteSlugs.includes(p.slug))}
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
                  setSelectedPisteSlugs([...selectedPisteSlugs, newValue.slug]);
                }

                setInputValue('');
                setValue(null);
              }}
            />
          </Grid>
        )}
      </Grid>
      <Grid container>
        <Grid item xs>
          <Graph pistes={pistes2} />
        </Grid>
      </Grid>
    </Container>
  );
};

// TODO consider displaying a dialog for users to suggest new pistes
