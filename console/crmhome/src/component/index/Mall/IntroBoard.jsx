import React, {PropTypes} from 'react';

const DataItem = React.createClass({
  propTypes: {
    data: PropTypes.array,
    title: PropTypes.string,
    subTitle: PropTypes.string,
    buttonGroup: PropTypes.node,
  },

  render() {
    const picsArr = this.props.data.map((item, i) => {
      const {title, desc, pic} = item;
      return (<li className="intro-item" key={i} style={i === 2 ? {marginRight: 0} : {}}>
        <img src={pic} />
        <dt className="intro-title">{title}</dt>
        <dd className="intro-desc">{desc}</dd>
      </li>);
    });
    const groupBtn = this.props.buttonGroup || null;
    return (
      <div className="index-dashboard-wrap">
        <div className="index-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div className="kb-form-sub-title-icon"></div>
            {this.props.title}
            <p className="index-sub-title">{this.props.subTitle}</p>
          </div>
          {groupBtn}
        </div>
        <div className="index-memberboard-container index-introboard-container">
          <div className="items-wrap">
            {picsArr}
          </div>
        </div>
      </div>
    );
  },
});

export default DataItem;
