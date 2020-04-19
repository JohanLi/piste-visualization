import React, { ReactElement } from 'react';
import { Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { Menu } from './Menu';
import { Editor } from './Editor';

import styles from './app.css';

export const App = (): ReactElement => (
  <>
    <Helmet
      titleTemplate="%s - Piste Visualization"
      defaultTitle="Piste Visualization"
    />
    <div className={styles.app}>
      <Route path="/:resort?/:piste?">
        <Menu />
        <Editor />
      </Route>
    </div>
  </>
);
