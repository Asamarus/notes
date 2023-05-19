import useStyles from './Title.styles';
import { useAppSelector } from 'hooks';

function Title() {
  const { classes } = useStyles();

  const displayName = useAppSelector((state) => state.CurrentSection.displayName);

  return (
    <div className={classes.wrapper}>
      <span className={classes.title}>{displayName}</span>
    </div>
  );
}

export default Title;
