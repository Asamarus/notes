import { z } from 'zod';
import { Box, TextInput, Button, Group, BackgroundImage, Checkbox, Textarea } from '@mantine/core';
import useRequest from 'hooks/use-request';
import { useAppDispatch } from 'hooks';
import { store } from 'store';
import { useForm, zodResolver } from '@mantine/form';
import { Note as NoteData, setNotesNoteSources } from 'store/NotesSlice';
import isEmpty from 'helpers/isEmpty';
import { setSourcesAdministrationItem } from 'store/SourcesAdministrationSlice';
import type { SourceItem } from 'store/SourcesAdministrationSlice';

const schema = z.object({
  link: z.string().url(),
});

export interface EditFormProps {
  /** Note */
  note: NoteData;

  /** Section */
  item: SourceItem;
}
function EditForm({ item, note }: EditFormProps) {
  const dispatch = useAppDispatch();
  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      link: item.link,
      title: item.title,
      description: item.description,
      showImage: item.showImage,
    },
    transformValues: (values) => ({
      link: values.link,
      title: values.title,
      description: values.description,
      showImage: Number(values.showImage),
    }),
  });

  const { loading, alert, request } = useRequest();

  return (
    <Box sx={{ maxWidth: 450 }} mx="auto">
      {alert}
      <form
        onSubmit={form.onSubmit((values) => {
          request({
            url: 'sources/actions',
            data: {
              action: 'update',
              id: note.id,
              source_id: item.id,
              ...values,
            },
            onSuccess: ({ response }) => {
              if (!store.getState().SourcesAdministration.mounted) {
                return;
              }

              const { item } = response;

              dispatch(setSourcesAdministrationItem(item));
              dispatch(setNotesNoteSources({ id: note.id, sources: response.sources }));
            },
          });
        })}>
        <TextInput withAsterisk label="Link" {...form.getInputProps('link')} />
        <TextInput withAsterisk label="Title" {...form.getInputProps('title')} />
        <Textarea label="Description" {...form.getInputProps('description')} mb={10} />
        {!isEmpty(item.image) && (
          <BackgroundImage
            mb={10}
            src={item.image}
            sx={{
              width: '100%',
              height: '200px',
            }}
          />
        )}
        <Checkbox label="Show image" {...form.getInputProps('showImage', { type: 'checkbox' })} />

        <Group position="right" mt="md">
          <Button type="submit" loading={loading}>
            Save
          </Button>
        </Group>
      </form>
    </Box>
  );
}

export default EditForm;
