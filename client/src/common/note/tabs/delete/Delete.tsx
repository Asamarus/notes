import { useState } from 'react';
import remoteRequest from 'utils/remoteRequest';
import { Button } from '@mantine/core';
import { MdDelete } from 'react-icons/md';
import { useAppDispatch } from 'hooks';
import { openModal } from 'common/modals';
import { Note as NoteData, decreaseNotesTotal, removeNotesId } from 'store/NotesSlice';

export interface DeleteProps {
  /** Note */
  note: NoteData;

  /** onCloseModal */
  onCloseModal(): void;
}
function Delete({ note, onCloseModal }: DeleteProps) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Button
        leftIcon={<MdDelete size={20} />}
        color="red"
        onClick={() => {
          openModal({
            name: 'confirmation',
            data: {
              onConfirm: () => {
                setLoading(true);

                remoteRequest({
                  url: 'notes/actions',
                  data: {
                    action: 'delete',
                    id: note.id,
                  },
                  onSuccess: () => {
                    dispatch(removeNotesId(note.id));
                    dispatch(decreaseNotesTotal());

                    onCloseModal();
                  },
                  onError: (response) => {
                    console.error({ content: response.msg });
                  },
                });
              },
            },
          });
        }}
        loading={loading}>
        Delete
      </Button>
    </>
  );
}

export default Delete;
