import { openModal } from 'common/modals/events';

export default function openDialog(content: React.ReactNode) {
  openModal({
    modalId: 'modal',
    name: 'content',
    settings: {
      title: '',
      withModalHeader: false,
      closeOnClickOutside: false,
      withCloseButton: false,
      size: 400,
      centered: true,
      styles: () => ({
        body: {
          height: '100%',
        },
      }),
      padding: 0,
      paperProps: {
        sx: (theme) => ({
          height: '50vh',
          border: theme.colorScheme === 'dark' ? '1px solid #5f6368' : '1px solid #ddd',
        }),
      },
    },
    data: { children: content },
  });
}
