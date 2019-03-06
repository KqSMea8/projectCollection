import React from 'react';
import { message } from 'antd';
import ajax from '../../../../common/ajax';

class GroupsViewThird extends React.Component {
  static propTypes = {
    third: React.PropTypes.object,
  }

  state = { tagMap: {} }

  componentWillMount() {
    ajax({
      url: '/promo/merchant/crowd/thirdTag.json',
      method: 'GET',
      type: 'json',
      success: ({ status, data, errorMsg }) => {
        if (status === 'success') {
          const tagMap = {};
          const categories = data.oneOf.categories;
          categories.forEach(({ tags, title: label }) =>
            tags.map(({ tagCode, title, sources: options }) => {
              tagMap[tagCode] = { label, title, options };
            }));
          this.setState({ tagMap });
        } else {
          message.error(errorMsg);
        }
      },
    });
  }

  render() {
    const { third } = this.props;
    const { tagMap } = this.state;
    const keys = Object.keys(third);
    const tagName = tagMap[keys[0]] && tagMap[keys[0]].label || '';
    keys.unshift('tagName');
    const lastLine = keys.length % 3 ? keys.length - keys.length % 3 : keys.length - 3;
    const items = keys.map((key, i) => {
      if (i === 0) {
        return (
          <div key={key} data-last-line={i >= lastLine}>
            <label>标签名称</label>
            <span>{tagName}</span>
          </div>
        );
      }
      const { title = '', options = [] } = tagMap[key] || {};
      let newValue = '不限制';
      options.every(({ label: label2, value: value2 }) => {
        if (value2 === third[key]) {
          newValue = label2;
          return false;
        }
        return true;
      });
      return (
        <div key={key} data-last-line={i >= lastLine}>
          <label>{title}</label>
          <span>{newValue}</span>
        </div>
      );
    });
    return (
      <groups-view-third>
        <div><span>第三方标签</span></div>
        <div>{items}</div>
      </groups-view-third>
    );
  }
}

export default GroupsViewThird;
