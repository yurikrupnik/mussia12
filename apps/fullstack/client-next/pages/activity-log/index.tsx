import React, { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import type { Event } from '../../../../../../mussia8/packages/models';
import { User, Event1, Event2 } from '@mussia12/shared/mongoose-schemas';

Pusher.logToConsole = false;

const pusher = new Pusher('d7880526d3965e004014', {
  cluster: 'eu',
});

function getData(res) {
  return res.data;
}

function getEvents(): Promise<Event1[]> {
  return axios.get<Event1[]>('/api/event1').then(getData);
}

function getById(id: string) {
  return axios.get<Event1>(`/api/event1/${id}`).then(getData);
}

function create(body: string) {
  return axios.post<Event1>(`/api/event1`).then(getData);
}

const ActivityLog = () => {
  const [events, setEvents] = useState<Array<Event1>>([]);
  useEffect(() => {
    getEvents().then((r) => {
      setEvents(r);
    });
  }, []);
  useEffect(() => {
    const channel = pusher.subscribe('my-channel');
    channel.bind('my-event', (data: any) => {
      console.log('data', data);
      const { logId } = data;
      getById(logId).then((item) => {
        setEvents(events.concat(item));
      });
      // alert(JSON.stringify(data));
    });

    return () => {
      pusher.unsubscribe('my-channel');
    };
  }, [events]);
  return (
    <div>
      <h2>Activity Log</h2>
      <Grid container>
        {events.map((item, index) => (
          <Grid container justifyContent="space-between" key={item._id}>
            <Grid item xs={1}>
              {index}
            </Grid>
            <Grid item xs={1}>
              {item.intField}
            </Grid>
            <Grid item xs={5}>
              {item.stringField}
            </Grid>
            <Grid item xs={5}>
              {item.tenantId}
            </Grid>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

ActivityLog.propTypes = {};

export default ActivityLog;
