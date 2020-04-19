import React, { ReactElement } from 'react';
import { VictoryChart, VictoryStack, VictoryGroup, VictoryArea } from 'victory';

import styles from './graph.css';

export const Graph = (): ReactElement => (
  <div className={styles.graph}>
    <VictoryChart scale={{ x: 'linear' }} width={400} height={200}>
      <VictoryStack colorScale="warm">
        <VictoryGroup
          data={[
            { x: 0, y: 400 },
            { x: 10, y: 350 },
            { x: 20, y: 250 },
            { x: 30, y: 0 },
          ]}
        >
          <VictoryArea />
        </VictoryGroup>
        <VictoryGroup
          data={[
            { x: 0, y: 600 },
            { x: 10, y: 525 },
            { x: 20, y: 500 },
            { x: 30, y: 450 },
            { x: 40, y: 350 },
            { x: 50, y: 300 },
            { x: 60, y: 120 },
            { x: 70, y: 0 },
          ]}
        >
          <VictoryArea />
        </VictoryGroup>
      </VictoryStack>
    </VictoryChart>
  </div>
);
