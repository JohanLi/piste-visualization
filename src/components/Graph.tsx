import React, { ReactElement, useEffect, useState } from 'react';
import { VictoryChart, VictoryGroup, VictoryArea } from 'victory';
import axios from 'axios';

import { Graph as GraphType } from '../types';

import styles from './graph.css';

const palette = [
  '#003f5c',
  // '#2f4b7c',
  '#665191',
  // '#a05195',
  '#d45087',
  // '#f95d6a',
  '#ff7c43',
  '#ffa600',
];

// TODO: Investigate how to display pistes with short vertical drops, e.g. "ravinen"
export const Graph = (): ReactElement => {
  const [a, setA] = useState<
    { name: string; slug: string; graph: GraphType[] }[]
  >([]);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    axios
      .request<{ name: string; slug: string; graph: GraphType[] }[]>({
        method: 'get',
        url: 'http://localhost:8081/graph',
        params: {
          pisteSlugs: 'gastrappet,kodiak,riket,hallas-hang',
        },
      })
      .then((response) => {
        let globalMaxAltitude = 0;
        let globalMaxDistance = 0;

        response.data.forEach((b) => {
          // not the most efficient algorithm – used here due to simplicity
          const altitudes = b.graph.map((d) => d.y);
          const minAltitude = Math.min(...altitudes);
          const maxAltitude = Math.max(...altitudes) - minAltitude;

          if (maxAltitude > globalMaxAltitude) {
            globalMaxAltitude = maxAltitude;
          }

          const lastNode = b.graph[b.graph.length - 1];

          if (lastNode?.x > globalMaxDistance) {
            globalMaxDistance = lastNode.x;
          }

          b.graph = b.graph.map((c) => ({
            x: c.x,
            y: c.y - minAltitude,
          }));
        });

        setA(response.data);
        setWidth(globalMaxDistance);
        setHeight(globalMaxAltitude);
      });
  }, []);

  return (
    <div className={styles.graph}>
      <div>
        <VictoryChart width={width} height={height}>
          <VictoryGroup style={{ data: { strokeWidth: 1, fillOpacity: 0.4 } }}>
            {a.map((b, i) => (
              <VictoryArea
                key={b.slug}
                style={{ data: { fill: palette[i], stroke: palette[i] } }}
                data={b.graph}
              />
            ))}
          </VictoryGroup>
        </VictoryChart>
      </div>
      <div className={styles.legend}>
        {a.map((b, i) => (
          <div key={b.slug} className={styles.item}>
            <span className={styles.dot} style={{ background: palette[i] }} />{' '}
            {b.name}
          </div>
        ))}
      </div>
    </div>
  );
};
