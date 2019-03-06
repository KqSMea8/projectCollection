import React, { PropTypes } from 'react';
import {Spin, Breadcrumb, Row, Col, Icon} from 'antd';

const renderBreadcrumb = config => {
  const renderItem = item => {
    if (item.link) {
      return <a href={item.link}>{item.title}</a>;
    }
    return item.title;
  };
  return (
    <Breadcrumb
      separator={<Icon type="right" />}
    >
      {config.map((item, index) => <Breadcrumb.Item key={index}>{renderItem(item)}</Breadcrumb.Item>)}
    </Breadcrumb>
  );
};

const PageLayout = props => {
  const wrapperProps = {};
  const { title, breadcrumb, header, footer, spinning, children, id } = props;
  if (id) wrapperProps.id = `page-${id}`;
  return (
    <div {...wrapperProps}>
      <Spin size="large" spinning={spinning}>
        <div className="app-detail-header">
          <Row>
            <Col span="8">
              {breadcrumb ? renderBreadcrumb(breadcrumb) : title}
            </Col>
            <Col span="16">
              {header}
            </Col>
          </Row>
          </div>
        <div className="app-detail-content-padding">{children}</div>
        {footer && <div className="app-detail-footer">{footer}</div>}
      </Spin>
    </div>
  );
};

PageLayout.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  breadcrumb: PropTypes.array,
  header: PropTypes.element,
  footer: PropTypes.element,
  spinning: PropTypes.bool
};

PageLayout.defaultProps = {
  id: '',
  title: '',
  breadcrumb: null,
  header: null,
  footer: null,
  spinning: false
};

export default PageLayout;
