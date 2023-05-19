import { useEffect } from 'react';
import { DatePicker } from '@mantine/dates';
import { Box } from '@mantine/core';
import { useSetState } from '@mantine/hooks';
import remoteRequest from 'utils/remoteRequest';
import { useAppDispatch } from 'hooks';
import { store } from 'store';
import map from 'lodash/map';
import inArray from 'helpers/inArray';
import { closeModal } from 'common/modals';
import events from 'common/events';
import { dispatch as dispatchEvent } from 'hooks/use-custom-event-listener';
import { setNotesDate } from 'store/NotesSlice';

function onSelect(date, dispatch) {
  closeModal('modal');
  dispatch(setNotesDate(date));
  dispatchEvent(events.list.search);
}

function getDate(date: Date) {
  return (
    date.getFullYear() +
    '-' +
    ('0' + (date.getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + date.getDate()).slice(-2)
  );
}

function Calendar() {
  const dispatch = useAppDispatch();
  const [state, setState] = useSetState({
    days: [],
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    value: null,
  });

  const { value, days, month, year } = state;

  useEffect(() => {
    const data = {
      action: 'get_calendar_days',
      month,
      year,
    };
    const section = store.getState().Notes.section;

    if (section !== 'all') {
      data['section'] = section;
    }

    remoteRequest({
      url: 'notes/actions',
      data: data,
      onSuccess: (response) => {
        setState({ days: map(response.dates, (d) => d.day) });
      },
    });
  }, [month, year]);

  const onMonthChange = (date) => {
    setState({ month: date.getMonth() + 1, year: date.getFullYear() });
  };

  return (
    <>
      <DatePicker
        value={value}
        onChange={(date) => {
          setState({ value: date });
          onSelect(getDate(date), dispatch);
        }}
        excludeDate={(date) => {
          if (date.getMonth() + 1 !== month) {
            return true;
          }

          if (!inArray(date.getDate(), days)) {
            return true;
          }

          return false;
        }}
        renderDay={(date) => {
          const day = date.getDate();

          if (inArray(date.getDate(), days) && date.getMonth() + 1 === month) {
            return (
              <Box
                sx={{
                  background: 'rgba(3,155,229,.4)',
                  width: 36,
                  height: 36,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <div>{day}</div>
              </Box>
            );
          }

          return day;
        }}
        onDateChange={onMonthChange}
      />
    </>
  );
}

export default Calendar;
