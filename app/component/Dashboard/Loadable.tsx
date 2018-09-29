import * as Loadable from 'react-loadable';
import Loading from '@/component/Loading';

const Dashboard = Loadable({
    loader: () => import(/* webpackChunkName: "Dashboard" */ './'),
    loading: Loading
});

export default Dashboard;
