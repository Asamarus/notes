import React, { useRef, useEffect } from 'react';
import { Selectors, DefaultProps, useComponentDefaultProps } from '@mantine/core';
import useScript from 'hooks/use-script';
import { Loader, Input, extractSystemStyles } from '@mantine/core';
import type { InputWrapperBaseProps, InputSharedProps } from '@mantine/core';
import useStyles from './CKEditorBase.styles';
import { useId } from '@mantine/hooks';

//https://cdn.ckeditor.com/
const _url = 'https://cdn.ckeditor.com/ckeditor5/35.3.0/classic/ckeditor.js';

const readOnlyLockId = 'modules-read-only-lock-id';

import { darkColorScheme, lightColorScheme } from './theme';

export type CKEditorBaseStylesNames = Selectors<typeof useStyles>;

export interface CKEditorBaseProps
  extends DefaultProps<CKEditorBaseStylesNames>,
    InputWrapperBaseProps,
    InputSharedProps {
  /** Editor url */
  editorUrl?: string;

  /** Disabled state */
  disabled?: boolean;

  /** Editor config */
  config?: Record<string, unknown>;

  /** Placeholder */
  placeholder?: string;

  /** Fired when editor content is changed */
  onChange?(value: string): void;

  /** Fired when editor instance is ready */
  onReady?(editor): void;

  /** Fired when editor is focused */
  onFocus?(event): void;

  /** Fired when editor loses focus */
  onBlur?(event): void;

  /** Editor value */
  value?: string;

  /** Id is used to bind input and label, if not passed unique id will be generated for each input */
  id?: string;

  /** Props passed to root element */
  wrapperProps?: Record<string, any>;

  /** Static selectors base */
  __staticSelector?: string;
}

const defaultProps: Partial<CKEditorBaseProps> = {
  editorUrl: _url,
  disabled: false,
  __staticSelector: 'CKEditor',
};

function initEditor(editor, props: CKEditorBaseProps) {
  const { disabled, onChange, onReady, onFocus, onBlur, value } = props;

  if (disabled) {
    editor.enableReadOnlyMode(readOnlyLockId);
  }

  if (typeof value === 'string') {
    editor.setData(value);
  }

  const modelDocument = editor.model.document;
  const viewDocument = editor.editing.view.document;

  modelDocument.on('change:data', () => {
    if (typeof onChange === 'function') {
      const data = editor.getData();
      onChange(data.replace(/[\r]+/g, ''));
    }
  });

  viewDocument.on('focus', (event) => {
    if (typeof onFocus === 'function') {
      onFocus(event);
    }
  });

  viewDocument.on('blur', (event) => {
    if (typeof onBlur === 'function') {
      onBlur(event);
    }
  });

  setTimeout(() => {
    if (typeof onReady === 'function') {
      onReady(editor);
    }
  });
}

function setColorScheme(colorScheme) {
  const r = document.querySelector(':root') as HTMLElement;

  if (colorScheme === 'light') {
    for (const key in lightColorScheme) {
      r.style.setProperty(key, lightColorScheme[key]);
    }
  } else {
    for (const key in darkColorScheme) {
      r.style.setProperty(key, darkColorScheme[key]);
    }
  }
}

function CKEditor(props: CKEditorBaseProps) {
  const {
    disabled,
    editorUrl,
    config,
    value,
    placeholder,
    label,
    error,
    description,
    id,
    className,
    required,
    style,
    wrapperProps,
    classNames,
    styles,
    __staticSelector,
    sx,
    errorProps,
    descriptionProps,
    labelProps,
    inputWrapperOrder,
    inputContainer,
    unstyled,
    withAsterisk,
    ...others
  } = useComponentDefaultProps('CKEditor', defaultProps, props);

  const { classes, cx, theme } = useStyles(null, {
    name: 'CKEditor',
    unstyled,
    classNames,
    styles,
  });

  const status = useScript(editorUrl, {
    removeOnUnmount: false,
  });

  const node = useRef(null);
  const editor = useRef(null);

  const uuid = useId(id);

  const { systemStyles } = extractSystemStyles(others);

  useEffect(() => {
    if (typeof window['ClassicEditor'] !== 'undefined') {
      try {
        window['ClassicEditor']
          .create(node.current, { ...config, ...{ placeholder } })
          .then((e) => {
            editor.current = e;
            setColorScheme(theme.colorScheme);
            initEditor(e, props);
          })
          .catch((error) => {
            console.error(error);
          });
      } catch (error) {
        console.error(error);
      }
    }
  }, [status]);

  useEffect(() => {
    return () => {
      if (editor.current !== null && typeof editor.current.destroy === 'function') {
        editor.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (editor.current) {
      if (disabled) {
        editor.current?.enableReadOnlyMode(readOnlyLockId);
      } else {
        editor.current?.disableReadOnlyMode(readOnlyLockId);
      }
    }
  }, [disabled]);

  useEffect(() => {
    if (editor.current) {
      editor.current.setData(value);
    }
  }, [value]);

  useEffect(() => {
    setColorScheme(theme.colorScheme);
  }, [theme.colorScheme]);

  return (
    <>
      {status !== 'ready' && (
        <div className={classes.loader}>
          <Loader />
        </div>
      )}
      <Input.Wrapper
        label={label}
        error={error}
        id={uuid}
        description={description}
        required={required}
        style={style}
        className={className}
        __staticSelector={__staticSelector}
        sx={sx}
        errorProps={errorProps}
        labelProps={labelProps}
        descriptionProps={descriptionProps}
        inputContainer={inputContainer}
        inputWrapperOrder={inputWrapperOrder}
        unstyled={unstyled}
        withAsterisk={withAsterisk}
        {...systemStyles}
        {...wrapperProps}>
        <div ref={node} />
      </Input.Wrapper>
    </>
  );
}

export default React.memo(CKEditor);
