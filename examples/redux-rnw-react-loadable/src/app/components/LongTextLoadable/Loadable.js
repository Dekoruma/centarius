import LoadableVisibility from 'react-loadable-visibility/react-loadable';
import { Loading } from 'components';

export default LoadableVisibility({
  loader: () => import('./index'),
  loading: Loading,
});
