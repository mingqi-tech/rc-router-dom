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
import { pathToRegexp, compile, Key, PathFunction } from 'path-to-regexp';

const nameCollection: Map<string, RCRoute> = new Map();

const routeCollection: Set<RCRoute> = new Set();

/**
 * @class RCRoute
 */
export class RCRoute<T = any>
  implements Omit<RCRouteImpl, 'path' | 'children'>
{
  private readonly keys: Key[] = [];

  private readonly regexp: RegExp;

  public routes?: RCRoute[];

  private compile: PathFunction<object>;

  /**
   * constructor
   * @param name 路由的名称
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
    public name: string,
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
    public readonly icon?: FunctionComponent<any> | ComponentClass<any>,
    public readonly extras?: T
  ) {
    this.regexp = pathToRegexp(this.getPath(), this.keys);
    this.compile = compile(this.getPath(), {
      encode: encodeURIComponent,
    });
    if (!root) {
      this.root = this;
    }
    if (routes) {
      this.routes = this.childrenNodes(routes);
    }

    if (name) {
      const route = nameCollection.get(name);
      if (route) {
        console.warn(
          ` This route name: ${name} has been registered. Please do not register again. If it is repeated, the route will be overwritten, so that the associated lookup cannot be performed
.\nRegistered route details:\n      path: ${
            route.path
          }\n  fullPath: ${route.getPath()}\n Current route details:\n      path: ${
            this.path
          }  fullPath: ${this.getPath()}`
        );
      }
      nameCollection.set(name, this);
    }
    routeCollection.add(this);
  }

  /**
   * 转换为路径
   * @param data
   */
  public toPath(data: object): string {
    return this.compile(data);
  }

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
    return this.path.replace(/\/{2}/, '/').replace(/\*/g, '');
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
   * 获取所有路由
   */
  public getAllRoutes(): RCRoute[] {
    return Array.from(routeCollection);
  }

  /**
   * 根据路由名称查找路由
   * @param name
   */
  public getRouteByName<T = any>(name: string): RCRoute<T> | undefined {
    return nameCollection.get(name);
  }

  /**
   * 根据path查找路由
   * 找到第一个匹配的就结束
   * @param path
   */
  public getRouteByPath<T = any>(path: string): RCRoute<T> | null {
    return this.getAllRoutes().find(
      (o) => o.path === path
    ) as RCRoute<T> | null;
  }

  /**
   * 获取相同path的路由
   * @param path
   */
  public getRoutesByPath<T = any>(path: string): RCRoute<T>[] {
    return this.getAllRoutes().filter((o) => o.path === path);
  }

  /**
   * 创建路由实例
   * @param option
   */
  public static create(option: RCRouteImpl): RCRoute {
    return new RCRoute(
      option.name,
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
      name: 'root',
      path: '/*',
    })
  );
}

export interface RCRouteImpl<T = any> {
  readonly name: string;
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
