import React, { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import StarRatings from 'react-star-ratings';
import { imgurl } from '../../api/middleware/utils';
import { MovieDetailsCard } from '../movieDetailsCard';

export default function MovieRibbonItem(props) {

	const [showDetails, setShowDetails] = React.useState(false);
	const [movieItem, setMovieItem] = React.useState(props.movieItem);
	useEffect(() => { setMovieItem(props.movieItem) }, [props.movieItem]);

	const infoButton = props.infoButton || false;
	const allowremove = props.allowRemove || false;
	const allowrating = props.allowRating || false;
	const containerClass = props.containerClass || "";
	const wiggle = props.isLoading || false ? "wiggleItem " : "";

	return (
		<div className="movieRibbonItemWrapper">
			<MovieDetailsCard show={showDetails} closeCallback={() => setShowDetails(false)}
				movieItem={movieItem} />
			<div className={"movieRibbonItem " + wiggle + containerClass} style={{
				backgroundImage: "url(" + imgurl(movieItem.poster_identifier) + "), url(" + imgurl(null) + ")",
				backgroundColor: "rgb(249, 176, 92, 0.6)"
			}}
			// onClick={() => setShowDetails(!showDetails)}
			>
				{allowremove &&
					<div className="removeItem">
						<Button onClick={() => props.removeItemCallback(movieItem.movie_id)}> x </Button>
					</div>
				}
				{
					infoButton && !allowremove &&
					<div className="infoButton">
						<Button onClick={() => setShowDetails(!showDetails)}> i </Button>
					</div>
				}
				<div className="movieRibbonItemLabel" style={{ position: "absolute" }}>
					{movieItem.title + " (" + movieItem.year + ")"}
				</div>
			</div>
			{props.showStarRating ?
				<div className="movieRibbonStars">
					<StarRatings
						rating={props.movieItem.rating}
						starRatedColor="rgb(252,229,65)"
						starHoverColor="rgb(252,229,65)"
						starDimension="18px"
						starSpacing="1px"
						changeRating={props.ratingCallback}
						name={props.movieItem.movie_id.toString()}
						numberOfStars={5} />
				</div>
				: <></>}
		</div>
	);
}

export function RateableMovieRibbonItem(props) {

}