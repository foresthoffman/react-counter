import React from 'react';

class Form extends React.Component {

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
						defaultValue={ this.props.finalAngle }
						step="0.001"
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
