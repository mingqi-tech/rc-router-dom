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
  ComponentClass,
  createContext,
  createElement,
  FunctionComponent,
  LazyExoticComponent,
  ReactElement,
  ReactNode,
} from 'react';
import { Route } from 'react-router-dom';
import { pathToRegexp } from 'path-to-regexp';

/**
 * @class RCRoute
 */
export class RCRoute<T = any>
  implements Omit<RCRouteImpl, 'path' | 'id' | 'children'>
{
  /**
   * constructor
   * @param id 路由的ID 用于和数据库中的ID匹配
   * @param path 路由的路径
   * @param title 路由的标题
   * @param element 路由的元素
   * @param showMenu 是否显示在菜单中/如果用来遍历菜单可以使用此参数
   * @param routes
   * @param root 根路由
   * @param parent 父级
   * @param icon 路由作为菜单时的图标
   * @param extras
   */
  public constructor(
    private id: string | number,
    private readonly path: string,
    public readonly title?: string,
    public readonly element?:
      | FunctionComponent<any>
      | ComponentClass<any>
      | LazyExoticComponent<any>,
    public readonly showMenu?: boolean,
    routes?: RCRouteImpl[],
    public readonly root?: RCRoute,
    public readonly parent?: RCRoute,
    public readonly icon?: any,
    public readonly extras?: T
  ) {
    if (!root) {
      this.root = this;
    }
    if (routes) {
      this.routes = this.childrenNodes(routes);
    }
  }

  public routes?: RCRoute[];

  /**
   * 获取路径
   */
  public getPath(): string {
    if (this.parent) {
      return [this.parent.getPath(), this.path]
        .join('/')
        .replace(/\/{2}/, '/')
        .replace(/\*/g, '');
    }
    return this.path;
  }

  /**
   * 转换成Route元素
   * @param props
   */
  public toElement(props?: any): ReactElement {
    return createElement(Route, {
      path: this.path,
      element: this.createNode(),
      children: (this.routes || []).map((o) => o.toElement()),
      ...props,
    });
  }

  /**
   * 向下查找 找到为止
   */
  public children(): RCRoute[] {
    if (Array.isArray(this.routes)) {
      const list: RCRoute[] = [];
      this.routes.find((o) => {
        list.push(...o.children());
        return pathToRegexp(o.path).test(this.path);
      });
      return list;
    }
    return [];
  }

  /**
   * 向上查找 找到为止
   */
  public parents(path?: string): RCRoute[] {
    if (this.parent) {
      if (path && pathToRegexp(this.parent.getPath()).test(path)) {
        return [this.parent];
      }
      return [this.parent].concat(this.parent.parents(path));
    }
    return [];
  }

  /**
   * 将element创建为React元素
   * @private
   */
  private createNode(): ReactNode | undefined {
    if (this.element) {
      return createElement(RCRoute.Context.Provider, {
        value: this,
        children: createElement(this.element),
      });
    }
  }

  /**
   * 遍历子元素
   * @private
   */
  private childrenNodes(routes: RCRouteImpl[]): RCRoute[] {
    if (Array.isArray(routes)) {
      return routes.map((o) =>
        RCRoute.create({
          ...o,
          root: this.root,
          parent: this,
        })
      );
    }
    return [];
  }

  /**
   * 创建路由实例
   * @param option
   */
  public static create(option: RCRouteImpl): RCRoute {
    return new RCRoute(
      option.id,
      option.path,
      option.title,
      option.element,
      option.showMenu,
      option.children,
      option.root,
      option.parent,
      option.icon,
      option.extras
    );
  }

  /**
   * 创建路由实现需要的数据
   * @param option
   */
  public static createImpl(option: RCRouteImpl): RCRouteImpl {
    return option;
  }

  /**
   * 路由的Provider提供的上下文
   */
  public static Context = createContext<RCRoute>(
    RCRoute.create({
      id: 'root',
      path: '/*',
    })
  );
}

export interface RCRouteImpl<T = any> {
  readonly id: string;
  readonly path: string;
  readonly title?: string;
  readonly element?:
    | FunctionComponent<any>
    | ComponentClass<any>
    | LazyExoticComponent<any>;
  readonly showMenu?: boolean;
  readonly children?: RCRouteImpl[];
  readonly root?: RCRoute;
  readonly parent?: RCRoute;
  readonly icon?: any;
  readonly extras?: T;
}
