import React, { ReactElement, useState } from 'react';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

interface Piste {
  name: string;
  resort: string;
}

const limit = 4; // based on palette
const pistes = [
  { name: 'Kodiak', resort: 'Björnrike' },
  { name: 'Riket', resort: 'Björnrike' },
  { name: 'Götes Brant', resort: 'Romme Alpin' },
  { name: 'Hällas Hang', resort: 'Romme Alpin' },
  { name: 'Ravinen', resort: 'Romme Alpin' },
  { name: 'Gästrappet', resort: 'Åre' },
  { name: 'Slalombacken', resort: 'Åre' },
];

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
      margin: '40px',
    },
  }),
);

// while sorting can be done within Autocomplete, the backend will take care of returning sorted data
export const Graph2 = (): ReactElement => {
  const [value, setValue] = useState<Piste[]>([]);
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Autocomplete
            multiple
            options={pistes}
            groupBy={(option) => option.resort}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Compare pistes"
                placeholder="Piste"
              />
            )}
            style={{ width: 500, margin: '0 auto' }}
            value={value}
            onChange={(_event, newValue) => {
              if (newValue.length < limit) {
                setValue(newValue);
              } else {
                setValue(
                  newValue
                    .slice(0, limit - 1)
                    .concat(newValue[newValue.length - 1]),
                );
              }
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
};
