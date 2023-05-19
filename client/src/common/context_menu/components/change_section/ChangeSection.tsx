import { selectSections } from 'store/SectionsSlice';
import { useAppSelector, useAppDispatch } from 'hooks';
import { store } from 'store';
import { z } from 'zod';
import { Box, Select, Button, Group } from '@mantine/core';
import useRequest from 'hooks/use-request';
import { useForm, zodResolver } from '@mantine/form';
import { Note as NoteData, decreaseNotesTotal, removeNotesId } from 'store/NotesSlice';
import { dispatch as dispatchEvent } from 'hooks/use-custom-event-listener';
import events from 'common/events';
import findKey from 'lodash/findKey';
import { closeModal } from 'common/modals';
import { setNoteIsNotSaved } from 'store/NoteIsNotSavedSlice';

const schema = z.object({
  section: z.string(),
});

export interface ChangeSectionProps {
  /** The content of the component */
  note: NoteData;
}

function ChangeSection({ note }: ChangeSectionProps) {
  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      section: note.section,
    },
  });

  const { loading, alert, request } = useRequest();

  const dispatch = useAppDispatch();
  const sections = useAppSelector(selectSections);

  return (
    <Box>
      {alert}
      <form
        onSubmit={form.onSubmit((values: Record<string, unknown>) => {
          request({
            url: 'notes/actions',
            data: { action: 'change_section', id: note.id, ...values },
            onSuccess: () => {
              closeModal('change_section_form_modal');
              const { id } = note;

              dispatch(setNoteIsNotSaved(false));

              dispatchEvent(events.note.close);

              const currentSection = store.getState().Notes.section;

              if (currentSection !== 'all') {
                const ids = store.getState().Notes.ids;
                const index = findKey(ids, (v) => v === id);
                if (index !== undefined) {
                  dispatch(decreaseNotesTotal());
                  dispatch(removeNotesId(id));
                }
              }
            },
          });
        })}>
        <Select
          withAsterisk
          label="Section"
          data={sections.map((s) => ({ value: s.name, label: s.display_name }))}
          {...form.getInputProps('section')}
        />

        <Group position="right" mt="md">
          <Button type="submit" loading={loading}>
            Save
          </Button>
        </Group>
      </form>
    </Box>
  );
}

export default ChangeSection;
