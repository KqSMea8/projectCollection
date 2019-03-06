import './decoration.less';
import showTrainingTask from '../../common/BindTrainingTask';
import PidFramePage from './PidFramePage';

export default [{
  onEnter: showTrainingTask,
  path: 'decoration',
  component: PidFramePage,
}];
