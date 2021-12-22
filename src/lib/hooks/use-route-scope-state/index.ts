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

import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { RCBaseRoute } from '../../rc-base-route';

const excludes: any[] = [Number, String, Object, Function, Symbol, RegExp];

/**
 * 获取当前上下文中的Route实例
 */
export function useRouteScopeState<T extends {}>(
  initialState: T
): [T, Dispatch<SetStateAction<T>>] {
  const context = useContext(RCBaseRoute.Context);
  if (excludes.includes(initialState.constructor)) {
    throw new Error(
      `Invalid state, init state instance exclude ${excludes.join(' ')}`
    );
  }
  initialState =
    context.routeStateMap.get(initialState.constructor) || initialState;
  const [state, dispatch] = useState({});
  return [
    initialState,
    (value: SetStateAction<T>): void => {
      dispatch({ ...state });
      context.routeStateMap.set(initialState.constructor, value);
    },
  ];
}
