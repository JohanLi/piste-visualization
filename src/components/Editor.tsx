import React, { ReactElement, useState, useEffect } from 'react';
import { GoogleMap, LoadScriptNext, Polyline } from '@react-google-maps/api';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Coordinate {
  lng: number;
  lat: number;
}

const cmdOrCtrl = (e: KeyboardEvent) => e.ctrlKey || e.metaKey;

export const Editor = (): ReactElement => {
  const { resort, piste } = useParams<{ resort: string; piste: string }>();

  const [center, setCenter] = useState<Coordinate>();
  const [path, setPath] = useState<Coordinate[]>([]);
  const [pathHistory, setPathHistory] = useState<Coordinate[][]>([]);

  const [polylineRef, setPolylineRef] = useState<google.maps.Polyline>();

  const onLoad = (polygon: google.maps.Polyline) => setPolylineRef(polygon);

  useEffect(() => {
    axios
      .request<Coordinate[]>({
        method: 'get',
        url: 'http://localhost:8081/piste',
        params: {
          resort,
          piste,
        },
      })
      .then((response) => {
        setPath(response.data);
        setCenter(response.data[0]); // should be set to the center of the piste
      });
  }, []);

  useEffect(() => {
    const undo = (e: KeyboardEvent) => {
      if (!(e.key === 'z' && cmdOrCtrl(e))) {
        return;
      }

      if (!pathHistory.length) {
        return;
      }

      setPath(pathHistory[pathHistory.length - 1]);
      setPathHistory(pathHistory.slice(0, -1));
    };

    const save = async (e: KeyboardEvent) => {
      if (!(e.key === 'x' && cmdOrCtrl(e))) {
        return;
      }

      await axios.request({
        method: 'post',
        url: 'http://localhost:8081/piste',
        data: {
          resort,
          piste,
          coordinates: path,
        },
      });
    };

    window.addEventListener('keydown', undo);
    window.addEventListener('keydown', save);

    return () => {
      window.removeEventListener('keydown', undo);
      window.removeEventListener('keydown', save);
    };
  }, [path, pathHistory]);

  const setPath2 = (newPath: Coordinate[]) => {
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

    const newPathAdded = () => {
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

    return () => {
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
        onClick={(e) => {
          if (e.vertex !== 0) {
            return;
          }

          setPath2(path.slice().reverse());
        }}
        onRightClick={(e) => {
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
          width: '100%',
          height: '100vh',
        }}
        zoom={15}
        onClick={(e) => {
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
