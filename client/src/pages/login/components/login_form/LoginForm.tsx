import useRequest from 'hooks/use-request';
import { useForm, zodResolver } from '@mantine/form';
import { TextInput, PasswordInput, Button, Checkbox } from '@mantine/core';
import { MdLogin } from 'react-icons/md';
import { z } from 'zod';
import useStyles from './LoginForm.styles';

const schema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(6, { message: 'Password should have at least 6 letters' }),
});

function LoginForm() {
  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      email: '',
      password: '',
      remember_me: false,
    },
    transformValues: (values) => ({
      email: values.email,
      password: values.password,
      remember_me: Number(values.remember_me),
    }),
  });

  const { loading, alert, request } = useRequest();

  const { classes } = useStyles();

  return (
    <div className={classes.wrapper}>
      {alert}
      <form
        onSubmit={form.onSubmit((values) => {
          request({
            url: 'authorization/login_with_email',
            data: { ...values },
            onSuccess: ({ response }) => {
              window.location = response.redirect;
            },
          });
        })}>
        <TextInput placeholder="Email" {...form.getInputProps('email')} mb={20} />
        <PasswordInput placeholder="Password" {...form.getInputProps('password')} mb={20} />
        <Checkbox
          color="green"
          label="Remember me"
          {...form.getInputProps('remember_me', { type: 'checkbox' })}
          mb={10}
        />
        <Button
          fullWidth
          type="submit"
          loading={loading}
          color="green"
          leftIcon={<MdLogin size={20} />}>
          Login
        </Button>
      </form>
    </div>
  );
}

export default LoginForm;
