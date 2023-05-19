import { Checkbox } from '@mantine/core';
import useStyles from './List.styles';

export interface ListProps {
  withCheckboxes?: boolean;
  items?: { id: number; title: string; name: string; checked?: boolean }[];
  onSelect?: (param: { id: number; title: string; name: string; checked?: boolean }) => void;
}

const noop = () => {
  //
};

function List({ withCheckboxes = false, items = [], onSelect }: ListProps) {
  const { classes } = useStyles();
  return (
    <ul className={classes.wrapper}>
      {items.map((item, index) => (
        <li
          key={index}
          className={classes.item}
          onClick={() => {
            if (typeof onSelect === 'function') {
              onSelect(item);
            }
          }}>
          {withCheckboxes && (
            <span className={classes.checkbox}>
              <Checkbox color="green" checked={item.checked} onChange={noop} />
            </span>
          )}
          <span>{item.title}</span>
        </li>
      ))}
    </ul>
  );
}

export default List;
