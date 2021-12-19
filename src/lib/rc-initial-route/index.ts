import { RCBaseRoute } from '../rc-base-route';
import { lazy } from 'react';

/**
 * 初始化路由
 */
export class RcInitialRoute extends RCBaseRoute {
  /**
   * 构造函数
   * @private
   */
  public constructor() {
    super(
      '*',
      'RcInitialRoute',
      lazy(() => import('../components/rc-initial-route-view'))
    );
  }
}
