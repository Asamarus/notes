import { z } from 'zod';
import { Box, PasswordInput, Button, Group } from '@mantine/core';
import useRequest from 'hooks/use-request';
import { useForm, zodResolver } from '@mantine/form';

const schema = z
  .object({
    current_password: z.string().min(6, { message: 'Password should have at least 6 letters' }),
    new_password: z.string().min(6, { message: 'New password should have at least 6 letters' }),
    new_password_confirmation: z.string().min(6, {
      message: 'New password confirmation should have at least 6 letters',
    }),
  })
  .superRefine(({ new_password, new_password_confirmation }, ctx) => {
    if (new_password !== new_password_confirmation) {
      ctx.addIssue({
        path: ['new_password_confirmation'],
        code: 'custom',
        message: 'The passwords did not match!',
      });
    }
  });

function UpdatePasswordForm() {
  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      current_password: '',
      new_password: '',
      new_password_confirmation: '',
    },
  });

  const { loading, alert, request } = useRequest();

  return (
    <Box sx={{ maxWidth: 450 }} mx="auto">
      {alert}
      <form
        onSubmit={form.onSubmit((values: Record<string, unknown>) => {
          request({
            url: 'users/actions',
            data: { action: 'update_password', ...values },
          });
        })}>
        <PasswordInput
          withAsterisk
          label="Current password"
          {...form.getInputProps('current_password')}
        />
        <PasswordInput withAsterisk label="New password" {...form.getInputProps('new_password')} />
        <PasswordInput
          withAsterisk
          label="New password confirmation"
          {...form.getInputProps('new_password_confirmation')}
        />

        <Group position="right" mt="md">
          <Button type="submit" loading={loading}>
            Update
          </Button>
        </Group>
      </form>
    </Box>
  );
}

export default UpdatePasswordForm;
