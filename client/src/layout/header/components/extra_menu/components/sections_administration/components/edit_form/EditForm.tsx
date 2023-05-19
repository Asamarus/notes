import { z } from 'zod';
import { Box, ColorInput, TextInput, Button, Group } from '@mantine/core';
import useRequest from 'hooks/use-request';
import { useAppDispatch } from 'hooks';
import { store } from 'store';
import { useForm, zodResolver } from '@mantine/form';
import { setSections } from 'store/SectionsSlice';
import { setSectionsAdministrationItem } from 'store/SectionsAdministrationSlice';
import type { SectionItem } from 'store/SectionsAdministrationSlice';

const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

const schema = z.object({
  name: z.string(),
  display_name: z.string(),
  color: z.string().regex(colorRegex),
});

export interface EditFormProps {
  /** Section */
  item: SectionItem;
}
function EditForm({ item }: EditFormProps) {
  const dispatch = useAppDispatch();
  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      name: item.name,
      display_name: item.display_name,
      color: item.color,
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
            data: { action: 'update', id: item.id, ...values },
            onSuccess: ({ response }) => {
              if (!store.getState().SectionsAdministration.mounted) {
                return;
              }

              dispatch(setSections(response.sections));
              dispatch(setSectionsAdministrationItem(response.item));
            },
          });
        })}>
        <TextInput withAsterisk label="Name" {...form.getInputProps('name')} />
        <TextInput withAsterisk label="Display name" {...form.getInputProps('display_name')} />
        <ColorInput withAsterisk label="Color" {...form.getInputProps('color')} />

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
