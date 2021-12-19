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

import { RCBaseRoute, RCBaseRouteImpl } from '../rc-base-route';
import { Action, AnyAction } from 'redux';
import { RCRoute, RCRouteImpl } from '../rc-route';

/**
 * @class RCModule
 */
export class RCModule<
  T = any,
  S = any,
  A extends Action = AnyAction
> extends RCBaseRoute<T, S, A> {
  /**
   * 创建路由实例
   * @param option
   */
  public static create<T, S, A extends Action = AnyAction>(
    option: RCModuleImpl<T, S, A>
  ): RCRoute<T, S, A> {
    return new RCModule<T, S, A>(option);
  }

  /**
   * 子路由列表
   */
  public children?: RCBaseRoute[] = undefined;

  /**
   * 构造函数
   * @param option
   */
  protected constructor(option: RCModuleImpl<T, S, A>) {
    super(
      option.path,
      option.name,
      option.controller,
      option.id,
      undefined,
      option.root,
      option.parent,
      option.title,
      option.reducer,
      option.initialState,
      option.icon,
      option.extras,
      option.locale,
      option.titleLocaleKey,
      option.showMenu,
      option.description
    );

    if (option.children) {
      this.children = option.children.map((o) => {
        if (o instanceof RCBaseRoute) {
          o.root = this.root;
          o.parent = this as RCBaseRoute;
          return o;
        } else {
          return RCRoute.create({
            ...o,
            root: this.root,
            parent: this as RCBaseRoute,
          });
        }
      });
    }
  }
}

export interface RCModuleImpl<T = any, S = any, A extends Action = AnyAction>
  extends Omit<RCBaseRouteImpl<T, S, A>, 'children'> {
  /**
   * 子路由
   */
  readonly children?: Array<RCModule | RCRoute | RCRouteImpl>;

  /**
   * 父模块
   */
  parent?: RCModule;
}
