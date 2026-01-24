import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import MovieDetailsCard from './MovieDetailsCard';
import {MovieCard, type MovieDetails, type RatedItem} from "rssa-study-template";

export interface MovieRibbonProps {
    movies: MovieDetails[];
    loading?: boolean;
    allowRemove?: boolean;
    removeItemCallback?: (movieId: string) => void;
    userRatings?: RatedItem[];
    rows?: number; // legacy prop
    cols?: number; // legacy prop
    header?: string; // legacy prop
}

const MovieRibbonItem: React.FC<{
    movie: MovieDetails;
    allowRemove: boolean;
    removeItemCallback: (movieId: string) => void;
    variant: 'horizontal' | 'vertical';
    userRating?: RatedItem;
}> = ({
    movie,
    allowRemove,
    removeItemCallback,
    variant,
    userRating,
}) => {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div
            className={clsx(
                "relative flex-shrink-0 group",
                variant === 'horizontal' 
                    ? "w-32 mr-4" 
                    : "w-full mb-4" 
            )}
        >
            <MovieDetailsCard
                show={showDetails}
                closeCallback={() => setShowDetails(false)}
                movieItem={movie}
            />
            
            <MovieCard 
                movie={movie} 
                userRating={userRating} 
                onClick={() => setShowDetails(true)}
            />
            
            {allowRemove && (
                <button
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-bl-md px-2 py-1 text-xs hover:bg-red-600 z-10"
                    onClick={(e) => {
                        e.stopPropagation();
                        removeItemCallback(movie.id);
                    }}
                >
                    x
                </button>
            )}
        </div>
    );
};

export const HorizontalMovieRibbon: React.FC<MovieRibbonProps> = (props) => {
    const {
        movies,
        loading = false,
        allowRemove = false,
        removeItemCallback = () => {},
        userRatings = [],
    } = props;

    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [movies]);

    const scroll = (offset: number) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
            setTimeout(checkScroll, 300);
        }
    };

    return (
        <div className="relative w-full">
            {loading && movies.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                    <span>Loading...</span>
                </div>
            )}
            
            <div className="flex items-center">
                <button
                    className={clsx(
                        "p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-0 transition-opacity",
                        !canScrollLeft && "cursor-default"
                    )}
                    onClick={() => scroll(-200)}
                    disabled={!canScrollLeft}
                >
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>

                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto scrollbar-hide py-4 px-2 flex-grow scroll-smooth"
                    onScroll={checkScroll}
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {movies.length > 0 ? (
                        movies.map((movie) => {
                            const userRating = userRatings?.find(r => r.item_id === movie.id);
                            return (
                                <MovieRibbonItem
                                    key={movie.id}
                                    movie={movie}
                                    allowRemove={allowRemove}
                                    removeItemCallback={removeItemCallback}
                                    variant="horizontal"
                                    userRating={userRating}
                                />
                            );
                        })
                    ) : (
                        <div className="w-full text-center py-8 text-gray-500 italic">
                            Movies you rate will appear here.
                        </div>
                    )}
                </div>

                <button
                    className={clsx(
                        "p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-0 transition-opacity",
                        !canScrollRight && "cursor-default"
                    )}
                    onClick={() => scroll(200)}
                    disabled={!canScrollRight}
                >
                    <ChevronRightIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export const VerticalMovieRibbon: React.FC<MovieRibbonProps> = (props) => {
     const {
        movies,
        loading = false,
        allowRemove = false,
        removeItemCallback = () => {},
        userRatings = [],
    } = props;

    return (
        <div className="flex flex-col w-full space-y-2 h-full overflow-y-auto pr-2 custom-scrollbar">
             {loading && movies.length === 0 && (
                <div className="text-center py-4">Loading...</div>
            )}
            {movies.map((movie) => {
                const userRating = userRatings?.find(r => r.item_id === movie.id);
                return (
                    <MovieRibbonItem
                        key={movie.id}
                        movie={movie}
                        allowRemove={allowRemove}
                        removeItemCallback={removeItemCallback}
                        variant="vertical"
                        userRating={userRating}
                    />
                );
            })}
        </div>
    );
};

export default HorizontalMovieRibbon;
