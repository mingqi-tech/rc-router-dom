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

import { RCRoute, RCRouteImpl } from '../rc-route';
import { createElement, ReactElement } from 'react';
import { BrowserRouter, HashRouter, Routes } from 'react-router-dom';

/**
 * @class RCRouter
 */
export class RCRouter implements RCRouterImpl {
  /**
   * constructor
   * @param route 跟路由
   * @param basename 多实例项目开发时使用
   * @param mode 路由模式
   * @param window window对象
   */
  public constructor(
    public readonly route: RCRouteImpl,
    public readonly basename?: string,
    public readonly mode?: 'hash' | 'browser',
    public readonly window?: Window
  ) {}

  /**
   * 将路由对象转换成 ReactElement
   */
  public toElement(): ReactElement {
    const { mode, basename, route } = this;
    const root = RCRoute.create(route);
    return createElement(RCRoute.Context.Provider, {
      value: root,
      children: createElement(mode === 'hash' ? HashRouter : BrowserRouter, {
        basename,
        window,
        children: createElement(Routes, {
          children: root.toElement(),
        }),
      }),
    });
  }

  /**
   * 创建路由实例
   * @param option
   */
  public static create(option: RCRouterImpl): RCRouter {
    return new RCRouter(
      option.route,
      option.basename,
      option.mode || 'browser',
      option.window
    );
  }
}

export interface RCRouterImpl {
  readonly route: RCRouteImpl;
  readonly basename?: string;
  readonly mode?: 'hash' | 'browser';
  readonly window?: Window;
}
