import * as React from 'react';
import moment from 'moment';

interface State {
  now : any;
  interval : any;
}

interface Props {
    time : number;
}

class Countdown extends React.Component<Props, State> {

    constructor(props) {
      super(props);
      const interval = setInterval(() => {
          this.setState({ now: moment() });
      }, 1000);
      this.state = {
          now: moment(),
          interval,
      };
    }

    public componentWillUnmount() {
        clearInterval(this.state.interval);
    }

    public render() {
        const { time } = this.props;
        const { now } = this.state;
        const timeMoment = moment(time * 1000);
        const diff = timeMoment.diff(now, 'seconds');
        return (
            <span>
                {(diff > 60) && now.to(timeMoment)}
                {(diff <= 60) && diff}
            </span>
        );
    }
}

export default Countdown;
