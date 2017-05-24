import React from 'react';
import ReactDOM from 'react-dom';
import Form from './Form.js';
import './index.css';

class App extends React.Component {
	constructor() {
		super();

		// the size of the canvas that the counter will be drawn on (in pixels)
		const canvasSize = {
			width: 600,
			height: 600
		};
		this.state = {
			dateInputSupported: false,
			counter: {
				stroke_width:   10,
				stroke_color:   '#fde244',
				start_year:     '01/01/1970',
				year:           '01/01/1970',
				year_text:      '2',
				year_suffix:    'yrs',
				x:              canvasSize.width / 2,
				y:              canvasSize.height / 2,
				radius:         canvasSize.width / 2 - 10,
				initial_angle:  0,
				final_angle:    2 * Math.PI,
				anti_clockwise: true,
				anim_speed:     30
			}
		};
	}

	componentDidMount() {

		// there are date fields in the form, so we need to check that the date input type is
		// supported by the browser
		if ( checkDateInput() ) {
			this.state.dateInputSupported = true;
		}
	}

	onSubmit( event ) {
		event.preventDefault();
		const form = event.target;
		const formLength = form.length;
		let data = {};
		for ( let i = 0; i < formLength; i++ ) {
			let name = form[ i ].name.replace( 'config-', '' ).replace( '-', '_' );
			let type = form[ i ].type;
			let value;

			switch ( type ) {
				case 'number':
					value = ( '' !== form[ i ].value ) ?
						Number.parseInt( form[ i ].value, 1 ) :
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

		console.log( data );
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
