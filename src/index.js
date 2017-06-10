/**
 * Arc Counter Customizer
 *
 * This is an example project and my first deep dive into using the ReactJS library.
 *
 * Copyright 2017 Forest Hoffman
 * http://foresthoffman.com
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Form from './Form.js';
import Counter from './Counter.js';
import './index.css';

/**
 * The App component handles the state of the application, form requests, and rendering the Counter.
 */
class App extends React.Component {
	constructor() {
		super();

		// the size of the canvas that the counter will be drawn on (in pixels)
		const canvasSize = {
			width: 300,
			height: 300
		};

		// sets the default date that the Counter will counter backwards towards from today's date
		const startYear = '01/01/2000';

		// Sets the upper date boundary of the counter. Without a final angle property, this will
		// be compared with the start year property to determine how far the counter should be drawn.
		const year = '01/01/1970';

		// determines the angle at which the Counter should begin drawing (units are in radians)
		const initialAngle = 0;

		// determines the angle to which the Counter should draw (units are in radians)
		const finalAngle = this.getAngleFromYears( startYear, year );

		// sets the default year text to the difference between the start year date and the current
		// date in years
		const yearText = Number.parseInt( getYearDiff( startYear ), 10 );

		this.state = {
			frames: 0,
			currentAngle: 0,
			dateInputSupported: false,
			counter: {
				canvasWidth:   canvasSize.width,
				canvasHeight:  canvasSize.height,
				strokeWidth:   10,
				strokeColor:   'black', // #fde244
				startYear:     startYear,
				year:          year,
				yearText:      yearText,
				yearSuffix:    'yrs',
				x:             Number.parseInt( canvasSize.width, 10 ) / 2,
				y:             Number.parseInt( canvasSize.height, 10 ) / 2,
				radius:        Number.parseInt( canvasSize.width, 10 ) / 2 - 10,
				initialAngle:  initialAngle,
				finalAngle:    finalAngle,
				antiClockwise: true,
				animSpeed:     30,
			},
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

		// destroys the timeout created in tick()
		clearTimeout( this.state.timeOut );
	}

	/**
	 * Handles animation frame requests for drawing the Counter component. This is accomplished by
	 * setting up a timer, based on the provided fps (animation speed), to consistently request
	 * frames from the browser.
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

	/**
	 * Handles form submissions and updates the App's state with the new Counter data. The data
	 * that is passed onto the Counter is modified depending on the render mode. The render mode
	 * is either set to "automatic" or "manual". The automatic render mode handles the initial and
	 * final angles as well as the text contained within the Counter. The manual render mode allows
	 * users to directly control the initial and final angles as well the text within the Counter.
	 *
	 * @param Event event The submission event.
	 */
	onSubmit( event ) {
		event.preventDefault();
		const form = event.target;
		const formLength = form.length;
		let data = {};
		let renderMode = '';
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
				case 'radio':

					// takes the render mode value from the first checked render mode input
					if ( ! renderMode && form[ i ].checked ) {
						renderMode = ( 'automatic' === form[ i ].value ) ? 'automatic' : 'manual';
					}
					continue;
				case 'date':

					// this only applies to browsers that support the "date" input type
					// e.g. Chrome
					value = form[ i ].value;
					const regex = /([0-9]{4})-([0-9]{2})-([0-9]{2})/g;
					const matches = regex.exec( value );
					if ( value && matches ) {
						const month = matches[2];
						const day = matches[3];
						const year = matches[1];
						value = month + '/' + day + '/' + year;
					} else {
						value = this.state.counter[ name ];
					}
					break;
				default:
					value = form[ i ].value;
			}

			data[ name ] = ( null !== value ) ? value : this.state.counter[ name ];
		}

		if ( 'automatic' === renderMode ) {

			// Sets the initial angle to 0 radians. Otherwise the drawn arc wouldn't accurately
			// represent a proportion of time with respect to the difference between the maximum
			// date (the "year" property) and the current date. That is, assuming that the initial
			// angle value provided via the form is not equal to 0.
			data.initialAngle = 0;

			// determines the angle to which the Counter should draw (units are in radians)
			data.finalAngle = this.getAngleFromYears( data.startYear, data.year );

			// sets the year text to the difference between the start year date and the current
			// date in years
			data.yearText = Number.parseInt( getYearDiff( data.startYear ), 10 );
			data.yearSuffix = 'yrs';
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

	/**
	 * Determines the final angle of the Counter based on the provided start year date and the upper
	 * bound year date.
	 *
	 * @param string startYear A date string indicating the start year date.
	 * @param string year      A date string indicating the year date. This dictates the upper bound
	 *                         of the year dates. Used in a proportion to determine how far the
	 *                         Counter should draw.
	 * @return null|float The Counter's final angle in radians. It will be in the range [0, 2pi].
	 *                    Null upon failure.
	 */
	getAngleFromYears( startYear, year ) {

		// weeds out invalid date strings
		if ( 'undefined' === typeof startYear || 'undefined' === typeof year ||
			! Date.parse( startYear ) || ! Date.parse( year ) ) {

			throw new TypeError( 'startYear and year must be valid date strings. e.g. "01/01/1970"' );
		}

		// gets the difference between the start year date and today, in milliseconds
		const startMilliDiff = getMilliDiff( startYear );

		// gets the difference between the upper bound year date and today, in milliseconds
		const maxMilliDiff = getMilliDiff( year );

		// returns a radian value that is a fraction of 2pi
		return ( startMilliDiff / maxMilliDiff ) * ( 2 * Math.PI );
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

/**
 * Determines the time past since the date provided.
 *
 * @param string prev A date string indicating a past date to subtract from today's date.
 * @return null|int The difference between the start year date and today in milliseconds. Null
 *                    upon failure.
 */
function getMilliDiff( prev ) {

	// weeds out invalid date strings and undefined arguments
	if ( 'undefined' === typeof prev || 0 === prev.length || ! Date.parse( prev ) ) {
		throw new TypeError( 'prev must be a valid date string. e.g. "01/01/1970"' );
	}

	const prevDate = Date.parse( prev );
	const currDate = Date.now();

	// checks that the provided start date is from the past, throws an exception if it isn't
	if ( currDate < prevDate ) {
		throw new RangeError( 'The start date must be older then today\'s date.' );
	}

	return currDate - prevDate;
}

/**
 * Determines the time past since the date provided.
 *
 * @param string prev A date string indicating a past date to subtract from today's date.
 * @return null|float The difference between the start year date and today in years. Null upon
 *                    failure.
 */
function getYearDiff( prev ) {

	// weeds out invalid date strings and undefined arguments
	if ( 'undefined' === typeof prev || 0 === prev.length || ! Date.parse( prev ) ) {
		throw new TypeError( 'prev must be a valid date string. e.g. "01/01/1970"' );
	}

	const prevDate = Date.parse( prev );
	const currDate = Date.now();

	// checks that the provided start date is from the past, throws an exception if it isn't
	if ( currDate < prevDate ) {
		throw new RangeError( 'The start date must be older then today\'s date.' );
	}

	const msDiff = getMilliDiff( prev );
	const msPerYear = 31536000000;

	return msDiff / msPerYear;
}
