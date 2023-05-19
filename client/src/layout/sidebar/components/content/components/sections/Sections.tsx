import { useState } from 'react';
import useStyles from './Sections.styles';
import { Collapse } from '@mantine/core';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';
import { useMantineTheme } from '@mantine/core';
import { Link } from 'react-router-dom';
import { useAppSelector } from 'hooks';

const defaultSection = {
  name: 'all',
  display_name: 'Notes',
  color: '#1e88e5',
};

function Sections() {
  const { current, sections } = useAppSelector((state) => ({
    current: state.CurrentSection,
    sections: state.Sections,
  }));

  const { classes } = useStyles({ backgroundColor: current.color });
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();

  const sectionsList = [defaultSection, ...sections].filter((s) => s.name !== current.name);

  return (
    <>
      <div
        className={classes.header}
        onClick={() => {
          setOpened((prev) => !prev);
        }}>
        <span className={classes.title}>{current.displayName}</span>
        {!opened && <MdExpandMore className={classes.caret} size={30} />}
        {opened && <MdExpandLess className={classes.caret} size={30} />}
      </div>
      <Collapse in={opened}>
        {sectionsList.map(({ name, display_name, color }) => (
          <Link
            key={name}
            className={classes.section}
            to={`/${name !== 'all' ? name : ''}`}
            {...(theme.colorScheme !== 'dark' ? { style: { backgroundColor: color } } : {})}>
            {display_name}
          </Link>
        ))}
      </Collapse>
    </>
  );
}

export default Sections;
