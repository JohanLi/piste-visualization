import React, { ReactElement } from 'react';
import { Switch, Route } from 'react-router-dom';
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
      <Switch>
        <Route path="/" exact component={Menu} />
        <Route path="/:resort/:piste" component={Menu} />
      </Switch>
      <Editor />
    </div>
  </>
);
