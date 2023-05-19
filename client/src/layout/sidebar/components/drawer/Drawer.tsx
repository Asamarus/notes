import React, { useState } from 'react';

import useCustomEventListener from 'hooks/use-custom-event-listener';

import useStyles from './Drawer.styles';
import events from 'common/events';

export interface DrawerProps {
  /** The content of the component */
  children?: React.ReactNode;
}
function Drawer({ children }: DrawerProps) {
  const { classes, cx } = useStyles();
  const [opened, setOpened] = useState(false);

  useCustomEventListener(events.drawer.open, () => {
    setOpened(true);
  });

  useCustomEventListener(events.drawer.close, () => {
    setOpened(false);
  });

  return (
    <div>
      <div
        className={cx(classes.drawer, {
          [classes.drawer_opened]: opened,
        })}>
        {children}
      </div>
      {opened && (
        <div
          className={classes.overlay}
          onClick={() => {
            setOpened(false);
          }}
        />
      )}
    </div>
  );
}

export default Drawer;
