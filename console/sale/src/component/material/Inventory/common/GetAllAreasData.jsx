import {Cascader} from 'antd';
import React, {PropTypes} from 'react';
import ajax from 'Utility/ajax';
import {appendOwnerUrlIfDev} from '../../../../common/utils';

const GetAllAreasData = React.createClass({
  propTypes: {
    onChange: PropTypes.func,
    value: PropTypes.any,
    style: PropTypes.object,
    disabled: PropTypes.bool,
  },

  getInitialState() {
    return {
      options: [],
    };
  },

  componentDidMount() {
    this.getAllAreasData();
  },

  getAllAreasData() {
    ajax({
      url: appendOwnerUrlIfDev('/sale/asset/getAllAreas.json'),
      method: 'get',
      type: 'json',
      success: (result) => {
        this.setState({
          allAreasData: result.areaDTOList,
        });
        if (result) {
          const options = [];
          for (const key in this.state.allAreasData) {
            if (this.state.allAreasData.hasOwnProperty(key)) {
              const d = this.state.allAreasData[key];
              const option = {
                value: d.i,
                label: d.n,
                children: [],
              };
              /*eslint-disable */
              for (const j in d.c) {
                if (d.c.hasOwnProperty(j)) {
                  const c = d.c[j];
                  option.children.push({
                    value: c.i,
                    label: c.n,
                  });
                }
              }
              /*eslint-enable */
              options.push(option);
            }
          }
          this.setState({
            options: options,
          });
        }
      },
    });
  },
  render() {
    return (<Cascader options={this.state.options} placeholder="请选择城市" onChange={this.props.onChange} defaultValue={this.props.value} style = {this.props.style} disabled={this.props.disabled}/>);
  },
});

export default GetAllAreasData;
