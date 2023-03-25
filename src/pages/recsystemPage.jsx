import React, { useEffect, useRef, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { get, post } from '../middleware/requests';
import MovieGrid from '../widgets/movieGrid';
import MovieRibbonItem from '../widgets/movieRibbonItem';
import { BouncingLoader } from '../widgets/recLoader';

export default function RssaMain() {
	const userid = 1;

	const [ratedMoviesData, setRatedMoviesData] = useState([]);
	const [ratedMovies, setRatedMovies] = useState([]);
	const [recommendedMovies, setRecommendedMovies] = useState([]);
	const [movies, setMovies] = useState([]);
	const [conditionRecommendations, setConditionRecommendations] = useState([]);
	const [rssaCondition, setRssaCondition] = useState(-1);
	const [loading, setLoading] = useState(false);
	const [recLoading, setRecLoading] = useState(false);
	const [conLoading, setConLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	const [ratedMovieCount, setRatedMovieCount] = useState(0);
	const [buttonDisabled, setButtonDisabled] = useState(true);

	const abortRecNRef = useRef();
	const abortCondRef = useRef();

	const itemsPerPage = 16;

	const rateMoviesHandler = (newRating, idstr) => {
		const movieid = parseInt(idstr);
		const isNew = !ratedMoviesData.some(item =>
			item.item_id === movieid);

		let newrefMovies = [...movies];
		let newrefRatedMovies = [...ratedMovies];
		let newrefRatedMoviesData = [...ratedMoviesData];

		let updatedmovie = newrefMovies.find(item => item.movie_id === movieid);
		updatedmovie.rating = newRating;
		if (isNew) {
			let updatevisited = [...ratedMoviesData, { item_id: movieid, rating: newRating }];
			let updaterated = [...ratedMovies, updatedmovie];
			setRatedMovies(updaterated);
			setRatedMoviesData(updatevisited);
			setRatedMovieCount(updatevisited.length);
			setButtonDisabled(updatevisited.length < 10);
		} else {
			let updatevisited = newrefRatedMoviesData.find(item => item.item_id === movieid);
			updatevisited.rating = newRating;

			let updaterated = newrefRatedMovies.find(item => item.movie_id === movieid);
			updaterated.rating = newRating;
			setRatedMovies(newrefRatedMovies);
			setRatedMoviesData(newrefRatedMoviesData);
		}
		setMovies(newrefMovies);
	}

	const fetchMovies = async () => {
		const limit = itemsPerPage * 2;
		const offset = (currentPage - 1) * limit;
		get('movies/?skip=' + offset + '&limit=' + limit)
			.then((response): Promise<movie[]> => response.json())
			.then((newmovies: movie[]) => { setMovies([...movies, ...newmovies]); })
			.catch((error) => console.log(error));
	}

	useEffect(() => {
		fetchMovies();
	}, []);

	useEffect(() => {

		const getRecommendations = async (recType, signal) => {
			recType === 0 ? setRecLoading(true) : setConLoading(true);
			setLoading(true);
			if (ratedMoviesData.length > 0) {
				return post('recommendation/', signal, {
					ratings: ratedMoviesData,
					user_id: userid,
					user_condition: recType,
					rec_type: recType,
					num_rec: 10
				})
			}
		}

		const onError = (error) => {
			// console.log(error);
			// setLoading(false);
			// setRecLoading(false);
			// setConLoading(false);
		}

		if (ratedMoviesData.length > 0) {
			if (abortRecNRef.current) { abortRecNRef.current.abort(); }
			abortRecNRef.current = new AbortController();
			getRecommendations(0, abortRecNRef.current.signal)
				.then((response): Promise<movie[]> => response.json())
				.then((movies: movie[]) => {
					setRecommendedMovies([...movies]);
					setRecLoading(false);
				})
				.catch((error) => { onError(error); });

			if (rssaCondition > 0) {
				if (abortCondRef.current) { abortCondRef.current.abort(); }
				abortCondRef.current = new AbortController();
				getRecommendations(rssaCondition, abortCondRef.current.signal)
					.then((response): Promise<movie[]> => response.json())
					.then((movies: movie[]) => {
						setConditionRecommendations([...movies]);
						setConLoading(false);
					})
					.catch((error) => { onError(error); });
			}
		} else {
			setLoading(false);
		}
		setLoading(false);

		return () => {
			if (abortRecNRef.current) { abortRecNRef.current.abort(); }
			if (abortCondRef.current) { abortCondRef.current.abort(); }
		}
	}, [ratedMoviesData, rssaCondition]);

	const removeMovieHandler = (movieId) => {
		const newratedmovies = ratedMovies.filter(movie => movie.movie_id !== movieId);
		const newratedmoviesdata = ratedMoviesData.filter(movie => movie.item_id !== movieId);
		if (newratedmoviesdata.length === 0) {
			setRecommendedMovies([]);
			setConditionRecommendations([]);
		}
		setRatedMovies(newratedmovies);
		setRatedMoviesData(newratedmoviesdata);
		let tempmovies = [...movies];
		let updatedMovie = tempmovies.find(movie => movie.movie_id === movieId);
		updatedMovie.rating = 0;
		setMovies(tempmovies);
	}

	const updateCurrentPage = (page) => {
		setCurrentPage(page);
	}

	return (
		<Container>
			<Row>
				<Col md={5} className="viewport">
					<MovieGrid ratingCallback={rateMoviesHandler} userid={userid} movies={movies}
						pagingCallback={updateCurrentPage} itemsPerPage={itemsPerPage} dataCallback={fetchMovies} />
				</Col>
				<Col md={7}>
					<div className="sidePanel">
						<h5>Movies You Rated</h5>
						<div className="movieRibbon">
							{ratedMovies.length > 0 && ratedMovies.map((movie) =>
								<MovieRibbonItem key={'"rated_' + movie.movie_id + '"'}
									isLoading={false}
									movieItem={movie} showStarRating={false} allowRemove={true}
									removeItemCallback={removeMovieHandler} />)}
						</div>
					</div>
					<div className="sidePanel">
						<Row>
							<Col>
								<h5>Movies you think we will like</h5>
							</Col>
						</Row>
						<Row>
							<div className="movieRibbon recRibbon">
								{
									loading && recommendedMovies === 0 && <BouncingLoader key={"topNrecommendationLoader"} text="Loading..." />
								}
								{recommendedMovies.length > 0 ? recommendedMovies.map((movie) =>
									<MovieRibbonItem key={'"rec_' + movie.movie_id + '"'}
										isLoading={recLoading} ratingCallback={rateMoviesHandler}
										movieItem={movie} showStarRating={false} containerClass="recItem" />)
									:
									<div className="ribbonButtonDiv">
										<p>
											Please rate movies on the left to get recommendations.
										</p>
									</div>
								}
							</div>
						</Row>
						<Row>
							<Col>
								<h5>These are movies that </h5>
							</Col>
						</Row>
						<Row>
							<Form.Group>
								<Form.Select className="panelOption" variant="outline-secondary"
									title="Dropdown" id="input-group-dropdown" disabled={loading || ratedMovies.length === 0}
									onChange={(evt) => setRssaCondition(evt.target.value)} value={rssaCondition}>
									<option value="-1">Please choose an option</option>
									<option value="1">we think are controversial.</option>
									<option value="2">we think you will hate.</option>
									<option value="3">we think you will be the first to try.</option>
									<option value="4">we have no idea about.</option>
								</Form.Select>
							</Form.Group>
							<div className="movieRibbon recRibbon">
								{
									conLoading &&
									conditionRecommendations.length === 0 &&
									<BouncingLoader key={"conditionRecLoader"} text="Loading..." />
								}
								{conditionRecommendations.length > 0 && conditionRecommendations.map((movie) =>
									<MovieRibbonItem key={'"recex_' + movie.movie_id + '"'}
										isLoading={conLoading} ratingCallback={rateMoviesHandler}
										movieItem={movie} showStarRating={false} containerClass="recItem" />)}
							</div>
						</Row>
					</div>
				</Col>
			</Row>
		</Container>
	);
}
