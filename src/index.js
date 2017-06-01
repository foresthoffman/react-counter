import React from 'react';
import ReactDOM from 'react-dom';
import Form from './Form.js';
import Counter from './Counter.js';
import './index.css';

class App extends React.Component {
	constructor() {
		super();

		// the size of the canvas that the counter will be drawn on (in pixels)
		const canvasSize = {
			width: 300,
			height: 300
		};
		this.state = {
			frames: 0,
			currentAngle: 0,
			dateInputSupported: false,
			counter: {
				canvasWidth:   canvasSize.width,
				canvasHeight:  canvasSize.height,
				strokeWidth:   10,
				strokeColor:   'black', // #fde244
				startYear:     '01/01/1970',
				year:          '01/01/1970',
				yearText:      '2',
				yearSuffix:    'yrs',
				x:             Number.parseInt( canvasSize.width, 10 ) / 2,
				y:             Number.parseInt( canvasSize.height, 10 ) / 2,
				radius:        Number.parseInt( canvasSize.width, 10 ) / 2 - 10,
				initialAngle:  Math.PI / 2.0, // 0
				finalAngle:    Math.PI * 3.0 / 2.0, // 2 * Math.PI
				antiClockwise: true,
				animSpeed:     30,
			}
		};
	}

	componentDidMount() {

		// there are date fields in the form, so we need to check that the date input type is
		// supported by the browser
		let dateInputSupported = false;
		if ( checkDateInput() ) {
			dateInputSupported = true;
		}

		this.setState({
			dateInputSupported: dateInputSupported,

			// queues up the animation frame request loop
			timeOut: this.tick( this ),
		});
	}

	componentWillUnmount() {
		clearTimeout( this.state.timeOut );
	}

	/**
	 * Handles animation frame requests for drawing the Counter component. This is accomplished by
	 * setting up a timer, based on the provided fps, to consistently request frames from the
	 * browser.
	 *
	 * @param React.Component self A reference to the App component.
	 * @return int The timeoutID returned by setTimeout().
	 */
	tick( self ) {
		return setTimeout(
			() => {

				// determines the radians that should be drawn in the current frame, based on the
				// current progress of the animation (the number of frames) and the speed of the
				// animation. The quotient of the frame count and the fps must be multiplied by
				// pi in order to receive a quantity in radian seconds.
				const radians = ( self.state.frames / self.state.counter.animSpeed ) * Math.PI;

				// determines the angle that the counter should be at in this frame
				const currentAngle = radians + self.state.counter.initialAngle;

				// continues to draw the counter(s), if the necessary frames haven't been drawn
				if ( currentAngle <= self.state.counter.finalAngle ) {

					// requests an animation frame from the browser, so that it will handle the
					// next tick, when it can.
					requestAnimationFrame( () => this.tick( self ) );

					// increments the frame count and updates the state to propagate the new data
					// to the counter
					self.setState({
						frames: self.state.frames + 1,
						currentAngle: currentAngle,
					});
				}
			},
			1000 / this.state.counter.animSpeed
		);
	}

	// updates counter properties based on the values in the form
	onSubmit( event ) {
		event.preventDefault();
		const form = event.target;
		const formLength = form.length;
		let data = {};
		for ( let i = 0; i < formLength; i++ ) {
			let name = form[ i ].name.replace( 'config-', '' );
			let type = form[ i ].type;
			let value;

			switch ( type ) {
				case 'submit':
					continue;
				case 'number':
					if ( 'initialAngle' !== name && 'finalAngle' !== name ) {
						value = ( '' !== form[ i ].value ) ?
							Number.parseFloat( form[ i ].value, 10 ) :
							null;
						break;
					}

					value = ( '' !== form[ i ].value ) ?

						// convert the angles in degrees to radians, for the counter's internal use
						Number.parseFloat( form[ i ].value, 10 ) * ( Math.PI / 180 ) :
						null;
					break;
				case 'checkbox':
					value = ( 'on' === form[ i ].value.toLowerCase() ) ?
						true :
						false;
					break;
				default:
					value = form[ i ].value;
			}

			data[ name ] = ( null !== value && '' !== value ) ? value : this.state.counter[ name ];
		}

		// adds necessary data to the new Counter-data array, which prevents the Counter from breaking
		data.canvasWidth = this.state.counter.canvasHeight;
		data.canvasHeight = this.state.counter.canvasWidth;

		// clears the current timeout object, which may or may not be still in use. When drawing in
		// the request loop has ended, the recursive nature of the loop renders the timeout object
		// unusable.
		clearTimeout( this.state.timeOut );

		// resets state data for the drawing of the Counter component
		this.setState({
			frames: 0,
			currentAngle: 0,
			counter: data,
			timeOut: this.tick( this ),
		});
	}

	render() {
		return (
			<div className='app'>
				<div className='title'>
					<h1>React-based Arc Counter Customizer</h1>
				</div>
				<Form
					onSubmit={ ( e ) => this.onSubmit( e ) }
					dateInputSupported={ this.state.dateInputSupported }
					strokeWidth={ this.state.counter.strokeWidth }
					strokeColor={ this.state.counter.strokeColor }
					startYear={ this.state.counter.startYear }
					year={ this.state.counter.year }
					yearText={ this.state.counter.yearText }
					yearSuffix={ this.state.counter.yearSuffix }
					x={ this.state.counter.x }
					y={ this.state.counter.y }
					radius={ this.state.counter.radius }
					initialAngle={ this.state.counter.initialAngle * ( 180 / Math.PI ) }
					finalAngle={ this.state.counter.finalAngle * ( 180 / Math.PI ) }
					antiClockwise={ this.state.counter.antiClockwise }
					animSpeed={ this.state.counter.animSpeed }
				/>
				<Counter
					currentAngle={ this.state.currentAngle }
					canvasWidth={ this.state.counter.canvasWidth }
					canvasHeight={ this.state.counter.canvasHeight }
					strokeWidth={ this.state.counter.strokeWidth }
					strokeColor={ this.state.counter.strokeColor }
					startYear={ this.state.counter.startYear }
					year={ this.state.counter.year }
					yearText={ this.state.counter.yearText }
					yearSuffix={ this.state.counter.yearSuffix }
					x={ this.state.counter.x }
					y={ this.state.counter.y }
					radius={ this.state.counter.radius }
					initialAngle={ this.state.counter.initialAngle }
					antiClockwise={ this.state.counter.antiClockwise }
				/>
			</div>
		);
	}
}

ReactDOM.render(
	<App />,
	document.getElementById( 'root' ),
);

/**
 * Determines if the current browser supports the "date" input element type. If it is supported,
 * the value assigned to the date input will be sanitized. If not, the input's value will be the
 * same as the invalid date string.
 *
 * @return boolean True if the "date" input type is supported, false otherwise.
 */
function checkDateInput() {
	let input = document.createElement( 'input' );
	input.type = 'date';

	const invalidDate = 'invalid-date';
	input.value = invalidDate;

	return invalidDate !== input.value;
}
