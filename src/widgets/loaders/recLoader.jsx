import './loaders.css';
import React from "react";

export function BouncingLoader(props) {
	return (
		<div className="loader">
			<h1>
				{[...props.text].map((letter, index) =>
					<span key={'bouncing_' + index}>{letter}</span>
				)
				}
			</h1>
		</div>
	);
}
