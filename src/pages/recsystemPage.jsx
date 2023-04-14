import React, { useEffect, useRef, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useLocation, useNavigate } from 'react-router-dom';
import { cancellablePost, get } from '../api/middleware/requests';
import { getFirstStepPage, getNextStudyStep } from '../api/studyapi';
import MovieGrid from '../widgets/collections/movieGrid';
import { MovieRibbon } from '../widgets/collections/movieRibbon';
import HeaderJumbotron from '../widgets/headerJumbotron';
import NextButton from '../widgets/nextButton';

export default function RssaMain() {
	// const userid = 1;


	const userdata = useLocation().state.user;
	const stepid = useLocation().state.studyStep;
	const navigate = useNavigate();

	const [studyStep, setStudyStep] = useState({});
	const [pageData, setPageData] = useState({});

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
			// console.log(updatevisited);
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
		getNextStudyStep(userdata.study_id, stepid)
			.then((step: studyStep) => { setStudyStep(step) })
		fetchMovies();
	}, []);

	useEffect(() => {
		if (Object.keys(studyStep).length > 0) {
			getFirstStepPage(studyStep)
				.then((page: studyPage) => { setPageData(page) })
		}
	}, [studyStep]);


	useEffect(() => {
		const getRecommendations = async (recType, signal) => {
			recType === 0 ? setRecLoading(true) : setConLoading(true);
			setLoading(true);
			if (ratedMoviesData.length > 0) {
				return cancellablePost('recommendation/', signal, {
					ratings: ratedMoviesData,
					user_id: userdata.id,
					user_condition: recType,
					rec_type: recType,
					num_rec: 10
				}, userdata)
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
	}, [ratedMoviesData, rssaCondition, userdata]);

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
				<HeaderJumbotron title={pageData.page_name} content={pageData.page_instruction} />
			</Row >
			<Row>
				<Col className="viewport">
					<MovieGrid ratingCallback={rateMoviesHandler}
						userid={userdata.id} movies={movies}
						pagingCallback={updateCurrentPage}
						itemsPerPage={itemsPerPage}
						dataCallback={fetchMovies} />
				</Col>
				<Col>
					<div className="sidePanel">
						<h5>Movies You Rated</h5>
						<MovieRibbon customKey="rating_history"
							ratingCallback={rateMoviesHandler}
							movies={ratedMovies}
							loading={false}
							showStarRating={true}
							allowRemove={true}
							autoScroll={'right'}
							removeItemCallback={removeMovieHandler} />
					</div>
					<div className="sidePanel">
						<h5>Movies you think we will like</h5>
						<MovieRibbon customKey="topN_recommendations"
							ratingCallback={rateMoviesHandler}
							movies={recommendedMovies}
							loading={recLoading}
							autoScroll={'left'}
							infoButton={true} />
					</div>
					<div className="sidePanel">
						<h5>These are movies that </h5>
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
						<MovieRibbon customKey="condition_recommendations"
							ratingCallback={rateMoviesHandler}
							movies={conditionRecommendations}
							loading={conLoading}
							infoButton={true} />
					</div>
				</Col>
			</Row>
			<Row>
				<div className="jumbotron jumbotron-footer" style={{ display: "flex" }}>
					{/* <RankHolder count={ratedMovieCount} /> */}
					<NextButton disabled={buttonDisabled && !loading}
						loading={loading} onClick={() => { }} />
				</div>
			</Row>
		</Container>
	);
}
