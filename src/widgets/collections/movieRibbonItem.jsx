import React, { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import StarRatings from 'react-star-ratings';
import { imgurl } from '../../api/middleware/utils';
import { MovieDetailsCard } from '../movieDetailsCard';

export function HorizontalMovieRibbonItem(props) {

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
						rating={movieItem.rating}
						starRatedColor="rgb(252,229,65)"
						starHoverColor="rgb(252,229,65)"
						starDimension="18px"
						starSpacing="1px"
						changeRating={props.ratingCallback}
						name={movieItem.movie_id.toString()}
						numberOfStars={5} />
				</div>
				: <></>}
		</div>
	);
}

export function RateableMovieRibbonItem(props) {

}

function RibbonItemFooterNavigation(props) {

	const [showRating, setShowRating] = React.useState(false);
	const [movieItem, setMovieItem] = React.useState(props.movieItem);
	useEffect(() => { setMovieItem(props.movieItem) }, [props.movieItem]);

	return (
		<div className="ribbonItemFooter">
			{showRating ?
				<StarRatings
					rating={movieItem.rating}
					starRatedColor="rgb(245, 102, 0)"
					starHoverColor="rgb(245, 102, 0)"
					starDimension="27px"
					starSpacing="3px"
					changeRating={props.ratingCallback}
					name={movieItem.movie_id.toString()}
					numberOfStars={5} />
				:
				<>
					<Button onClick={() => { setShowRating(true) }} variant="ers"
						style={{ width: "180px", height: "27px", padding: "inherit" }}>
						{/* <p> */}
						I watched it
						{/* </p> */}
					</Button>
					{/* <Button onClick={() => { }} variant="outline-light">
						New to me
					</Button> */}
				</>
			}
		</div >
	)
}


export function VerticalMovieRibbonItem(props) {

	const [showDetails, setShowDetails] = React.useState(false);
	const [movieItem, setMovieItem] = React.useState(props.movieItem);
	const [displayTitle, setDisplayTitle] = React.useState(props.movieItem.title);
	useEffect(() => {
		setMovieItem(props.movieItem);
		setDisplayTitle(prepDisplayTitle(props.movieItem.title));
	}, [props.movieItem]);

	const prepDisplayTitle = (titleString) => {
		if (titleString.length > 20) {
			return titleString.substring(0, 20) + "...";
		}
		return titleString;
	}

	const infoButton = props.infoButton || false;
	const allowremove = props.allowRemove || false;

	return (
		<div className="movieRibbonItemWrapper" style={{ display: "flex", backgroundColor: "rgb(0, 0, 0, 0.)" }}>
			{/* <div style={{ position: "relative" }}> */}
			<div>

				<MovieDetailsCard show={showDetails} closeCallback={() => setShowDetails(false)}
					movieItem={movieItem} />
				{/* <div style={{ backgroundColor: "rgb(0, 0, 0, 0.9)", width: "72px", height: "99px", marginTop: "3px" }}> */}
				<div style={{ backgroundColor: "rgb(0, 0, 0, 0.9)", width: "72px", height: "99px", marginTop: "3px" }}>
					{infoButton && !allowremove ?
						<img style={{ maxHeight: "96px", maxWidth: "70px", margin: "auto", cursor: "pointer" }}
							src={imgurl(movieItem.poster_identifier)} alt={movieItem.title}
							onClick={() => setShowDetails(!showDetails)} />
						:
						<img style={{ maxHeight: "97px", maxWidth: "70px", margin: "auto" }}
							src={imgurl(movieItem.poster_identifier)} alt={movieItem.title} />
					}
					{allowremove &&
						<div className="removeItem">
							<Button variant="ers" onClick={() => props.removeItemCallback(movieItem.movie_id)}> x </Button>
						</div>
					}
					{/* {
						infoButton && !allowremove &&
						<div className="infoButton">
							<Button onClick={() => setShowDetails(!showDetails)}> i </Button>
						</div>
					} */}
				</div>
			</div>

			<div className="ribbonItem-rating">
				<h6 style={{ color: "white", overflowX: "hidden" }}>
					{displayTitle}
				</h6>
				<h6 style={{ color: "white", overflowX: "hidden" }}>
					{"(" + movieItem.year + ")"}
				</h6>
				<RibbonItemFooterNavigation movieItem={movieItem}
					ratingCallback={props.rateMovieCallback} />
				{/* {props.showStarRating ?
					<StarRatings
						rating={movieItem.rating}
						starRatedColor="rgb(252,229,65)"
						starHoverColor="rgb(252,229,65)"
						starDimension="27px"
						starSpacing="2px"
						changeRating={props.rateMovieCallback}
						name={movieItem.movie_id.toString()}
						numberOfStars={5} />
					: <></>} */}
			</div>
		</div>
	);
}