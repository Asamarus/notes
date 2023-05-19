import useStyles from './NavBar.styles';
import { Link } from 'react-router-dom';
import { useAppSelector } from 'hooks';
import { MdArrowBack } from 'react-icons/md';
import { useMantineTheme, ActionIcon } from '@mantine/core';

function NavBar() {
  const theme = useMantineTheme();

  const { section, title, backgroundColor } = useAppSelector((state) => {
    return {
      section: state.CurrentSection.name,
      title: state.CurrentSection.displayName,
      backgroundColor: state.CurrentSection.color,
    };
  });

  const { classes } = useStyles({ backgroundColor });
  return (
    <div className={classes.wrapper}>
      <Link to={`/${section}`}>
        <ActionIcon
          size={30}
          variant="transparent"
          color={theme.colorScheme === 'dark' ? 'gray' : 'white'}>
          <MdArrowBack size={30} />
        </ActionIcon>
      </Link>
      <div className={classes.titleWrapper}>
        <div className={classes.title}>{title}</div>
      </div>
    </div>
  );
}

export default NavBar;
