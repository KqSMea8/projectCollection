import React from 'react';
import {Row, Col} from 'antd';
import {connect} from '@alipay/page-store';

import PageLayout from '../../common/layout';
import Anchor from '../../common/antd_3.x/anchor';

import store from '../boh-home/store';

import './index.less';

const { Link: AnchorLink } = Anchor;

const BREADCRUMB = [
  {
    component: <a href="#/">口碑一体机</a>,
  },
];

@connect(store, undefined, false)
export default class BOHSolutionDetail extends React.Component {
  constructor(props) {
    super(props);

    const {params, location, triggerFetchSolutionList} = props;
    const {pathname} = location;
    const {id} = params;

    let type;
    if (pathname === `/solution/${id}`) {
      type = 'solutions';
    } else if (pathname === `/demo/${id}`) {
      type = 'demos';
    }

    this.state = {
      id,
      type,
    };

    if (props[type].length === 0) {
      triggerFetchSolutionList();
    }
  }

  render() {
    const {id, type} = this.state;
    const data = this.props[type] || [];
    const {name, parts = []} = data[id] || {};
    const breadcrumb = BREADCRUMB.concat([{title: name}]);

    return (
      <PageLayout breadcrumb={breadcrumb} className="solution-detail">
        <Row gutter={24} type="flex">
          <Col span={20}>
            {
              parts.map((item, index) => {
                const {title: modTitle, mainInfo, subInfo, img} = item;
                return (
                  <div key={index} className="mod-content">
                    <h3 className="mod-title" id={`mod-title-${index}`}>{modTitle}</h3>
                    <div className="mod-main-info">{mainInfo}</div>
                    <div className="mod-sub-info">{subInfo}</div>
                    <div className="mod-img">
                      <img src={img} width="100%" />
                    </div>
                  </div>
                );
              })
            }
          </Col>
          <Col span={4} className="mod-menu">
            <Anchor showInkInFixed>
            {
              parts.map((item, index) => {
                const {title: modTitle} = item;
                return (
                  <AnchorLink key={index} href={`#mod-title-${index}`} title={modTitle} />
                );
              })
            }
            </Anchor>
          </Col>
        </Row>
      </PageLayout>
    );
  }
}
