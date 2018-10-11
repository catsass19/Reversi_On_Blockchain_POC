import * as React from 'react';

interface State {
  now : Date;
  interval : any;
}

class Countdown extends React.Component<{}, State> {

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
        return (
          <span>
              {this.state.now.toLocaleString()}
          </span>
        );
    }
}

export default Countdown;
