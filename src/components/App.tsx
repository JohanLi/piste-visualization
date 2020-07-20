import React, { ReactElement } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { Graph2 } from './Graph2';
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
      <Switch>
        <Route path="/graph2">
          <Graph2 />
        </Route>
        <Route path="/:resortSlug?/:pisteSlug?">
          <Menu />
          <Editor />
        </Route>
      </Switch>
    </div>
  </>
);
