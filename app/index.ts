import * as ReactDOM from 'react-dom';
import { configure } from 'mobx';
import AppMain from '@/component/Home/';
import Mobile from '@/component/Mobile';
import appService from '@/service/app';

configure({
  enforceActions: 'always',
});

(async () => {

    if (appService.isDEBUG) {
        console.log('Running in DEBUG mode');
        try {
          await import(/* webpackChunkName: "debug" */'@/service/debug');
        } catch(err) {
          console.error('Failed to inject debug service', err);
        }
    }

    ReactDOM.render(
      appService.isMobile ? Mobile() : AppMain,
      document.getElementById('content')
    );
})();
