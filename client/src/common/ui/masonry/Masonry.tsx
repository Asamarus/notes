import React, { forwardRef, useRef, useEffect, useState } from 'react';
import { Selectors, DefaultProps, useComponentDefaultProps } from '@mantine/core';
import { Box, createPolymorphicComponent } from '@mantine/core';
import useStyles, { MasonryStylesParams } from './Masonry.styles';
import { useMergedRef } from '@mantine/hooks';
import { flushSync } from 'react-dom';
import useResponsiveColumns, {
  useResponsiveColumnsCallbackParams,
  useResponsiveColumnsCallbackReturnType,
} from 'hooks/use-responsive-columns';

export type MasonryStylesNames = Selectors<typeof useStyles>;

export interface MasonryProps extends DefaultProps<MasonryStylesNames, MasonryStylesParams> {
  /** Responsive grid params */
  getGridProps: (
    params: useResponsiveColumnsCallbackParams,
  ) => useResponsiveColumnsCallbackReturnType;

  /** The content of the component */
  children?: React.ReactNode;
}

const defaultProps: Partial<MasonryProps> = {};

const parseToNumber = (val) => {
  return Number(val.replace('px', ''));
};

export const _Masonry = forwardRef<HTMLDivElement, MasonryProps>((props, ref) => {
  const { className, getGridProps, children, classNames, styles, unstyled, ...others } =
    useComponentDefaultProps('Masonry', defaultProps, props);

  const { ref: responsiveColumnsRef, columnWidth, gutter } = useResponsiveColumns(getGridProps);

  const { classes, cx } = useStyles(
    { columnWidth, gutter },
    {
      name: 'Masonry',
      unstyled,
      classNames,
      styles,
    },
  );

  const [maxColumnHeight, setMaxColumnHeight] = useState(0);
  const [numberOfLineBreaks, setNumberOfLineBreaks] = useState(0);

  const handleResize = (masonryChildren) => {
    window.requestAnimationFrame(() => {
      if (!masonryRef.current || !masonryChildren || masonryChildren.length === 0) {
        return;
      }
      const masonry = masonryRef.current;
      const masonryFirstChild = masonryRef.current?.firstChild as Element;
      const parentWidth = masonry.clientWidth;
      const firstChildWidth = masonryFirstChild['clientWidth'];

      if (parentWidth === 0 || firstChildWidth === 0) {
        return;
      }

      const firstChildComputedStyle = window.getComputedStyle(masonryFirstChild);
      const firstChildMarginLeft = parseToNumber(firstChildComputedStyle.marginLeft);
      const firstChildMarginRight = parseToNumber(firstChildComputedStyle.marginRight);

      const currentNumberOfColumns = Math.round(
        parentWidth / (firstChildWidth + firstChildMarginLeft + firstChildMarginRight),
      );

      const columnHeights = new Array(currentNumberOfColumns).fill(0);
      let skip = false;
      masonry.childNodes.forEach((child: HTMLElement) => {
        if (child.nodeType !== Node.ELEMENT_NODE || child.dataset.class === 'line-break' || skip) {
          return;
        }
        const childComputedStyle = window.getComputedStyle(child);
        const childMarginTop = parseToNumber(childComputedStyle.marginTop);
        const childMarginBottom = parseToNumber(childComputedStyle.marginBottom);
        // if any one of children isn't rendered yet, masonry's height shouldn't be computed yet
        const childHeight = parseToNumber(childComputedStyle.height)
          ? Math.ceil(parseToNumber(childComputedStyle.height)) + childMarginTop + childMarginBottom
          : 0;
        if (childHeight === 0) {
          skip = true;
          return;
        }
        // if there is a nested image that isn't rendered yet, masonry's height shouldn't be computed yet
        for (let i = 0; i < child.childNodes.length; i += 1) {
          const nestedChild = child.childNodes[i] as Element;

          if (nestedChild.tagName === 'IMG' && nestedChild.clientHeight === 0) {
            skip = true;
            break;
          }
        }
        if (!skip) {
          // find the current shortest column (where the current item will be placed)
          const currentMinColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
          columnHeights[currentMinColumnIndex] += childHeight;
          const order = currentMinColumnIndex + 1;

          child.style.order = `${order}`;
        }
      });
      if (!skip) {
        // In React 18, state updates in a ResizeObserver's callback are happening after the paint which causes flickering
        // when doing some visual updates in it. Using flushSync ensures that the dom will be painted after the states updates happen
        // Related issue - https://github.com/facebook/react/issues/24331
        flushSync(() => {
          setMaxColumnHeight(Math.max(...columnHeights));
          setNumberOfLineBreaks(currentNumberOfColumns > 0 ? currentNumberOfColumns - 1 : 0);
        });
      }
    });
  };

  const masonryRef = useRef<HTMLDivElement>();

  const mergedRef = useMergedRef(masonryRef, responsiveColumnsRef, ref);

  const observer = useRef(
    typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(handleResize),
  );

  useEffect(() => {
    const resizeObserver = observer.current;
    // IE and old browsers are not supported
    if (resizeObserver === undefined) {
      return undefined;
    }

    if (masonryRef.current) {
      masonryRef.current.childNodes.forEach((childNode: Element) => {
        resizeObserver.observe(childNode);
      });
    }
    return () => {
      resizeObserver?.disconnect();
    };
  }, [columnWidth, gutter, children]);

  //  columns are likely to have different heights and hence can start to merge;
  //  a line break at the end of each column prevents columns from merging
  const lineBreaks = new Array(numberOfLineBreaks).fill('').map((_, index) => (
    <span
      key={index}
      data-class="line-break"
      style={{
        flexBasis: '100%',
        width: 0,
        margin: 0,
        padding: 0,
        order: index + 1,
      }}
    />
  ));

  return (
    <Box
      ref={mergedRef}
      component="div"
      className={cx(classes.root, className)}
      style={{
        ...(maxColumnHeight > 0 && {
          height: maxColumnHeight,
        }),
      }}
      {...others}>
      {columnWidth !== '' && children}
      {lineBreaks}
    </Box>
  );
});

const Masonry = createPolymorphicComponent<'div', MasonryProps>(_Masonry);

export default Masonry;
