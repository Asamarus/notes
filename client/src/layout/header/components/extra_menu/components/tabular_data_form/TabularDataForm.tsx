import { Textarea } from '@mantine/core';

import { useForm } from '@mantine/form';
import { Prism } from '@mantine/prism';

function formatData(data: string) {
  if (data.length === 0) {
    return '';
  }

  const rows = data.split('\n').map((x) => x.split('\t'));

  let tableHTML = '<figure class="table">\n<table>\n';

  tableHTML += '  <thead>\n    <tr>';
  rows[0].forEach((cell) => {
    tableHTML += `\n      <th>${cell}</th>`;
  });
  tableHTML += '\n    </tr>\n  </thead>\n  <tbody>';

  for (let i = 1; i < rows.length; i++) {
    tableHTML += '\n    <tr>';
    rows[i].forEach((cell) => {
      tableHTML += `\n      <td>${cell}</td>`;
    });
    tableHTML += '\n    </tr>';
  }

  tableHTML += '\n  </tbody>\n</table>\n</figure>';
  return tableHTML;
}

function TabularDataForm() {
  const form = useForm({
    initialValues: {
      data: '',
    },
  });

  const { data } = form.values;

  return (
    <>
      <Textarea
        label="Tabular data"
        autosize
        mb={20}
        {...form.getInputProps('data')}
      />

      <Prism language="tsx">{formatData(data)}</Prism>
    </>
  );
}

export default TabularDataForm;
