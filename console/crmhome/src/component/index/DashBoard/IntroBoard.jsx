import React, {PropTypes} from 'react';

const DataItem = React.createClass({
  propTypes: {
    data: PropTypes.array,
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

    return (
      <div className="index-dashboard-wrap">
        <div className="index-memberboard-container index-introboard-container">
          <p className="container-title">优质的场景营销</p>
          <div className="items-wrap">
            {picsArr}
          </div>
        </div>
      </div>
    );
  },
});

export default DataItem;
