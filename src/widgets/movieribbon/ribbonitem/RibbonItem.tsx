import React from 'react';
import { Movie } from '../../moviegrid/moviegriditem/MovieGridItem.types';
import './RibbonItem.css';

export interface RibbonItemProps {
	movie: Movie;
}

const RibbonItem: React.FC<RibbonItemProps> = ({
	movie
}) => {
	return (
		<div className="ribbon-item">
			RibbonItem
		</div>
	)
}

export default RibbonItem;