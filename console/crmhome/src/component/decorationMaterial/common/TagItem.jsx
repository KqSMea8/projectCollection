import React, {PropTypes} from 'react';
import {Select} from 'antd';

const TagItem = React.createClass({
  propTypes: {
    dishTagSet: PropTypes.array,
  },
  getInitialState() {
    const {value} = this.props;
    const selectedTagMap = {};
    if (value && value.length) {
      value.forEach(v => selectedTagMap[v.type] = v.value);
    }
    return {
      selectedTagMap: selectedTagMap,
    };
  },
  onDeselect(value) {
    const {selectedTagMap} = this.state;
    for (const i in selectedTagMap) {
      if (selectedTagMap[i] === value) delete selectedTagMap[i];
    }
    this.setState({
      selectedTagMap,
    });
    this.onChange();
  },
  onChange() {
    const {selectedTagMap} = this.state;
    const selectedTag = [];
    for (const i in selectedTagMap) {
      if (i) {
        selectedTag.push({
          type: i,
          value: selectedTagMap[i],
        });
      }
    }
    this.props.onChange(selectedTag);
  },
  changeTag(type, value) {
    const {selectedTagMap} = this.state;
    selectedTagMap[type] = value;
    this.setState({
      selectedTagMap,
    });
    this.onChange();
  },
  render() {
    const {dishTagSet} = this.props;
    const {selectedTagMap} = this.state;
    const tagSelect = dishTagSet && dishTagSet.map((v, i) => {
      const tagItems = v.allValues.map((vv, ii) => {
        let item;
        if (selectedTagMap[v.type]) {
          item = selectedTagMap[v.type] !== vv ? <span className="tag-item" key={ii}>{vv}</span> : <span key={ii}></span>;
        } else {
          item = <a className="tag-item" key={ii} onClick={() => this.changeTag(v.type, vv)}>{vv}</a>;
        }
        return item;
      });
      return <p key={i}><span>{v.type}：</span>{tagItems}</p>;
    });
    return (<div onKeypress={e => e.preventDefault}>
      <Select
        multiple
        placeholder="请在下面的标签中选择"
        style={{width: '100%'}}
        onDeselect={this.onDeselect}
        notFoundContent={null}
        value={Object.values(selectedTagMap)} />
      <div className="tag-select">{tagSelect}</div>
    </div>);
  },
});

export default TagItem;
