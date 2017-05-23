import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class App extends React.Component {
	render() {
		return (
			<div className='app'>
				<div className='title'>
					<h1>React-based Arc Counter Customizer</h1>
				</div>
			</div>
		);
	}
}

ReactDOM.render(
	<App />,
	document.getElementById( 'root' ),
);