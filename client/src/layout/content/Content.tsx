import List from './components/list';
import useStyles from './Content.styles';

function Content() {
  const { classes } = useStyles();
  return (
    <div className={classes.wrapper}>
      <List />
    </div>
  );
}

export default Content;
