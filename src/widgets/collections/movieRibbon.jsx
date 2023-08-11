import React, { useEffect, useRef, useState } from 'react';
import { BouncingLoader } from '../loaders/recLoader';
import { HorizontalMovieRibbonItem, VerticalMovieRibbonItem } from './movieRibbonItem';

export const HorizontalMovieRibbon = (props) => {

	const allowRemove = props.allowRemove || false;
	const removeItemCallback = allowRemove && props.removeItemCallback ? props.removeItemCallback : () => { };

	const showStarRating = props.showStarRating || false;
	const infoButton = props.infoButton || false;

	const allowRating = props.allowRating === undefined ? false : props.allowRating;
	const rateMovieHandler = allowRating && props.rateMovieHandler ? props.rateMovieHandler : () => { };

	const autoScroll = props.autoScroll || 'disabled';

	const [movies, setMovies] = useState([]);
	useEffect(() => { setMovies(props.movies) }, [props.movies]);

	useEffect(() => {
		console.log("MovieRibbon: ", ribbonScroller.current.offsetWidth, ribbonScroller.current.scrollWidth);
	}, [movies]);

	const [loading, setLoading] = useState(props.loading);
	useEffect(() => { setLoading(props.loading) }, [props.loading]);

	const ribbonScroller = useRef(null);

	const [enableLeftScroll, setEnableLeftScroll] = useState(false);
	const [enableRightScroll, setEnableRightScroll] = useState(false);
	useEffect(() => {
		if (ribbonScroller) {
			if (autoScroll === 'left') {
				ribbonScroller.current.scrollLeft = 0;
			}
			if (autoScroll === 'right') {
				ribbonScroller.current.scrollLeft = ribbonScroller.current.scrollWidth;
			}
			setEnableLeftScroll(ribbonScroller.current.scrollLeft > 0);
			console.log("MovieRibbon OffsetWidth: ", ribbonScroller.current.offsetWidth, " ScrollWidth: ", ribbonScroller.current.scrollWidth, " ScrollLeft: ", ribbonScroller.current.scrollLeft)
			setEnableRightScroll(ribbonScroller.current.offsetWidth < ribbonScroller.current.scrollWidth);
		}
	}, [movies, autoScroll]);

	const scrollLeft = () => {
		ribbonScroller.current.scrollLeft -= 120;
		if (ribbonScroller.current.scrollLeft <= 0) {
			setEnableLeftScroll(false);
		}
		if (!enableRightScroll) {
			setEnableRightScroll(true);
		}
	}

	const scrollRight = () => {
		ribbonScroller.current.scrollLeft += 120;
		if (ribbonScroller.current.scrollLeft >= ribbonScroller.current.scrollWidth - ribbonScroller.current.offsetWidth) {
			setEnableRightScroll(false);
		}
		if (!enableLeftScroll) {
			setEnableLeftScroll(true);
		}
	}

	return (
		<div style={{ position: "relative" }}>
			{
				loading && movies.length === 0 &&
				<BouncingLoader key={props.customKey}
					text="Loading..." />
			}
			<div style={{ display: "inline-flex", width: "100%" }}>
				<ScrollLeftButton onClick={() => scrollLeft()} disabled={!enableLeftScroll} />
				<div className="movieRibbonH recRibbon" ref={ribbonScroller}>
					{movies.length > 0 ? movies.map((movie) =>
						<HorizontalMovieRibbonItem key={'"rated_' + movie.movie_id + '"'}
							isLoading={loading}
							movieItem={movie}
							showStarRating={showStarRating}
							infoButton={infoButton}
							allowRemove={allowRemove}
							allowRating={allowRating}
							rateMovieCallback={rateMovieHandler}
							removeItemCallback={removeItemCallback} />
					) : <>
						<p style={{ margin: "auto" }}>
							Movies you rate will appear here.
						</p>
					</>}
				</div>
				<ScrollRightButton onClick={scrollRight} disabled={!enableRightScroll} />
			</div>
		</div>
	)
}

const ScrollLeftButton = (props) => {

	return (
		<div className={"ribbonScrollButton leftArrow " + (props.disabled ? "disabled" : "")}
			onClick={props.disabled ? () => { } : props.onClick}>
			<p>
				&lt;
			</p>
		</div>
	)
}

const ScrollRightButton = (props) => {
	return (
		<div className={"ribbonScrollButton rightArrow " + (props.disabled ? "disabled" : "")}
			onClick={props.disabled ? () => { } : props.onClick}>
			<p>
				&gt;
			</p>
		</div>
	)
}

export const VerticalMovieRibbon = (props) => {

	const allowRemove = props.allowRemove || false;
	const removeItemCallback = allowRemove && props.removeItemCallback ? props.removeItemCallback : () => { };

	const showStarRating = props.showStarRating || false;
	const infoButton = props.infoButton || false;

	const allowRating = props.allowRating === undefined ? false : props.allowRating;
	// const rateMovieHandler = allowRating && props.ratingCallback ? props.ratingCallback : () => { };

	const rateMovieHandler = (movieId, rating) => {
		console.log(movieId, rating);
		props.ratingCallback(movieId, rating, true);
	}

	const [movies, setMovies] = useState([]);
	useEffect(() => { setMovies(props.movies) }, [props.movies]);

	const [loading, setLoading] = useState(props.loading);
	useEffect(() => { setLoading(props.loading) }, [props.loading]);

	return (
		// <div style={{ position: "relative" }}>
		<div>
			{/* {
				(loading) &&
				<BouncingLoader key={props.customKey}
					text="Loading..." />
			} */}
			{/* <div style={{ display: "inline-flex" }}> */}
			<div>
				<div className="movieRibbonV recRibbon">
					{movies.length > 0 && movies.map((movie) =>
						<VerticalMovieRibbonItem key={'"rated_' + movie.movie_id + '"'}
							isLoading={loading}
							movieItem={movie}
							showStarRating={showStarRating}
							infoButton={infoButton}
							allowRemove={allowRemove}
							allowRating={allowRating}
							rateMovieCallback={rateMovieHandler}
							removeItemCallback={removeItemCallback} />
					)}
				</div>
			</div>
		</div>
	)
}