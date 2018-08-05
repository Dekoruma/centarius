import React from 'react';

import { ModalBasic, Loading } from 'components';
import centariusStateHoc from '@centarius/state-hoc';

const ModalWrapped = ModalBasic;

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

ModalWrapped.fetchData = async () => {
  await timeout(3000);

  return { hellosss: 'worldsss' };
};

export default centariusStateHoc({
  LoadingComponent: Loading,
  ErrorComponent: () => <div>error has been throw</div>,
})(ModalWrapped);
