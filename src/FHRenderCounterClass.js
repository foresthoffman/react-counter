/* 
 * FHRenderCounterClass by Forest Hoffman, 2016
 *
 * Renders arcs using the 2D canvas renderer in most browsers.
 * 
 * To use, create a block of html using the following format:
 *
 * 		<div id='canvas_wrapper' class='wrapper'>
 *			<canvas id='my_canvas' width='200' height='200'></canvas>
 *			<div id='canvas_content'><span id='year'>2</span> <span id='year_suffix'>yrs</span></div>
 *		</div>
 *
 * Then initizalize the class, configure the counter (optional), and draw the counter with some JS.
 *
 *		var FHRenderCounter = new FHRenderCounterClass( 'my_canvas' );
 *		// put any customizations in this object argument or run with the default settings
 *		FHRenderCounter.set_arc_properties({
 *			'stroke_color': 'green'
 * 		});
 * 		FHRenderCounter.draw_arc();
 *		
 * Customizable Arc properties include:
 *		stroke_width,
 *		stroke_color,
 *		start_year,
 *		year,
 *		year_text,
 *		year_suffix,
 *		x,
 *		y,
 *		radius,
 *		initial_angle,
 *		final_angle,
 *		anti_clockwise,
 *		anim_speed
 *
 */

import jQuery from 'jquery';

function FHRenderCounterClass () {}

FHRenderCounterClass.prototype.init = function ( elem_id ) {	
	this._CANVAS = document.getElementById( elem_id );
	if ( this._CANVAS.getContext ) {
		this.CTX = this._CANVAS.getContext( '2d' );
		
		// canvas-wide styles
		this.CTX.shadowColor = "black";
		this.CTX.shadowBlur = 2;
		this.CTX.shadowOffsetX = 1;
		this.CTX.shadowOffsetY = 1;
		
		this.FRAMES = 0;
		this.ARC = {};
		this._START_YEAR = new Date( 2012, 8, 1 );
		this._MS_IN_YEAR = 31536000000;
		this.MAX_YEARS = this._get_max_years( this._START_YEAR );
	}
};

FHRenderCounterClass.prototype.clear_canvas = function () {
	var width = this._CANVAS.width;
	var height = this._CANVAS.height;
	this.CTX.clearRect( 0, 0, width, height );
};

FHRenderCounterClass.prototype._set_start_year = function ( start_year ) {
	if ( 'undefined' !== typeof( start_year ) ) {
		this._START_YEAR = start_year;
		this.MAX_YEARS = this._get_max_years( this._START_YEAR );
	}
};

FHRenderCounterClass.prototype._get_max_years = function ( start_date ) {
	if ( 'undefined' === typeof( start_date ) ) {
		start_date = this._START_DATE_DEFAULT;
	}
	var max_years = this._get_year_diff( start_date );
	
	return max_years;
};

FHRenderCounterClass.prototype._get_year_diff = function ( date ) {
	var current_date = new Date();
	if ( 'undefined' === typeof( date ) ) {
		date = this._START_YEAR;
	}
	var ms_diff = current_date - date;
	var year_diff = ms_diff / this._MS_IN_YEAR;
	
	return year_diff;
};

FHRenderCounterClass.prototype._get_year_text = function ( date ) {
	var output = '';
	var precision = 1;
	var year_diff = this._get_year_diff( date );
	
	var ceil = Math.ceil( year_diff );
	if ( year_diff > 100 ) {
		precision = 3;
	} else if ( year_diff > 10 ) {
		precision = 2;
	} else {
		precision = 1;
	}
	var rounded = year_diff.toPrecision( precision );
	var decimal_diff = Math.abs( year_diff - ceil );
	
	if ( year_diff < 1 ) {
		output = '< 1';
	} else if ( 0 === decimal_diff ) {
		output = rounded;
	} else if ( decimal_diff > 0 ) {
		output = '~ ' + rounded;
	}
	
	return output;
};

FHRenderCounterClass.prototype._get_year_radians = function ( date ) {
	var year_diff = this._get_year_diff( date );
	var year_ratio = year_diff / this.MAX_YEARS;
	var radians = year_ratio * ( 2 * Math.PI );
	
	return radians;
};

FHRenderCounterClass.prototype.set_arc_properties = function ( custom_properties ) {
	var current_date = new Date();
	var property_defaults = {
		'stroke_width': 	10,
		'stroke_color': 	'#fde244',
		'start_year':		this._START_YEAR,
		'year': 			this._START_YEAR,
		'year_text':		'2',
		'year_suffix': 		'yrs',
		'x': 				this._CANVAS.width / 2,
		'y': 				this._CANVAS.height / 2,
		'radius': 			this._CANVAS.width / 2 - 10,
		'initial_angle': 	0,
		'final_angle': 		2 * Math.PI,
		'anti_clockwise': 	true,
		'anim_speed': 		30
	};
	var property_defaults_keys = Object.keys( property_defaults );
	
	if ( 0 === Object.keys( this.ARC ).length ) {		
		for ( var i = 0; i < property_defaults_keys.length; i++ ) {
			var property_name = property_defaults_keys[ i ];
			var property_value;

			if ( 'undefined' !== typeof( custom_properties ) &&
					'undefined' !== typeof( custom_properties[ property_name ] ) ) {
				property_value = custom_properties[ property_name ];
			} else {
				property_value = property_defaults[ property_name ];
			}
			
			// some custom property handling
			switch ( property_name ) {
				case 'start_year':
					this._set_start_year( property_value );
					break;
				case 'year_text':
					property_value = this._get_year_text( this.ARC.year );
					break;
				case 'final_angle':
					property_value = this._get_year_radians( this.ARC.year );
					break;
			}
									
			this.ARC[ property_name ] = property_value;
		}
	} else if ( 'undefined' !== typeof( custom_properties ) ) {
		var custom_property_keys = Object.keys( custom_properties );
		
		for ( var i = 0; i < custom_properties.length; i++ ) {
			var property_name = custom_property_keys[ i ];
			var property_value = custom_properties[ property_name ];
						
			if ( 'undefined' !== typeof( property_value ) ) {
				
				// some custom property handling
				switch ( property_name ) {
					case 'start_year':
						this._set_start_year( property_value );
						break;
					case 'year_text':
						property_value = this._get_year_text( this.ARC.year );
						break;
					case 'final_angle':
						property_value = this._get_year_radians( this.ARC.year );
						break;
				}
				
				this.ARC[ property_name ] = property_value;
			}
		}
	}
};

FHRenderCounterClass.prototype.draw_arc = function () {
	var initial, final, current, rot, per_frame_rad;
	
	// only run the following when the function is first called
	if ( 0 === this.FRAMES ) {
		
		// if the arc object isn't defined apply the default settings
		if ( 0 === Object.keys( this.ARC ).length ) {
			this.set_arc_properties();
		}
		
		var canvas_content = jQuery( this._CANVAS ).siblings( '#canvas_content' )[0];
		jQuery( canvas_content ).children( '#year' ).text( this.ARC.year_text );
		jQuery( canvas_content ).children( '#year_suffix' ).text( this.ARC.year_suffix );

		jQuery( canvas_content ).css({
			'left': ( this._CANVAS.width / 2 ) - ( canvas_content.clientWidth / 2 ),
			'top': ( this._CANVAS.height / 2 ) - ( canvas_content.clientHeight / 2 )
		});
	}
		
	// prepare the canvas for the next frame
	this.clear_canvas();
	
	// the number of radians to move per frame
	per_frame_rad = ( this.FRAMES / this.ARC.anim_speed ) * ( Math.PI );
	initial = this.ARC.initial_angle;
	final = this.ARC.final_angle;
	current = per_frame_rad + initial;
	
	rot = ( this.ARC.anti_clockwise ? -1 : 1 );
	
	// green arc styles
	this.CTX.lineWidth = this.ARC.stroke_width;
	this.CTX.strokeStyle = this.ARC.stroke_color;
	
	// green arc path
	this.CTX.beginPath();
	this.CTX.arc(
		this.ARC.x,
		this.ARC.y,
		this.ARC.radius,
		( rot * initial ),
		( rot * current ),
		this.ARC.anti_clockwise
	);
	this.CTX.stroke();

	if ( current < final ) {
		this.FRAMES++;
		window.requestAnimationFrame( this.draw_arc.bind( this ) );
	}
};