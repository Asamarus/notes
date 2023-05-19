import DrawerControl from './components/drawer_control';
import Title from './components/title';
import Search from './components/search';
import OpenInNewTab from './components/open_in_new_tab';
import ToggleColorScheme from './components/toggle_color_scheme';
import ExtraMenu from './components/extra_menu';

import useStyles from './Header.styles';
import useViewportSize from 'hooks/use-viewport-size';
import { useAppSelector } from 'hooks';

function Header() {
  const backgroundColor = useAppSelector((state) => state.CurrentSection.color);

  const { width } = useViewportSize();
  const { classes } = useStyles({ backgroundColor: backgroundColor });

  const isDesktop = width >= 1024;

  if (width === 0) {
    return null;
  }

  return (
    <div className={classes.wrapper}>
      {!isDesktop && <DrawerControl />}
      {!isDesktop && <Title />}

      <div className={classes.search_wrapper}>
        <Search />
      </div>
      <div className={classes.divider}></div>
      <div className={classes.right_controls}>
        <OpenInNewTab />
        <ToggleColorScheme />
        <ExtraMenu />
      </div>
    </div>
  );
}

export default Header;
