import PhotoList from './PhotoList/PhotoList';
import showTrainingTask from '../../common/BindTrainingTask';

export default [
  {
    path: 'photo',
    component: PhotoList,
    onEnter: showTrainingTask,
  },
];
