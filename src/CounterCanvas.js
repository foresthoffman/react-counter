import React from 'react';
import ReactDOM from 'react-dom';

class CounterCanvas extends React.Component {
	componentDidUpdate() {
		this.props.animate();
	}

	render() {
		return (
			<canvas className={ this.props.className }
				width={ this.props.width }
				height={ this.props.height }
			></canvas>
		);
	}
}

export default CounterCanvas;
