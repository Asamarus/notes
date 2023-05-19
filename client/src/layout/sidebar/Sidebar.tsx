import useViewportSize from 'hooks/use-viewport-size';
import useStyles from './Sidebar.styles';
import { ScrollArea } from '@mantine/core';
import Content from './components/content';
import Drawer from './components/drawer';

function Sidebar() {
  const { classes } = useStyles();
  const { height, width } = useViewportSize();
  const isDesktop = width >= 1024;

  const content = (
    <ScrollArea style={{ height: `${height}px` }}>
      <Content />
    </ScrollArea>
  );

  return isDesktop ? (
    <div className={classes.wrapper}>
      <div className={classes.decorative} style={{ height: `${height}px` }} />
      <div className={classes.content}>{content}</div>
    </div>
  ) : (
    <Drawer>{content}</Drawer>
  );
}

export default Sidebar;
