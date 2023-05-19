import useStyles from './LoginPage.styles';
import LoginForm from './components/login_form';

function LoginPage() {
  const { classes } = useStyles();

  return (
    <div className={classes.wrapper}>
      <LoginForm />
    </div>
  );
}

export default LoginPage;
