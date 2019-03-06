import React, { PropTypes } from 'react';
import {Spin, Breadcrumb, Icon} from 'antd';
import Steps from './steps';
import './layout.less';

const renderBreadcrumb = config => {
  const renderItem = item => {
    if (item.component) {
      return item.component;
    }
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
  const { header, breadcrumb, steps, footer, loading, children, id, ...wrapperProps } = props;
  const hasHeader = breadcrumb || header;
  if (id) wrapperProps.id = `page-${id}`;
  return (
    <div {...wrapperProps}>
      <Spin spinning={loading}>
        {hasHeader && <div className="app-detail-header">
          {header ? header : renderBreadcrumb(breadcrumb)}
        </div>}
        {steps && <Steps {...steps}/>}
        <div className="app-detail-content-padding">
        {children}
        </div>
        {footer && <div className="app-detail-footer">{footer}</div>}
      </Spin>
    </div>
  );
};

PageLayout.propTypes = {
  id: PropTypes.string,
  breadcrumb: PropTypes.array,
  header: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  footer: PropTypes.element,// 底部
  steps: PropTypes.object,// 步骤条
  loading: PropTypes.bool,
};

PageLayout.defaultProps = {
  id: '',
  title: '',
  breadcrumb: null,
  steps: null,
  header: null,
  footer: null,
  loading: false,
};

export default PageLayout;
