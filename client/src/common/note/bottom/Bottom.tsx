import { lazy } from 'react';
import useStyles from './Bottom.styles';
import { ActionIcon } from '@mantine/core';
import { Note as NoteData, setNotesTags } from 'store/NotesSlice';
import { MdLabel } from 'react-icons/md';
import map from 'lodash/map';
import { dispatch as dispatchEvent } from 'hooks/use-custom-event-listener';
import { useAppDispatch } from 'hooks';
import events from 'common/events';
import rison from 'utils/rison';
import { useNavigate } from 'react-router-dom';
import openDialog from 'helpers/openDialog';
import ComponentLoader from 'common/component_loader';

const EditTags = lazy(() => import('common/dialogs/edit_tags'));

export interface BottomProps {
  /** Type */
  type: 'list' | 'modal' | 'page';

  /** Note */
  note: NoteData;
}

function Bottom({ note, type }: BottomProps) {
  const dispatch = useAppDispatch();
  const { classes } = useStyles();
  const navigate = useNavigate();

  return (
    <div className={classes.wrapper}>
      <ActionIcon
        size={26}
        onClick={(e) => {
          e.stopPropagation();
          openDialog(
            <ComponentLoader>
              <EditTags note={note} />
            </ComponentLoader>,
          );
        }}>
        <MdLabel size={24} />
      </ActionIcon>
      {map(note.tags, (tag) => (
        <span
          key={tag}
          className={classes.tag}
          onClick={(e) => {
            e.stopPropagation();

            if (type === 'page') {
              const searchParams = new URLSearchParams();
              searchParams.append(
                'list',
                rison.encode({
                  tags: [tag],
                }),
              );

              navigate(`/${note.section}?${searchParams.toString()}`);

              return;
            }

            dispatch(setNotesTags([tag]));

            dispatchEvent(events.list.search);
            if (type === 'modal') {
              setTimeout(() => {
                dispatchEvent(events.note.close);
              }, 200);
            }
          }}>
          #{tag}{' '}
        </span>
      ))}
    </div>
  );
}

export default Bottom;
