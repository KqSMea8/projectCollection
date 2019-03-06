import request from '../utils/request';

export const query = () => {
  console.log(request('/api/query'));
}
