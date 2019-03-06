import React from 'react';
import { Row, Col, Breadcrumb, Icon } from 'antd';
import { node, arrayOf, shape, string } from 'prop-types';

import './style.less';

export default function Page(props) {
  const { title, breadcrumb, header, children, className, ...otherProps } = props;

  return (
    <div className={`c-page ${className || ''}`} {...otherProps}>
      <Row className="c-page-header">
        <Col span="12">
          <Breadcrumb separator={<Icon type="right" />}>
            {(breadcrumb || [{ title }]).map((item, index) => (
              <Breadcrumb.Item key={index}>
                {item.link ? <a href={item.link}>{item.title}</a> : item.title}
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
        </Col>
        <Col className="c-page-header-right" span="12">{header}</Col>
      </Row>
      <div className="c-page-main">{children}</div>
    </div>
  );
}

Page.propTypes = {
  title: node, // title 和 breadcrumb 优先展示 breadcrumb
  breadcrumb: arrayOf(shape({
    link: string, // 链接地址
    title: string.isRequired, // 标题
  })),
  header: node, // 头部右侧内容
  children: node,
  className: string,
};
