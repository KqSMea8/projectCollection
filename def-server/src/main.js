import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
    (
        <div>react组件</div>
    ),
    document.getElementById('app')
);
if(module.hot){
    module.hot.accept()
}