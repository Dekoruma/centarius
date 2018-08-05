import loadable from 'loadable-components';
import { Loading } from 'components';

export default loadable(() => import('./index'), {
  LoadingComponent: Loading,
});
