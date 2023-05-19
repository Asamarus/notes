import useStyles from './Sources.styles';
import type { Note as NoteData } from 'store/NotesSlice';
import { MdPublic } from 'react-icons/md';
import isEmpty from 'helpers/isEmpty';
import size from 'lodash/size';
import SourcesList from './components/sources_list';
import { openModal } from 'common/modals';

export interface SourcesProps {
  /** Note */
  note: NoteData;
}
function Sources({ note }: SourcesProps) {
  const { classes } = useStyles();

  const sources = note.sources;

  if (isEmpty(sources)) {
    return null;
  }

  return (
    <div className={classes.wrapper}>
      <MdPublic className={classes.icon} size={24} />
      <span
        className={classes.number}
        onClick={(e) => {
          e.stopPropagation();
          openModal({
            name: 'content',
            data: { children: <SourcesList note={note} /> },
            settings: {
              title: '',
              size: 400,
              withCloseButton: false,
              withModalHeader: false,
              closeOnClickOutside: true,
              closeOnEscape: true,
              centered: true,
              paperProps: {
                sx: (theme) => ({
                  border: theme.colorScheme === 'dark' ? '1px solid #5f6368' : '1px solid #ddd',
                }),
              },
            },
          });
        }}>
        {size(sources)}
      </span>
    </div>
  );
}

export default Sources;
