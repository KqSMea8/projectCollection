import React from 'react';
import {Menu, Dropdown, Icon} from 'antd';

export default {
  renderAction(code, map) {
    const action = map[code];
    if (!action) {
      return null;
    }
    if (action.render) {
      return (<span key={code}>
        {action.render()}
      </span>);
    }
    return <a key={code} onClick={action.onClick}>{action.text}</a>;
  },

  /**
   * 主要使用方法，生成操作按钮的渲染列表
   * @param actions: 操作CODE集
   * @param map: 操作CODE和配置的对应关系
   *   [{ text: '操作文本', render | onClick }]
   */
  renderActions(actions, map) {
    if (!actions || !actions.length) {
      return null;
    }

    const result = [
      this.renderAction(actions[0], map),
    ];

    if (actions.length >= 2) {
      result.push(<span key="ft-bar" className="ft-bar">|</span>);

      if (actions.length === 2) {
        result.push(this.renderAction(actions[1], map));
      } else {
        // 大于3条记录需要使用更多
        result.push(this.renderMoreAction(actions.slice(1), map));
      }
    }

    return (<span>
      {result}
    </span>);
  },

  renderMoreAction(actions, map) {
    const onClick = ({key}) => {
      const action = map[key];
      if (!action) {
        return null;
      }
      if (action.onClick) {
        action.onClick();
      }
    };

    const items = actions.map((code) => {
      const action = map[code];
      if (!action) {
        return null;
      }
      return <Menu.Item key={code}>{action.render ? action.render() : action.text}</Menu.Item>;
    });

    const menu = (
      <Menu onClick={onClick}>
        {items}
      </Menu>
    );

    return (
      <Dropdown key={actions[0]} overlay={menu}>
        <a className="ant-dropdown-link">更多 <Icon type="down" /></a>
      </Dropdown>
    );
  },
};
