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

import { pathToRegexp, compile } from 'path-to-regexp';
import {
  ComponentClass,
  createContext,
  createElement,
  FunctionComponent,
  LazyExoticComponent,
  ReactElement,
  ReactNode,
  Reducer,
} from 'react';
import { LocaleLanguageKey } from '../constants';
import { RcInitialRoute } from '../rc-initial-route';
import { Route } from 'react-router-dom';
import { Action, AnyAction, CombinedState } from 'redux';
import { RCRouteImpl } from '../rc-route';

/**
 * 抽象基础路由类
 * @class RCBaseRoute
 */
export abstract class RCBaseRoute<
  T = any,
  S = any,
  A extends Action = AnyAction
> {
  /**
   * 路由的Provider提供的上下文
   */
  public static Context = createContext<RCBaseRoute<any, any, any>>(
    new RcInitialRoute()
  );

  /**
   * 路由path 不允许以斜杠开头
   * @abstract
   */
  private path: string;

  /**
   * 路由名称 只允许 /^[A-z][A-z0-9_]+/
   * @abstract
   */
  private name: string;

  /**
   * 构造函数
   * @param path 路由路径
   * @param name 路由名称
   * @param controller 路由控制器
   * @param children 路由子页面
   * @param root 路由的根路由
   * @param parent 父路由
   * @param title 标题
   * @param reducer  reducer
   * @param initialState reducer的初始state
   * @param icon 图标
   * @param extras 额外数据
   * @param locale 本地语言包
   * @param titleLocaleKey 标题在本地语言包中的key
   * @param showMenu 是否显示在菜单中
   * @param description 描述
   */
  protected constructor(
    path: string,
    name: string,
    public readonly controller:
      | FunctionComponent<any>
      | ComponentClass<any>
      | LazyExoticComponent<any>,
    children?: RCRouteImpl[] | RCBaseRoute[],
    public root?: RCBaseRoute,
    public parent?: RCBaseRoute,
    public readonly title?: string,
    public readonly reducer?: Reducer<CombinedState<S>, A>,
    public initialState?: CombinedState<S>,
    public readonly icon?: FunctionComponent<any> | ComponentClass<any>,
    public readonly extras?: T,
    public readonly locale?: Partial<
      Record<LocaleLanguageKey, Record<string, string>>
    >,
    public readonly titleLocaleKey?: string,
    public readonly showMenu?: boolean,
    public readonly description?: string
  ) {
    this.setPath(path);
    this.setName(name);
    if (!this.root) {
      this.root = this as any;
    }
  }

  /**
   * 子路由列表
   */
  public readonly children?: RCBaseRoute[];

  /**
   * 向上查找父，找到指定name的route为止，如果不指定name则返回所有
   */
  public getParentsByName(name?: string): RCBaseRoute[] {
    if (this.parent) {
      if (name && this.parent.name === name) {
        return [this.parent];
      } else {
        return this.parent.getParentsByName(name).concat([this.parent]);
      }
    }
    return [];
  }

  /**
   * 向上查找父，找到指定path的route为止，如果不指定path则返回所有
   * @param path
   */
  public getParentsByPath(path?: string): RCBaseRoute[] {
    if (this.parent) {
      if (path && pathToRegexp(this.parent.getFullPath()).test(path)) {
        return [this.parent];
      } else {
        return this.parent.getParentsByName(path).concat([this.parent]);
      }
    }
    return [];
  }

  /**
   * 获取所有子路由
   */
  public getAllChildren(): RCBaseRoute[] {
    if (this.children) {
      return ([] as RCBaseRoute[]).concat(
        ...this.children.map((o) => o.getAllChildren())
      );
    }
    return [];
  }

  /**
   * 所有父级
   */
  public getAllParents(): RCBaseRoute[] {
    const { parent } = this;
    if (parent) {
      return [parent, ...parent.getAllParents()];
    }
    return [];
  }

  /**
   * 根据名称获取路由
   * @param name
   */
  public getRouteByName(name: string): RCBaseRoute | undefined {
    const allRoutes = this.getAllChildren();
    return allRoutes.find((o) => o.name === name);
  }

  /**
   * 根据path获取路由
   * @param path
   */
  public getRouteByPath(path: string): RCBaseRoute | undefined {
    const allRoutes = this.getAllChildren();
    return allRoutes.find((o) => pathToRegexp(o.getFullPath()).test(path));
  }

  /**
   * 设置路由名称
   * @param name
   */
  public setName(name: string): void {
    if (/^[A-z][A-z0-9_]+/.test(name)) {
      this.name = name;
    } else {
      console.error('Route name must match "/^[A-z][A-z0-9_]+/".');
      console.error(`   at route name: "${name}"`);
      console.error(`   at route path: "${this.path}"`);
    }
  }

  /**
   * 获取路由名称
   */
  public getName(): string {
    return this.name;
  }

  /**
   * 设置path
   * @param path 路由path不允许以斜杠开头
   */
  public setPath(path: string): void {
    if (!/^\//.test(path) && !/\/$/.test(path)) {
      this.path = path;
    } else {
      console.error('Route path cannot start and end with "/".');
      console.error(`   at route path: "${path}"`);
      console.error(`   at route name: "${this.name}"`);
    }
  }

  /**
   * 获取path
   */
  public getPath(): string {
    return this.path;
  }

  /**
   * 获取完整路径
   */
  public getFullPath(): string {
    if (this.parent) {
      return [this.parent.getFullPath(), this.getPath()].join('/');
    }
    return ['', this.getPath()].join('/');
  }

  /**
   * 转换为路径
   * @param data
   */
  public toPath(data: Record<string, string | number>): string {
    return compile(this.getFullPath(), { encode: encodeURIComponent })(data);
  }

  /**
   * 将element创建为React元素
   * @private
   */
  private createNode(): ReactNode | undefined {
    if (this.controller) {
      return createElement(RCBaseRoute.Context.Provider, {
        value: this,
        children: createElement(this.controller),
      });
    }
  }

  /**
   * 转换成Route元素
   * @param props
   */
  public toElement(props?: any): ReactElement {
    return createElement(Route, {
      path: this.path,
      element: this.createNode(),
      children: (this.children || []).map((o) => o.toElement()),
      ...props,
    });
  }
}

export interface RCBaseRouteImpl<
  T = any,
  S = any,
  A extends Action = AnyAction
> {
  readonly path: string;
  readonly name: string;
  readonly controller:
    | FunctionComponent<any>
    | ComponentClass<any>
    | LazyExoticComponent<any>;
  readonly children?: RCRouteImpl[] | RCBaseRoute[];
  root?: RCBaseRoute;
  parent?: RCBaseRoute;
  readonly title?: string;
  readonly reducer?: Reducer<CombinedState<S>, A>;
  readonly initialState?: CombinedState<S>;
  readonly icon?: FunctionComponent<any> | ComponentClass<any>;
  readonly extras?: T;
  readonly locale?: Partial<Record<LocaleLanguageKey, Record<string, string>>>;
  readonly titleLocaleKey?: string;
  readonly showMenu?: boolean;
  readonly description?: string;
}
