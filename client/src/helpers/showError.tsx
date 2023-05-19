import { TbExclamationMark } from 'react-icons/tb';
import { notifications } from '@mantine/notifications';
export default function showError(msg: string) {
  notifications.show({
    title: 'Error',
    message: msg,
    icon: <TbExclamationMark size={20} />,
    color: 'red',
    autoClose: 10000,
  });
}
