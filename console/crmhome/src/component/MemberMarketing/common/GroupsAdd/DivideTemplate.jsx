import React from 'react';

export default (props) => {
  const {data} = props;
  let i = 0;
  return (
    <divide-template-tips>
      {
        data.m1_value === '-99' || data.m2_value === '-99' || data.d_value === '-99' || data.r1_value === '-99' || data.f_value === '-99' ?
          <p><span className="c3">VIP：</span><span className="c9">无此类人群</span></p> :
          <div>
            <p>
              <span className="c3">VIP：</span><span className="c3"></span></p>
            <p><span className="c9">{`${++i}.会员距离店铺的距离在 ${data.d_value} 公里内`}</span></p>
            <p><span className="c9">{`${++i}.会员最近 ${data.r1_value} 天内有到店消费`}</span></p>
            <p><span className="c9">{`${++i}.${data.m1_value !== '-99' && `会员消费金额大于 ${data.m1_value} 元`}`}
            {data.m1_value !== '-99' && data.m2_value !== '-99' && '或'}
            {data.m2_value !== '-99' && `年行业的消费金额大于 ${data.m2_value} 元`}</span></p>
            {data.f_value !== '-99' && <p><span className="c9">{++i}.会员消费天数大于 {data.f_value} 天</span></p>}
          </div>
      }
      {!!(i = 0)}
      <p><span className="c9">&nbsp; </span></p>
      {
        ['d_value', 'r1_value', 'f_value', 'm1_value', 'm2_value'].some(v => data[v] === '-99') ?
          <p><span className="c3">常客：</span><span className="c9">无此类人群</span></p> :
          <div>
            <p><span className="c3">常客：</span></p>
            <p><span className="c9">1.会员距离店铺的距离在 {data.d_value} 公里内</span></p>
            <p><span className="c9">2.会员最近 {data.r1_value} 天有到店消费</span></p>
            <p><span className="c9">3.会员消费天数大于 {data.f_value} 天</span></p>
            <p><span className="c9">4.会员消费金额小于 {data.m1_value} 元</span></p>
            <p><span className="c9">5.会员年行业的消费金额小于 {data.m2_value} 元</span></p>
          </div>
      }
      <p><span className="c9">&nbsp; </span></p>
      {
        ['d_value', 'f_value', 'r2_value'].some(v => data[v] === '-99') ?
          <p><span className="c3">新客：</span><span className="c9">无此类人群</span></p> :
          <div>
            <p><span className="c3">新客：</span></p>
            <p><span className="c9">1.会员距离店铺的距离在 {data.d_value} 公里内</span></p>
            <p><span className="c9">2.会员最近 {data.r2_value} 天内有到店消费</span></p>
            <p><span className="c9">3.会员消费天数小于等于 {data.f_value} 天</span></p>
          </div>
      }
      <p><span className="c9">&nbsp; </span></p>
      {
        data.d_value === '-99' ?
          <p><span className="c3">过客：</span><span className="c9">无此类人群</span></p> :
          <div>
            <p><span className="c3">过客：</span></p>
            <p><span className="c9">会员距离店铺的距离大于 {data.d_value} 公里</span></p>
          </div>
      }
      <p><span className="c9">&nbsp; </span></p>
      {!!(i = 0)}
      {
        data.d_value === '-99' || data.r1_value === '-99' && (data.r2_value === '-99' || data.f_value === '-99') ?
          <p><span className="c3">流失会员：</span><span className="c9">无此类人群</span></p> :
          <div>
            <p><span className="c3">流失会员：</span></p>
            <p><span className="c9">1.会员距离店铺的距离 {data.d_value} 公里内</span></p>
            <p><span className="c9">2.{data.r1_value !== '-99' && `会员在 ${data.r1_value} 天未到店`}
              {data.r1_value !== '-99' && data.f_value !== '-99' && data.r2_value !== '-99' && '，或者，'}
              {data.f_value !== '-99' && data.r2_value !== '-99' && `会员在 ${data.r2_value} 天未到店且会员总消费天数小于等于 ${data.f_value} 天`}</span></p>
          </div>
      }
      <p>
        <br />
        <span className="c3">声明：会员分层是“{data.cate_2_name}”行业下最近 365 天有消费的会员的智能分层。</span>
      </p>
    </divide-template-tips>
  );
}
  ;
