import React from 'react';
import type { MovieDetails, RatedItem } from '../types';
import { VerticalMovieRibbon } from './MovieRibbon';

interface RandomMovieGridProps {
    movies: MovieDetails[];
    loading?: boolean;
    header?: string;
    userRatings?: RatedItem[];
}

/**
 * A specialized grid for displaying the "Random" selection of movies.
 * This wraps the VerticalMovieRibbon (or future grid implementation)
 * with specific styling for the large left-hand list.
 */
const RandomMovieGrid: React.FC<RandomMovieGridProps> = ({ 
    movies, 
    loading = false, 
    header = "Rate these movies to help us understand your taste",
    userRatings = []
}) => {
    return (
        <div className="h-[75vh] flex flex-col p-2 rounded bg-gray-900/50">
            <h5 className="text-xl font-bold mb-2 text-white flex-shrink-0">
                {header}
            </h5>
            <div className="flex-grow overflow-hidden">
                <VerticalMovieRibbon 
                    movies={movies} 
                    loading={loading}
                    allowRemove={false}
                    userRatings={userRatings}
                />
            </div>
        </div>
    );
};

export default RandomMovieGrid;
