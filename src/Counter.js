import React from 'react';
import ReactDOM from 'react-dom';

class Counter extends React.Component {

	// draws the counter when it has been updated in the React DOM
	componentDidUpdate() {
		const wrapper = ReactDOM.findDOMNode( this );
		const canvas = wrapper.querySelector( '.counter-canvas' );
		const context = canvas.getContext( '2d' );

		// clears the canvas in preparation for drawing this frame
		context.clearRect( 0, 0, canvas.width, canvas.height );

		const rot = ( this.props.antiClockwise ? -1 : 1 );

		// draws counter styles
		context.lineWidth = this.props.strokeWidth;
		context.strokeStyle = this.props.strokeColor;

		// draws counter path
		context.beginPath();
		context.arc(
			this.props.x,
			this.props.y,
			this.props.radius,
			rot * this.props.initialAngle,
			rot * this.props.currentAngle,
			this.props.antiClockwise
		);
		context.stroke();
	}

	// renders the canvas and it's parents and siblings
	render() {
		return (
			<div
				className='counter-canvas-wrapper'
				style={{
					width: this.props.canvasWidth,
					height: this.props.canvasHeight,
					position: 'relative',
				}}
			>
				<canvas
					className='counter-canvas'
					width={ this.props.canvasWidth }
					height={ this.props.canvasHeight }
				></canvas>
				<div
					className='counter-content'
					style={{
						width: this.props.canvasWidth,
						height: this.props.canvasHeight,
						textAlign: 'center',
						position: 'absolute',
						left: 0,
						top: 0,
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<div className='counter-year-text' style={{ marginRight: '0.5rem' }}>
						{ this.props.yearText }
					</div>
					<div className='counter-year-suffix'>
						{ this.props.yearSuffix }
					</div>
				</div>
			</div>
		);
	}
}

export default Counter;
