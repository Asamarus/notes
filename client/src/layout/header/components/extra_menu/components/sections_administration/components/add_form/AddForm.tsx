import { z } from 'zod';
import { Box, ColorInput, TextInput, Button, Group } from '@mantine/core';
import useRequest from 'hooks/use-request';
import { useAppDispatch } from 'hooks';
import { store } from 'store';
import { useForm, zodResolver } from '@mantine/form';
import {
  appendSectionsAdministrationId,
  setSectionsAdministrationItem,
} from 'store/SectionsAdministrationSlice';
import { setSections } from 'store/SectionsSlice';

const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

const schema = z.object({
  name: z.string(),
  display_name: z.string(),
  color: z.string().regex(colorRegex),
});

function AddForm() {
  const dispatch = useAppDispatch();
  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      name: '',
      display_name: '',
      color: '',
    },
  });

  const { loading, alert, request } = useRequest();

  return (
    <Box sx={{ maxWidth: 450 }} mx="auto">
      {alert}
      <form
        onSubmit={form.onSubmit((values: Record<string, unknown>) => {
          request({
            url: 'sections/actions',
            data: { action: 'create', ...values },
            onSuccess: ({ response }) => {
              if (!store.getState().SectionsAdministration.mounted) {
                return;
              }

              form.reset();
              const { item } = response;

              dispatch(appendSectionsAdministrationId(item.id));
              dispatch(setSections(response.sections));
              dispatch(setSectionsAdministrationItem(item));
            },
          });
        })}>
        <TextInput withAsterisk label="Name" {...form.getInputProps('name')} />
        <TextInput withAsterisk label="Display name" {...form.getInputProps('display_name')} />
        <ColorInput withAsterisk label="Color" {...form.getInputProps('color')} />

        <Group position="right" mt="md">
          <Button type="submit" loading={loading}>
            Add
          </Button>
        </Group>
      </form>
    </Box>
  );
}

export default AddForm;
