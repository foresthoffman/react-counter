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
			radPerFrame: 0,
			dateInputSupported: false,
			counter: {
				canvasWidth:   canvasSize.width,
				canvasHeight:  canvasSize.height,
				strokeWidth:   10,
				strokeColor:   '#fde244',
				startYear:     '01/01/1970',
				year:          '01/01/1970',
				yearText:      '2',
				yearSuffix:    'yrs',
				x:             Number.parseInt( canvasSize.width, 10 ) / 2,
				y:             Number.parseInt( canvasSize.height, 10 ) / 2,
				radius:        Number.parseInt( canvasSize.width, 10 ) / 2 - 10,
				initialAngle:  0,
				finalAngle:    2 * Math.PI,
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

		let self = this;

		this.setState({
			dateInputSupported: dateInputSupported,
			request: requestAnimationFrame( () => this.tick( self ) ),
		});
	}

	componentWillUnmount() {
		cancelAnimationFrame( this.state.request );
	}

	tick( self ) {
		const radPerFrame = ( self.state.frames / self.state.counter.animSpeed ) * Math.PI;
		const currentAngle = radPerFrame + self.state.counter.initialAngle;
		if ( currentAngle < self.state.counter.finalAngle ) {
			self.setState({
				radPerFrame: radPerFrame,
				frames: self.state.frames + 1,
				request: requestAnimationFrame( () => this.tick( self ) ),
			});
		}
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
				case 'number':
					value = ( '' !== form[ i ].value ) ?
						Number.parseInt( form[ i ].value, 10 ) :
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

			if ( null !== value ) {
				data[ name ] = value;
			}
		}

		this.setState({
			counter: Object.assign( this.state.counter, data ),
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
				/>
				<Counter
					frames={ this.state.frames }
					radPerFrame={ this.state.radPerFrame }
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
					finalAngle={ this.state.counter.finalAngle }
					antiClockwise={ this.state.counter.antiClockwise }
					animSpeed={ this.state.counter.animSpeed }
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
