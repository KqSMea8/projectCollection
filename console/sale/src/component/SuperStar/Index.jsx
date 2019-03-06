import React from 'react';
import SuperStarForm from './SuperStarForm';
import SuperStarTable from './SuperStarTable';
import { Link } from 'react-router';
import {Button} from 'antd';
import ajax from 'Utility/ajax';

export default class SuperStart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      params: {},
      cityList: [],
    };
  }

  componentDidMount() {
    this.getCityUrl();
  }

  onSearch = params => {
    this.setState({
      params,
    });
  }

  getCityUrl = () => {
    ajax({
      url: '/manage/superbrand/initCity.json?id=1',
      method: 'get',
      data: {},
      type: 'json',
      success: (res) => {
        this.setState({cityList: res.data});
      },
      error: () => {
      },
    });
  }

  render() {
    const {cityList, params} = this.state;
    return (<div className="kb-manage">
        <div>
          <p style={{padding: 15, fontSize: 16, fontWeight: 400, borderBottom: '1px solid #e4e4e4'}}>
            <span>品牌管理</span>
            <Link to="/superstar/create">
              <Button type="primary" style={{marginRight: 10, float: 'right'}}>新增品牌</Button>
            </Link>
          </p>
        </div>
        <div style={{margin: 20}}>
          <SuperStarForm cityList={cityList} onSearch={this.onSearch}/>
          <SuperStarTable cityList={cityList} params={params}/>
        </div>
      </div>);
  }
}
