import React, { ReactElement, useState, useEffect } from 'react';
import { GoogleMap, LoadScriptNext, Polyline } from '@react-google-maps/api';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import { Coordinate } from '../types';
import { Piste, Resort } from '../server/repository';

const cmdOrCtrl = (e: KeyboardEvent): boolean => e.ctrlKey || e.metaKey;

export const Editor = (): ReactElement => {
  const { pisteSlug } = useParams<{ pisteSlug: string }>();

  const [center, setCenter] = useState<Coordinate>();
  const [path, setPath] = useState<Coordinate[]>([]);
  const [pathHistory, setPathHistory] = useState<Coordinate[][]>([]);
  const [resort, setResort] = useState<Resort>();

  const [polylineRef, setPolylineRef] = useState<google.maps.Polyline>();

  const onLoad = (polygon: google.maps.Polyline): void =>
    setPolylineRef(polygon);

  useEffect(() => {
    axios
      .request<Piste>({
        method: 'get',
        url: 'http://localhost:8081/piste',
        params: {
          slug: pisteSlug,
        },
      })
      .then((response) => {
        if (!response.data) {
          return;
        }

        setResort(response.data);
        setPath(response.data.path);
        // should be set to the center of the piste
        setCenter(
          response.data.path[0] || { lat: 62.4134629, lng: 13.9759148 },
        );
      });
  }, [pisteSlug]);

  useEffect(() => {
    const undo = (e: KeyboardEvent): void => {
      if (!(e.key === 'z' && cmdOrCtrl(e))) {
        return;
      }

      if (!pathHistory.length) {
        return;
      }

      setPath(pathHistory[pathHistory.length - 1]);
      setPathHistory(pathHistory.slice(0, -1));
    };

    const save = async (e: KeyboardEvent): Promise<void> => {
      if (!(e.key === 'x' && cmdOrCtrl(e))) {
        return;
      }

      await axios.request({
        method: 'put',
        url: 'http://localhost:8081/piste',
        data: {
          ...resort,
          path,
        },
      });
    };

    window.addEventListener('keydown', undo);
    window.addEventListener('keydown', save);

    return (): void => {
      window.removeEventListener('keydown', undo);
      window.removeEventListener('keydown', save);
    };
  }, [path, pathHistory]);

  const setPath2 = (newPath: Coordinate[]): void => {
    if (pathHistory.length >= 5) {
      setPathHistory(pathHistory.slice(1).concat([path]));
    } else {
      setPathHistory(pathHistory.concat([path]));
    }

    setPath(newPath);
  };

  useEffect(() => {
    if (!path.length || !polylineRef) {
      return;
    }

    const newPathAdded = (): void => {
      const path = polylineRef.getPath();
      const pathArray = path
        .getArray()
        .map((i) => ({ lat: i.lat(), lng: i.lng() }));
      setPath2(pathArray);
    };

    const newPath = polylineRef.getPath();

    const listeners = [
      newPath.addListener('set_at', newPathAdded),
      newPath.addListener('insert_at', newPathAdded),
      newPath.addListener('remove_at', newPathAdded),
    ];

    return (): void => {
      listeners.forEach((listener) => listener.remove());
    };
  }, [path]);

  let polyline;

  if (path.length) {
    const options = {
      editable: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2,
      suppressUndo: true,
    };

    polyline = (
      <Polyline
        path={path}
        options={options}
        onLoad={onLoad}
        onClick={(e): void => {
          if (e.vertex !== 0) {
            return;
          }

          setPath2(path.slice().reverse());
        }}
        onRightClick={(e): void => {
          if (e.vertex === undefined) {
            return;
          }

          setPath2([...path.slice(0, e.vertex), ...path.slice(e.vertex + 1)]);
        }}
      />
    );
  }

  return (
    <LoadScriptNext googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        center={center}
        mapContainerStyle={{
          flexGrow: 1,
          height: '100vh',
        }}
        zoom={15}
        onClick={(e): void => {
          const latLng = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          };

          setPath2([...path, latLng]);
        }}
        options={{
          draggableCursor: 'default',
          draggingCursor: 'default',
          mapTypeId: 'satellite',
        }}
      >
        {polyline}
      </GoogleMap>
    </LoadScriptNext>
  );
};
