import React from 'react';

import FormWrapper from './FormWrapper';
import { FormMode } from '../../../../common/enum';

export const Create = props => (
  <FormWrapper
    {...props}
    bizType={props.params.bizType}
    mode={FormMode.CREATE}
  />
);

export const Edit = props => (
  <FormWrapper
    {...props}
    bizType={props.params.bizType}
    taskType={props.params.taskType}
    id={props.params.id}
    mode={FormMode.EDIT}
  />
);
