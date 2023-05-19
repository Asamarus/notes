import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  drawer: {
    backgroundColor: theme.colorScheme === 'dark' ? '#202020' : '#fff',
    boxShadow: '0 0 6px rgba(0,0,0,0.1)',
    overflowY: 'auto',
    overflowX: 'hidden',
    position: 'fixed',
    top: '0',
    transition: 'visibility 0s linear .218s,transform .218s cubic-bezier(0.4,0.0,0.2,1)',
    width: '250px',
    height: '100%',
    zIndex: 101,
    transform: 'translate(-256px,0)',
  },
  drawer_opened: { transform: 'translate(0,0)' },
  overlay: {
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'fixed',
    opacity: 0.8,
    background: '#0b0b0b',
    zIndex: 100,
  },
}));
