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

	// adjusts the content that will be laid over the counter. This has to be done on the fly, due
	// to the variable width and height of the content.
	adjustContent( wrapper, canvas ) {
		const canvasWidth = Number.parseInt( canvas.style.width, 10 );
		const canvasHeight = Number.parseInt( canvas.style.height, 10 );

		let canvasContent = wrapper.querySelector( '.counter-content' );
		const canvasContentWidth = canvasContent.clientWidth;
		const canvasContentHeight = canvasContent.clientHeight;

		// sets the left position so that the content appears horizontally centered
		canvasContent.style.setProperty(
			'left',
			( canvasWidth / 2 ) - ( canvasContentWidth / 2 )
		);

		// sets the top position so that the content appears vertically centered
		canvasContent.style.setProperty(
			'top',
			( canvasHeight / 2 ) - ( canvasContentHeight / 2 )
		);
	}

	// renders the canvas and it's parents and siblings
	render() {
		return (
			<div className='counter-canvas-wrapper'>
				<canvas className='counter-canvas'
				width={ this.props.canvasWidth }
				height={ this.props.canvasHeight }
			></canvas>
				<div className='counter-content'>
					<span className='counter-year-text'>{ this.props.yearText } </span>
					<span className='counter-year-suffix'>{ this.props.yearSuffix }</span>
				</div>
			</div>
		);
	}
}

export default Counter;
