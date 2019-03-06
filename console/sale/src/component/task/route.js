import Manage from './manage';
import Todo from './todo';

export default [
  {
    path: '/task',
    onEnter(state, replace) {
      replace(null, '/task/manage');
    }
  },
  {
    path: '/task/manage',
    onEnter(state, replace) {
      replace(null, '/task/manage/list');
    }
  },
  {
    path: '/task/manage/list',
    component: Manage.List
  },
  {
    path: '/task/manage/list/:bizType/:taskType',
    component: Manage.List
  },
  {
    path: '/task/manage/create(/:bizType)',
    component: Manage.Create
  },
  {
    path: '/task/manage/edit/:taskType/:id',
    component: Manage.Edit
  },
  {
    path: '/task/todo',
    onEnter(state, replace) {
      replace(null, '/task/todo/list');
    }
  },
  {
    path: '/task/todo/list',
    component: Todo.List
  }
];
