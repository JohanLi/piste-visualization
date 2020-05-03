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
  const [height, setHeight] = useState(0);
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
    let unsetGraphs: GraphType[][] = [[]];

    if (mode === 'steepness') {
      // TODO: investigate sensible defaults
      const distance = 40;
      const increment = 2;
      const smoothDistance = 10;

      unsetGraphs = pistes.map((piste) => {
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
          )
          .filter((_coordinate, i) => i % (smoothDistance / increment) === 0);

        return graphSteepness;
      });
    }

    if (mode === 'vertical') {
      unsetGraphs = pistes.map((piste) => {
        // not the most efficient algorithm – used here due to simplicity
        const altitudes = piste.graph.map((d) => d.y);
        const minAltitude = Math.min(...altitudes);

        return piste.graph.map((b) => ({
          x: b.x,
          y: b.y - minAltitude,
        }));
      });
    }

    let globalMaxDistance = 0;
    let globalMaxY = 0;

    unsetGraphs.forEach((graph) => {
      const lastNode = graph[graph.length - 1];

      if (lastNode?.x > globalMaxDistance) {
        globalMaxDistance = lastNode.x;
      }

      // if max steepness is 30.5, Victory seems to chop the top part of the graph unless domain is set to 0, 31 for Y
      const ys = graph.map((c) => c.y);
      const maxY = Math.ceil(Math.max(...ys));

      if (maxY > globalMaxY) {
        globalMaxY = maxY;
      }
    });

    setGraphs(unsetGraphs);
    setWidth(globalMaxDistance);
    setHeight(globalMaxY);
  }, [pistes, mode]);

  // TODO: investigate how to best set the size of VictoryChart
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
        <VictoryChart domain={{ x: [0, width], y: [0, height] }}>
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
