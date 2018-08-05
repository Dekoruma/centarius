import { ModalBasic, Loading } from 'components';
import centariusStateHoc from '@centarius/state-hoc';

const ModalWrapped = ModalBasic;

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

ModalWrapped.fetchData = async () => {
  await timeout(3000);

  // throw new Error('how');

  return { hellos: 'worlds' };
};

export default centariusStateHoc({
  LoadingComponent: Loading,
  ErrorComponent: Loading,
})(ModalWrapped);
