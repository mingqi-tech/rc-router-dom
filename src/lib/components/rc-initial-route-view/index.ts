import { createElement, HTMLProps, ReactElement } from 'react';

/**
 * 默认组件容器
 * @param props
 */
export default (props: HTMLProps<HTMLDivElement>): ReactElement => {
  return createElement('div', props);
};
