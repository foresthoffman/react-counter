/**
 * Arc Counter Component
 *
 * Copyright 2017 Forest Hoffman
 * http://foresthoffman.com
 */

import React from 'react';
import ReactDOM from 'react-dom';

/**
 * The Counter Component is used by the Arc Counter Customizer app to render each frame of the
 * animated counter.
 */
class Counter extends React.Component {

	/**
	 * Draws the Counter when it has been updated in the React DOM. First the canvas is cleared, and
	 * then the component properties are used to draw the arc and it's stroke.
	 */
	componentDidUpdate() {
		const wrapper = ReactDOM.findDOMNode( this );
		const canvas = wrapper.querySelector( '.counter-canvas' );
		const context = canvas.getContext( '2d' );

		// clears the canvas in preparation for drawing this frame
		context.clearRect( 0, 0, canvas.width, canvas.height );

		// Determines which direction the counter should draw. Anti-clockwise is considered
		// backwards relative to the CanvasRenderingContext2D class, that's why the sign must be
		// flipped.
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

	/**
	 * Renders the canvas wrapper, canvas, and counter text. The Counter text ("yearText" and
	 * "yearSuffix" properties) blocks are siblings of the canvas because they overlap the canvas
	 * when fully loaded.
	 */
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
