import * as Loadable from 'react-loadable';
import Loading from '@/component/Loading';

const Board = Loadable({
    loader: () => import(/* webpackChunkName: "Board" */ './'),
    loading: Loading
});

export default Board;
