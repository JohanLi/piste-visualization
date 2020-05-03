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
  const [pistes, setPistes] = useState<
    { name: string; slug: string; graph: GraphType[] }[]
  >([]);
  const [graphs, setGraphs] = useState<GraphType[][]>([]);

  const [width, setWidth] = useState(0);
  const [mode, setMode] = useState<'vertical' | 'steepness'>('vertical');

  useEffect(() => {
    axios
      .request<{ name: string; slug: string; graph: GraphType[] }[]>({
        method: 'get',
        url: 'http://localhost:8081/graph',
        params: {
          pisteSlugs: 'gotes-brant,gastrappet,kodiak,slalombacken',
        },
      })
      .then((response) => {
        setPistes(response.data);
      });
  }, []);

  useEffect(() => {
    if (mode === 'steepness') {
      const distance = 50;
      const increment = 2;

      setGraphs(
        pistes.map((piste) => {
          const graphSteepness = piste.graph
            .map((coordinate, i) => {
              const next = piste.graph[i + distance / increment];

              if (next) {
                return {
                  x: coordinate.x,
                  y:
                    Math.atan((coordinate.y - next.y) / distance) *
                    (180 / Math.PI),
                };
              }

              return undefined;
            })
            .filter(
              (coordinate): coordinate is GraphType => coordinate !== undefined,
            );

          return graphSteepness;
        }),
      );
    }

    if (mode === 'vertical') {
      setGraphs(
        pistes.map((piste) => {
          // not the most efficient algorithm – used here due to simplicity
          const altitudes = piste.graph.map((d) => d.y);
          const minAltitude = Math.min(...altitudes);

          return piste.graph.map((b) => ({
            x: b.x,
            y: b.y - minAltitude,
          }));
        }),
      );
    }

    let globalMaxDistance = 0;

    pistes.forEach((piste) => {
      const lastNode = piste.graph[piste.graph.length - 1];

      if (lastNode?.x > globalMaxDistance) {
        globalMaxDistance = lastNode.x;
      }
    });

    setWidth(globalMaxDistance);
  }, [pistes, mode]);

  return (
    <div className={styles.graph}>
      <div className={styles.mode}>
        <span
          onClick={(): void => setMode('vertical')}
          className={`${styles.modeItem} ${
            mode === 'vertical' && styles.modeItemSelected
          }`}
        >
          Vertical
        </span>
        <span
          onClick={(): void => setMode('steepness')}
          className={`${styles.modeItem} ${
            mode === 'steepness' && styles.modeItemSelected
          }`}
        >
          Steepness
        </span>
      </div>
      <div>
        <VictoryChart width={width / 3}>
          <VictoryGroup style={{ data: { strokeWidth: 1, fillOpacity: 0.4 } }}>
            {pistes.map((piste, i) => (
              <VictoryArea
                key={piste.slug}
                style={{ data: { fill: palette[i], stroke: palette[i] } }}
                data={graphs[i]}
              />
            ))}
          </VictoryGroup>
        </VictoryChart>
      </div>
      <div className={styles.legend}>
        {pistes.map((piste, i) => (
          <div key={piste.slug} className={styles.item}>
            <span className={styles.dot} style={{ background: palette[i] }} />{' '}
            {piste.name}
          </div>
        ))}
      </div>
    </div>
  );
};
