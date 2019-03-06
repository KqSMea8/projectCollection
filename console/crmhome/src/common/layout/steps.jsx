import React, { PropTypes } from 'react';
import {Steps} from 'antd';
const Step = Steps.Step;


const PageLayout = props => {
  const {steps, current} = props;
  return (<div className="app-componets">
    <Steps current={current}>
      {steps.map((item, index) => <Step key={index} title={item.title} description={item.description} />)}
    </Steps></div>
  );
};

PageLayout.propTypes = {
  steps: PropTypes.array,
  current: PropTypes.number,
};

PageLayout.defaultProps = {
  current: 1,
  steps: null,
};

export default PageLayout;
