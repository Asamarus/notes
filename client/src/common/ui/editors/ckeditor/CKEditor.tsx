import CKEditorBase, { CKEditorBaseProps } from '../ckeditor_base';

// const languages = [
// 	'markup',
// 	'bash',
// 	'clike',
// 	'c',
// 	'cpp',
// 	'css',
// 	'javascript',
// 	'jsx',
// 	'coffeescript',
// 	'actionscript',
// 	'css-extr',
// 	'diff',
// 	'git',
// 	'go',
// 	'graphql',
// 	'handlebars',
// 	'json',
// 	'less',
// 	'makefile',
// 	'markdown',
// 	'objectivec',
// 	'ocaml',
// 	'python',
// 	'reason',
// 	'sass',
// 	'scss',
// 	'sql',
// 	'stylus',
// 	'tsx',
// 	'typescript',
// 	'wasm',
// 	'yaml',
// ];

const config = {
  toolbar: {
    items: [
      'heading',
      '|',
      'codeBlock',
      'bold',
      'italic',
      'link',
      'bulletedList',
      'numberedList',
      'sourceEditing',
      '|',
      'code',
      'insertTable',
      'undo',
      'redo',
    ],
    shouldNotGroupWhenFull: true,
  },

  codeBlock: {
    languages: [
      { language: 'plain-text', label: 'Plain text' },
      { language: 'tsx', label: '.tsx' },
      { language: 'jsx', label: '.jsx' },
      { language: 'typescript', label: 'TypeScript' },
      { language: 'javascript', label: 'JavaScript' },
      { language: 'css', label: 'CSS' },
      { language: 'html', label: 'HTML' },
      { language: 'python', label: 'Python' },
      { language: 'sql', label: 'SQL' },
      { language: 'json', label: 'JSON' },
      { language: 'less', label: 'LESS' },
      { language: 'sass', label: 'Sass' },
      { language: 'bash', label: 'Bash' },
      { language: 'diff', label: 'Diff' },
      { language: 'git', label: 'git' },
    ],
  },
};

function CKEditor(props: CKEditorBaseProps) {
  return <CKEditorBase editorUrl="/assets/ckeditor/ckeditor.js" config={config} {...props} />;
}

export default CKEditor;
