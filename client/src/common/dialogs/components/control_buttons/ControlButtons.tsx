import useStyles from './ControlButtons.styles';

export interface ControlButtonsProps {
  cancelTitle?: string;
  onCancelClick?: () => void;
  confirmTitle?: string;
  onConfirmClick?: () => void;
}
function ControlButtons({
  cancelTitle = 'Cancel',
  onCancelClick,
  confirmTitle = 'Save',
  onConfirmClick,
}: ControlButtonsProps) {
  const { classes } = useStyles();
  return (
    <div className={classes.wrapper}>
      <div className={`${classes.button} ${classes.button_border}`} onClick={onCancelClick}>
        {cancelTitle}
      </div>
      <div className={classes.button} onClick={onConfirmClick}>
        {confirmTitle}
      </div>
    </div>
  );
}

export default ControlButtons;
