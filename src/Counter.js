import React from 'react';
import ReactDOM from 'react-dom';
import CounterCanvas from './CounterCanvas.js';

class Counter extends React.Component {

	// setups defaults for the canvas properties
	constructor( props ) {
		super( props );

		const width = this.props.canvasWidth ? Number.parseInt( this.props.canvasWidth, 10 ) : 200;
		const height = this.props.canvasHeight ? Number.parseInt( this.props.canvasHeight, 10 ) : 200;
		this.state = {
			canvas: null,
			context: null,
			frames: 0,
			animating: true,
			props: {
				strokeWidth:   this.props.strokeWidth ?
					           Number.parseInt( this.props.strokeWidth, 10 ) :
					           10,
				strokeColor:   this.props.strokeColor ? this.props.strokeColor : '#fde244',
				startYear:     this.props.startYear ?
					           new Date( this.props.startYear ) :
					           new Date( 1970, 1, 1 ),
				year:          this.props.year ?
					           new Date( this.props.year ) :
					           new Date( 1970, 1, 1 ),
				yearText:      this.props.yearText ? this.props.yearText : '2',
				yearSuffix:    this.props.yearSuffix ? this.props.yearSuffix : 'yrs',
				x:             this.props.x ? Number.parseInt( this.props.x, 10 ) : width / 2,
				y:             this.props.y ? Number.parseInt( this.props.y, 10 ) : height / 2,
				radius:        this.props.radius ?
					           Number.parseInt( this.props.radius, 10 ) :
					           width / 2 - 10,
				initialAngle:  this.props.initialAngle ?
					           Number.parseInt( this.props.initialAngle, 10 ) :
					           0,
				finalAngle:    this.props.finalAngle ?
					           Number.parseInt( this.props.finalAngle, 10 ) :
					           2 * Math.PI,
				antiClockwise: this.props.antiClockwise ? this.props.antiClockwise : true,
				animSpeed:     this.props.animSpeed ?
					           Number.parseInt( this.props.animSpeed, 10 ) :
					           30,
				shadowColor:   'black',
				shadowBlur:    2,
				shadowOffsetX: 1,
				shadowOffsetY: 1,
			},
		};
	}

	// setups initial referencing of the canvas and it's context, which is necessary for drawing
	componentDidMount() {
		const wrapper = ReactDOM.findDOMNode( this );
		const canvas = wrapper.querySelector( '.counter-canvas' );
		this.setState({
			canvas: canvas,
			context: canvas.getContext( '2d' ),
		});
		this.adjustContent( wrapper, canvas );
		this.animate();
	}

	// // runs the animation frame every time the view is updated
	// componentDidUpdate() {
	// 	if ( this.state.animating ) {
	// 		this.animate();
	// 	}
	// }

	// animates the counter
	animate() {
		if ( this.state.animating ) {
			let context = this.state.context;
			if ( ! context ) {
				return;
			}
			let canvas = this.state.canvas;

			// stores the canvas properties in a variable that won't get confused with "this.props"
			const canvasProps = this.state.props;

			// clears the canvas in preparation for drawing this frame
			context.clearRect( 0, 0, canvas.width, canvas.height );

			// determines the number of radians to draw this frame
			const radPerFrame = ( this.state.frames / canvasProps.animSpeed ) * ( Math.PI );
			const currentAngle = radPerFrame + canvasProps.initialAngle;
			const rot = ( canvasProps.antiClockwise ? -1 : 1 );

			// draws counter styles
			context.lineWidth = canvasProps.strokeWidth;
			context.strokeStyle = canvasProps.strokeColor;

			// draws counter path
			context.beginPath();
			context.arc(
				canvasProps.x,
				canvasProps.y,
				canvasProps.radius,
				rot * canvasProps.initialAngle,
				rot * currentAngle,
				canvasProps.antiClockwise
			);
			context.stroke();

			// calls the next frame, if the counter isn't complete. Otherwise the animation loop is
			// broken.
			if ( currentAngle < canvasProps.finalAngle ) {
				this.setState({
					frames: this.state.frames + 1,
				});
			} else {
				this.setState({	animating: false });
			}
		}
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
				<CounterCanvas className='counter-canvas'
					width={ this.props.canvasWidth }
					height={ this.props.canvasHeight }
					animate={ () => this.animate() }
				/>
				<div className='counter-content'>
					<span className='counter-year-text'>{ this.props.yearText } </span>
					<span className='counter-year-suffix'>{ this.props.yearSuffix }</span>
				</div>
			</div>
		);
	}
}

export default Counter;
