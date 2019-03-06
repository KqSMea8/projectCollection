import React from 'react';
import {Row, Col} from 'antd';
import {Link} from 'react-router';

import './business-solutions.less';

export default function BusinessSolutions(props) {
  const {solutions = [], demos = []} = props;

  return solutions.length === 0 && demos.length === 0 ? <div></div> : (
    <div className="mod-content business-solutions">
      <h3 className="mod-title"><span className="mod-title-box">行业解决方案</span></h3>
      {
        solutions.length > 0 ?
        <Row gutter={16} type="flex" className="solutions">
        {
          solutions.map((solution, index) => {
            const {img, name} = solution;
            return (
              <Col key={index} span={12}>
                <div className="business-solution">
                  <Link to={`/solution/${index}`} className="mod-link">
                    <img src={img} />
                    <div className="business-title">
                      {name}
                    </div>
                  </Link>
                </div>
              </Col>
            );
          })
        }
        </Row> : null
      }
      <h3 className="mod-title demos-title"><span className="mod-title-box">实际案例</span></h3>
      {
        demos.length > 0 ?
        <Row gutter={16} type="flex" className="demos">
        {
          demos.map((demo, index) => {
            const { img, name, desc } = demo;
            return (
              <Col key={index} span={12}>
                <Link to={`/demo/${index}`} className="mod-link">
                  <div className="business-demo">
                    <Row type="flex">
                      <Col className="demo-img">
                        <img src={img} />
                      </Col>
                      <Col className="demo-content">
                        <h4 className="demo-title">{name}</h4>
                        <p className="demo-info">{desc}</p>
                      </Col>
                    </Row>
                  </div>
                </Link>
              </Col>
            );
          })
        }
        </Row> : null
      }
    </div>
  );
}
