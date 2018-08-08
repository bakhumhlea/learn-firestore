import React, {Component} from 'react';

const COUNTING = true;
const STANDBY = false;
const INITIAL_STATE = {
    timeSet: 0,
    currentTime: 0,
    counting: STANDBY,
}
class Clock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...INITIAL_STATE
        };
    }
    componentDidMount() {
        
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    onSubmit = (e) => {
        e.preventDefault();

        this.setState({ currentTime: this.state.timeSet })
    }

    countdown(e) {
        e.preventDefault();
        if (!this.state.counting) {
            this.setState({counting:COUNTING});
            this.timerID = setInterval(()=>this.tick(),1000)
        } else {
            this.setState({counting:STANDBY});
            clearInterval(this.timerID);
        }
    }
    tick() {
        console.log("Time Counting");
        if (this.state.currentTime <= 1000) {
            console.log("Time Stopped!");
            this.setState({counting:STANDBY});
            clearInterval(this.timerID);
        }
        this.setState({
            currentTime: this.state.currentTime - 1000
        });
    }

    render() {
        const noTimeSet = this.state.currentTime < 1000;
        return (
        <div className="container" style={{width: '400px'}}>
            <div className="row">
                <div className="col">
                    <form onSubmit={this.onSubmit}>
                        <div className="input-group mb-3">
                            <input
                                className="form-control"
                                type="number"
                                min="0"
                                onChange={(e) => this.setState({timeSet: parseInt(e.target.value*1000, 10)})}
                            />
                            <div className="input-group-append">
                                <button 
                                    className="btn btn-secondary"
                                    type="submit"
                                >
                                    Set Time
                                </button>
                            </div>
                        </div>
                    </form>
                    <button 
                        className="btn btn-success" 
                        onClick={(e) => this.countdown(e)}
                        style={{width: '200px'}}
                        disabled={noTimeSet}
                    >
                        {this.state.counting? "Pause":"Start"}
                    </button>
                </div>
                <div className="col">
                    <span style={{fontSize: '4rem'}}>{this.state.currentTime/1000}</span>
                </div>
            </div>
        </div>
        )
    }
}
    

export default Clock;