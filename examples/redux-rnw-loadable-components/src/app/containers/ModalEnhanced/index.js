import { ModalEnhanced } from 'components';

const ModalWrapped = ModalEnhanced;

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

ModalWrapped.fetchData = async () => {
  await timeout(3000);

  return { hellosss: 'worldsss' };
};

export default ModalWrapped;
