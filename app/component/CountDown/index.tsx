import * as React from 'react';

interface State {
  now : Date;
  interval : any;
}

interface Props {
    time : number;
}

class Countdown extends React.Component<Props, State> {

    constructor(props) {
      super(props);
      const interval = setInterval(() => {
          this.setState({ now: new Date() });
      }, 1000);
      this.state = {
          now: new Date(),
          interval,
      };
    }

    public componentWillUnmount() {
        clearInterval(this.state.interval);
    }

    public render() {
        const { time } = this.props;
        const { now } = this.state;
        const countDown = Math.floor(time - (now.getTime() / 1000));
        return (
            <span>
                {countDown < 0 ? 0 : countDown}
            </span>
        );
    }
}

export default Countdown;
