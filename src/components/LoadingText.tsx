import React from 'react';
import { Spinner } from 'react-bootstrap';

interface LoadingTextProps {
	text: string;
}


const LoadingText: React.FC<LoadingTextProps> = ({ text }) => {
	return (
		<>
			<Spinner
				as="span"
				animation="grow"
				size="sm"
				role="status"
				aria-hidden="true"
			/>
			{text}
		</>
	)
}

export default LoadingText;