/**
 * Form Component
 *
 * Copyright 2017 Forest Hoffman
 * http://foresthoffman.com
 */

import React from 'react';
import ReactDOM from 'react-dom';

/**
 * The Form Component is used by the Arc Counter Customizer app to allow the user to customize the
 * Counter on the fly.
 */
class Form extends React.Component {
	componentDidMount() {

		// triggers the onChange event for the render mode input
		this.toggleRenderMode();
	}

	/**
	 * Disables the year text, and initial/final angle fields when the render mode is set to
	 * "Automatic". This allows the Counter to determine the angles it should use and the text it
	 * should contain based on the dates provided. Alternatively, the date fields are disabled when
	 * the the render mode is set to "Manual". As the name implies, the manual mode allows for
	 * direct control over the angles the Counter draws from/to and the year text contained within.
	 *
	 * @param Event e Optional. The event.
	 */
	toggleRenderMode( e ) {
		let form, mode = null;
		let i = 0;

		if ( 'undefined' === typeof e ) {
			form = ReactDOM.findDOMNode( this );
			mode = form.querySelector( '.config-renderMode' ).value;
		} else {
			form = e.target.parentElement.parentElement;
			mode = e.target.value;
		}

		// creates an array of input field classes indicating the fields that should be disabled
		// for each of the render modes
		const fieldsToDisable = {
			'automatic': [
				'.config-yearText',
				'.config-initialAngle',
				'.config-finalAngle',
			],
			'manual': [
				'.config-startYear',
				'.config-year',
			],
		};

		if ( 'automatic' === mode || 'manual' === mode ) {
			const otherMode = 'automatic' === mode ? 'manual' : 'automatic';

			// slaps the field classes together for one DOM query
			const disableClassStr = fieldsToDisable[ mode ].join( ',' );
			const enableClassStr = fieldsToDisable[ otherMode ].join( ',' );

			// disables the irrelevant fields
			let disableFields = form.querySelectorAll( disableClassStr );
			let disableLen = disableFields.length;
			for ( i = 0; i < disableLen; i++ ) {
				disableFields[ i ].disabled = true;
			}

			// enables the relevant fields
			let enableFields = form.querySelectorAll( enableClassStr );
			let enableLen = enableFields.length;
			for ( i = 0; i < enableLen; i++ ) {
				enableFields[ i ].disabled = false;
			}
		}
	}

	/**
	 * Toggles the value of a checkbox input between the values of "on" and an empty string ("").
	 * This is because inputs in JSX are read only by default without providing a handler for change
	 * events. The value property is set to "on" when the checked property is true and an empty
	 * string when the checked property is false.
	 *
	 * @param Event e The event.
	 */
	toggleCheckbox( e ) {
		let checkbox = e.target;
		checkbox.value = checkbox.checked ? 'on' : '';
	}

	render() {
		return (
			<form className='config-form' onSubmit={ ( e ) => this.props.onSubmit( e ) }>
				<div className='config-group'>
					{ /* Render Mode */ }
					<label htmlFor='config-renderMode'>Configure render mode:</label>
					<input
						name='config-renderMode'
						className='config-renderMode'
						type='radio'
						value='automatic'
						defaultChecked
						onChange={ this.toggleRenderMode }
					/>
					<small>Automatic *</small>
					<input
						name='config-renderMode'
						className='config-renderMode'
						type='radio'
						value='manual'
						onChange={ this.toggleRenderMode }
					/>
					<small>Manual **</small>
					<p>
						<small>* In automatic mode, the Counter determines it's own angles and inner text based on the provided dates.</small>
						<br/>
						<small>** In manual mode, the Counter uses whatever angles and inner text it is provided from the form.</small>
					</p>
				</div>
				<div className='config-group'>
					{ /* Stroke Width */ }
					<label htmlFor='config-strokeWidth'>Configure stroke width:</label>
					<input
						name='config-strokeWidth'
						className='config-strokeWidth'
						type='number'
						defaultValue={ this.props.strokeWidth }
					/><span>px</span>
				</div>
				<div className='config-group'>
					{ /* Stroke Color */ }
					<label htmlFor='config-strokeColor'>Configure stroke color:</label>
					<input
						name='config-strokeColor'
						className='config-strokeColor'
						type='text'
						defaultValue={ this.props.strokeColor }
					/>
				</div>
				<div className='config-group'>
					{ /* Start Year */ }
					<label htmlFor='config-startYear'>Configure start year:</label>
					<DatePicker
						name='config-startYear'
						className='config-startYear'
						value={ this.props.startYear }
						isSupported={ this.props.dateInputSupported }
					/>
				</div>
				<div className='config-group'>
					{ /* Year */ }
					<label htmlFor='config-year'>Configure variable year:</label>
					<DatePicker
						name='config-year'
						className='config-year'
						value={ this.props.year }
						isSupported={ this.props.dateInputSupported }
					/>
				</div>
				<div className='config-group'>
					{ /* Year Text */ }
					<label htmlFor='config-yearText'>Configure year text:</label>
					<input
						name='config-yearText'
						className='config-yearText'
						type='text'
						defaultValue={ this.props.yearText }
					/>
				</div>
				<div className='config-group'>
					{ /* Year Suffix */ }
					<label htmlFor='config-yearSuffix'>Configure year suffix:</label>
					<input
						name='config-yearSuffix'
						className='config-yearSuffix'
						type='text'
						defaultValue={ this.props.yearSuffix }
					/>
				</div>
				<div className='config-group'>
					{ /* X-Axis Origin */ }
					<label htmlFor='config-x'>Configure x-axis origin:</label>
					<input
						name='config-x'
						className='config-x'
						type='number'
						defaultValue={ this.props.x }
					/><span>px</span>
				</div>
				<div className='config-group'>
					{ /* Y-Axis Origin */ }
					<label htmlFor='config-y'>Configure y-axis origin:</label>
					<input
						name='config-y'
						className='config-y'
						type='number'
						defaultValue={ this.props.y }
					/><span>px</span>
				</div>
				<div className='config-group'>
					{ /* Radius */ }
					<label htmlFor='config-radius'>Configure arc radius:</label>
					<input
						name='config-radius'
						className='config-radius'
						type='number'
						defaultValue={ this.props.radius }
					/><span>px</span>
				</div>
				<div className='config-group'>
					{ /* Initial Angle */ }
					<label htmlFor='config-initialAngle'>Configure initial angle:</label>
					<input
						name='config-initialAngle'
						className='config-initialAngle'
						type='number'
						defaultValue={ this.props.initialAngle }
						step="0.001"
						min="0"
						max="360"
					/><span>degrees</span>
				</div>
				<div className='config-group'>
					{ /* Final Angle */ }
					<label htmlFor='config-finalAngle'>Configure final angle:</label>
					<input
						name='config-finalAngle'
						className='config-finalAngle'
						type='number'
						defaultValue={ this.props.finalAngle.toPrecision( 5 ) }
						step="0.0001"
						min="0"
						max="360"
					/><span>degrees</span>
				</div>
				<div className='config-group'>
					{ /* Anti-clockwise */ }
					<label htmlFor='config-antiClockwise'>Configure rotation (anti-clockwise):</label>
					<input
						name='config-antiClockwise'
						className='config-antiClockwise'
						type='checkbox'
						defaultChecked
						onChange={ this.toggleCheckbox }
					/>
				</div>
				<div className='config-group'>
					{ /* Animation Speed */ }
					<label htmlFor='config-animSpeed'>Configure animation speed:</label>
					<input
						name='config-animSpeed'
						className='config-animSpeed'
						type='number'
						defaultValue={ this.props.animSpeed }
					/><span>frames/second</span>
				</div>
				<input type='submit' value='Submit' />
			</form>
		);
	}
}

/**
 * DatePicker
 *
 * A date picker input for dealing with inconsistent browser support of the "date" input field type.
 */
class DatePicker extends React.Component {
	render() {
		return (
			<input name={ this.props.name }
				className={ this.props.className }
				type='date'
				defaultValue={ this.props.value }
			/>
		);
	}
}

export default Form;
