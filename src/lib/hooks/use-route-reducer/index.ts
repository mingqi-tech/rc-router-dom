/**
 * MIT License
 *
 *  Copyright (c) 2021 @mingqi/rc-router-dom YunlongRan<549510622@qq.com>
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 */

import {
  Dispatch,
  Reducer,
  ReducerAction,
  ReducerState,
  useContext,
  useReducer,
} from 'react';
import { RCBaseRoute } from '../../rc-base-route';
import { Action, AnyAction } from 'redux';

/**
 * 默认reducer
 * @param state
 */
const defaultReducer = <S = undefined>(state: S): S => {
  console.warn('This route context cannot find reducer.');
  return state;
};

/**
 * 使用route reducer
 */
export function useRouteReducer<S = any, A extends Action = AnyAction>(
  initialState?: S
): [ReducerState<Reducer<S, A>>, Dispatch<ReducerAction<Reducer<S, A>>>] {
  const context = useContext(RCBaseRoute.Context);
  const [state, dispatch] = useReducer<Reducer<S, A>>(
    context.reducer || defaultReducer,
    context.initialState || initialState
  );
  if (!context.initialState) {
    context.initialState = initialState;
  }

  return [
    state,
    (value: ReducerAction<Reducer<S, A>>): void => {
      context.initialState = value;
      dispatch(value);
    },
  ];
}
