import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useLocation, useNavigate } from 'react-router-dom';
import { cancellablePost, get } from '../../api/middleware/requests';
import { getFirstStepPage, getNextStudyStep } from '../../api/studyapi';
import '../../widgets/collections/collections.css';
import MovieGrid from '../../widgets/collections/movieGrid';
import { HorizontalMovieRibbon, VerticalMovieRibbon } from '../../widgets/collections/movieRibbon';
import HeaderJumbotron from '../../widgets/headerJumbotron';
import { BouncingLoader } from '../../widgets/loaders/recLoader';
import NextButton from '../../widgets/nextButton';
import './recsystemPage.css';
import ExperimentLayout from '../../layouts/experimentlayout/ExperimentLayout';
import { StudyPageProps } from '../StudyPage.types';
import { useStudy } from 'rssa-api';
import { MovieRating as ApiMovieRating, CurrentStep, PageContent, StudyStep } from 'rssa-api/dist/types/RssaTypes.types';
import { Movie, MovieRating } from "../../widgets/moviegrid/moviegriditem/MovieGridItem.types";
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { userInfo } from 'os';

const RSSA_CONDITIONS = {
	0: "we think you will like.",
	1: "we think are controversial to your preference.",
	2: "we think you will hate.",
	3: "we think you will be the first to try.",
	4: "we have no idea about."
}

const STUDY_CONDITIONS = {
	1: "28 random + 7 topN",
	2: "21 random + 7 topN + 7 topN",
	3: "21 random + 7 topN + 7 controversial",
	4: "21 random + 7 topN + 7 first to try",
	5: "21 random + 7 topN + 7 no idea",
	6: "21 random + 7 topN + 7 hate",
	7: "7 controversial + 7 first to try + 7 no idea + 7 hate + 7 topN",
}

const STUDY_CONDITIONS_MAP = new Map<string, number>([
	["f865835f-fd3d-48a5-bdd1-3aad793c45cd", 1]
]);

type RecRatingRequestObject = {
	user_id: string;
	user_condition: string;
	ratings: ApiMovieRating[];
	rec_type: number;
	num_rec: number;
}


const RssaMain: React.FC<StudyPageProps> = ({
	next,
	checkpointUrl,
	participant,
	studyStep,
	updateCallback,
	sizeWarning
}) => {

	const { studyApi } = useStudy();
	const navigate = useNavigate();
	const location = useLocation();

	// We are grabbing the rated movies from the preference elicitation step
	const stateData = location.state as any;
	const ratedMovies = useRef<Map<number, MovieRating>>(stateData?.ratedMovies || new Map<number, MovieRating>());
	const [movieIds, setMovieIds] = useState<string[]>([]);

	console.log("RSSA ratedMovies", ratedMovies.current);

	const [isUpdated, setIsUpdated] = useState<boolean>(false);
	const [pageContent, setPageContent] = useState<PageContent>();
	const [loading, setLoading] = useState<boolean>(false);

	const [nextButtonDisabled, setNextButtonDisabled] = useState<boolean>(true);
	const [dataSubmitted, setDataSubmitted] = useState<boolean>(false);
	const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

	// const userdata = useLocation().state.user;
	// const stepid = useLocation().state.studyStep;
	// const _ratings = useLocation().state.ratings;
	// const _recommendations = useLocation().state.recommendations;
	// const bootstrap = {
	// 	ratings: useLocation().state.ratings,
	// 	recommendations: useLocation().state.recommendations
	// }
	// const navigate = useNavigate();

	// const [studyStep, setStudyStep] = useState({});
	// const [pageData, setPageData] = useState({});

	// const [ratedMoviesData, setRatedMoviesData] = useState([]);
	// const [ratedMovies, setRatedMovies] = useState([]);
	// useEffect(() => { setRatedMoviesData(_ratings) }, [_ratings]);
	// const [recommendedMovies, setRecommendedMovies] = useState([]);
	// useEffect(() => { setRecommendedMovies(_recommendations) }, [_recommendations]);
	// const [movies, setMovies] = useState([]);
	const [conditionRecommendationIds, setConditionRecommendationIds] = useState([]);
	const [rssaCondition, setRssaCondition] = useState(-1);
	// const [loading, setLoading] = useState(false);
	const [recLoading, setRecLoading] = useState(false);
	const [conLoading, setConLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	const [ratedMovieCount, setRatedMovieCount] = useState(0);
	const [buttonDisabled, setButtonDisabled] = useState(true);

	const abortRecNRef = useRef();
	const abortCondRef = useRef();

	const itemsPerPage = 16;


	const handleNextBtn = useCallback(() => {
		studyApi.post<CurrentStep, StudyStep>('studystep/next', {
			current_step_id: participant.current_step
		}).then((nextStep: StudyStep) => {
			updateCallback(nextStep, next)
			setIsUpdated(true);
		});
	}, [studyApi, participant, updateCallback, next])

	// const rateMoviesHandler = (newRating, idstr, isRec) => {
	// 	const movieid = parseInt(idstr);
	// 	const isNew = !ratedMoviesData.some(item =>
	// 		item.item_id === movieid);

	// 	let newrefMovies = [];
	// 	if (isRec !== undefined && isRec) {
	// 		newrefMovies = [...recommendedMovies];
	// 	} else {
	// 		newrefMovies = [...movies];
	// 	}
	// 	let newrefRatedMovies = [...ratedMovies];
	// 	let newrefRatedMoviesData = [...ratedMoviesData];

	// 	let updatedmovie = newrefMovies.find(item => item.movie_id === movieid);
	// 	// FIXME also update movies if the movie exists in the movies array
	// 	updatedmovie.rating = newRating;
	// 	if (isNew) {
	// 		let updatevisited = [...ratedMoviesData, { item_id: movieid, rating: newRating }];
	// 		let updaterated = [...ratedMovies, updatedmovie];
	// 		setRatedMovies(updaterated);
	// 		setRatedMoviesData(updatevisited);
	// 		// setRatedMovieCount(updatevisited.length);
	// 		setButtonDisabled(updatevisited.length < 10);
	// 	} else {
	// 		let updatevisited = newrefRatedMoviesData.find(item => item.item_id === movieid);
	// 		updatevisited.rating = newRating;

	// 		let updaterated = newrefRatedMovies.find(item => item.movie_id === movieid);
	// 		updaterated.rating = newRating;
	// 		setRatedMovies(newrefRatedMovies);
	// 		setRatedMoviesData(newrefRatedMoviesData);
	// 	}
	// 	if (isRec === undefined || !isRec) {
	// 		setMovies(newrefMovies);
	// 	}
	// }

	// const fetchMovies = async () => {
	// 	const limit = itemsPerPage * 2;
	// 	const offset = (currentPage - 1) * limit;
	// 	get('movies/?skip=' + offset + '&limit=' + limit)
	// 		.then((response): Promise<movie[]> => response.json())
	// 		.then((newmovies: movie[]) => {
	// 			setMovies([...movies, ...newmovies]);
	// 		})
	// 		.catch((error) => console.log(error));
	// }

	// useEffect(() => {
	// 	getNextStudyStep(userdata.study_id, stepid)
	// 		.then((step: studyStep) => { setStudyStep(step) })
	// 	fetchMovies();
	// }, []);

	// useEffect(() => {
	// 	if (Object.keys(studyStep).length > 0) {
	// 		getFirstStepPage(studyStep)
	// 			.then((page: studyPage) => { setPageData(page) })
	// 	}
	// }, [studyStep]);


	useEffect(() => {
		const getAllMovieIds = async () => {
			return studyApi.get<string[]>('movie/ids/ers')
				.then((newmovies: string[]) => {
					localStorage.setItem('allMovieIds', JSON.stringify(newmovies));
					setMovieIds(newmovies);
				})
				.catch((error: any) => {
					console.log(error);
					return [];
				});
		}

		if (localStorage.getItem('allMovieIds')) {
			const allmovieIds = JSON.parse(localStorage.getItem('allMovieIds') || '[]');
			setMovieIds(allmovieIds);
		} else {
			getAllMovieIds();
		}
	}, [studyApi]);

	// Fetch the recommendations from the server
	// FIXME: abstract this into the studyApi
	useEffect(() => {
		const getRecommendations = async () => {
			setLoading(true);
			const requestObj = {
				user_id: participant.id,
				user_condition: participant.condition_id,
				ratings: [...ratedMovies.current.values()].map(rating => {
					return {
						movie_id: rating.movielens_id,
						rating: rating.rating
					}
				})
			}
			console.log("PreferenceVisualization getRecommendations", requestObj, participant);
			studyApi.post<RecRatingRequestObject, Movie[]>("recommendation/", {
				user_id: participant.id,
				user_condition: participant.condition_id,
				ratings: [...ratedMovies.current.values()].map(rating => {
					return {
						item_id: rating.movielens_id,
						rating: rating.rating
					}
				}),
				rec_type: 0,
				num_rec: 7
			}).then((responseItems: Movie[]) => {
				console.log("PreferenceVisualization newstuff", responseItems);
				let itemMap = new Map<string, Movie>();
				for (let item of responseItems) {
					itemMap.set(item.id, item);
				}
				setConditionRecommendationIds(itemMap);
				setLoading(false);
			}).catch((err: any) => {
				console.log("VisualizationLayout Error", err);
			});
		}

		if (movies.size === 0 && participant.id !== '' && participant.condition_id !== '') {
			getRecommendations();
		}

	}, [ratedMovies, movies, studyApi, participant]);


	// useEffect(() => {
	// 	const getRecommendations = async (recType, signal) => {
	// 		recType === 0 ? setRecLoading(true) : setConLoading(true);
	// 		setLoading(true);
	// 		if (ratedMoviesData.length > 0) {
	// 			return cancellablePost('recommendation/', signal, {
	// 				ratings: ratedMoviesData,
	// 				user_id: userdata.id,
	// 				user_condition: recType,
	// 				rec_type: recType,
	// 				num_rec: 7
	// 			}, userdata)
	// 		}
	// 	}

	// 	const onError = (error) => {
	// 		// console.log(error);
	// 		// setLoading(false);
	// 		// setRecLoading(false);
	// 		// setConLoading(false);
	// 	}

	// 	if (ratedMoviesData.length > 9) {
	// 		if (abortRecNRef.current) { abortRecNRef.current.abort(); }
	// 		abortRecNRef.current = new AbortController();
	// 		getRecommendations(0, abortRecNRef.current.signal)
	// 			.then((response): Promise<movie[]> => response.json())
	// 			.then((movies: movie[]) => {
	// 				setRecommendedMovies([...movies]);
	// 				setRecLoading(false);
	// 			})
	// 			.catch((error) => { onError(error); });

	// 		if (rssaCondition > 0) {
	// 			if (abortCondRef.current) { abortCondRef.current.abort(); }
	// 			abortCondRef.current = new AbortController();
	// 			getRecommendations(rssaCondition, abortCondRef.current.signal)
	// 				.then((response): Promise<movie[]> => response.json())
	// 				.then((movies: movie[]) => {
	// 					setConditionRecommendations([...movies]);
	// 					setConLoading(false);
	// 				})
	// 				.catch((error) => { onError(error); });
	// 		}
	// 	} else {
	// 		setRecommendedMovies([]);
	// 		setConditionRecommendations([]);
	// 	}
	// 	setLoading(false);

	// 	return () => {
	// 		if (abortRecNRef.current) { abortRecNRef.current.abort(); }
	// 		if (abortCondRef.current) { abortCondRef.current.abort(); }
	// 	}
	// }, [ratedMoviesData, rssaCondition, userdata]);

	// const removeMovieHandler = (movieId) => {
	// 	const newratedmovies = ratedMovies.filter(movie => movie.movie_id !== movieId);
	// 	const newratedmoviesdata = ratedMoviesData.filter(movie => movie.item_id !== movieId);
	// 	if (newratedmoviesdata.length === 0) {
	// 		setRecommendedMovies([]);
	// 		setConditionRecommendations([]);
	// 	}
	// 	setRatedMovies(newratedmovies);
	// 	setRatedMoviesData(newratedmoviesdata);
	// 	let tempmovies = [...movies];
	// 	let updatedMovie = tempmovies.find(movie => movie.movie_id === movieId);
	// 	updatedMovie.rating = 0;
	// 	setMovies(tempmovies);
	// }

	// const watchedMovieHandler = (movieId) => {
	// 	console.log('watched', movieId);
	// }

	// const watchListHandler = (movieId, addremove) => {
	// 	console.log('watchlist', movieId, addremove);
	// }

	// const updateCurrentPage = (page) => {
	// 	setCurrentPage(page);
	// }

	const getExperimentLayout = useMemo(() => {
		const condition = STUDY_CONDITIONS_MAP.get(participant.condition_id);
		if (condition) return condition;
		return 1;
	}, [participant.condition_id]);

	return (
		<Container>
			<Row>
				<Header title={studyStep?.name}
					content={studyStep?.description} />
				{/* <HeaderJumbotron title={pageData.page_name} content={pageData.page_instruction} /> */}
			</Row >
			<Row>
				<Form.Group>
					{/* <Form.Select className="panelOption"
						variant="outline-secondary"
						title="Dropdown" id="input-group-dropdown"
						disabled={loading}
						onChange={(evt) => setRssaCondition(evt.target.value)}
						value={rssaCondition}>
						<option value="-1">Please choose a study condition</option>
						{Object.keys(STUDY_CONDITIONS).map((key) =>
							<option key={key} value={key}>{STUDY_CONDITIONS[key]}</option>
						)}
					</Form.Select> */}
				</Form.Group>
			</Row>
			<Row style={{ position: "relative", minHeight: "900px" }}>
				<ExperimentLayout
					condition={getExperimentLayout}
					movies={[...movies.values()]}
					recommendations={conditionRecommendations}
					ratingsCallback={() => { }}
				/>
				{/* {recLoading || conLoading ? <BouncingLoader text="Loading..." />
					: <ExperimentLayout condition={parseInt(rssaCondition)} />} */}

				{/* <Col className="viewport" xs={{ span: 5 }}>
					<MovieGrid ratingCallback={rateMoviesHandler}
						gridType="study-condition"
						userid={userdata.id} movies={movies}
						pagingCallback={updateCurrentPage}
						itemsPerPage={itemsPerPage}
						dataCallback={fetchMovies} />
				</Col>
				<Col style={{ display: "flex", position: "relative", marginRight: "-18px" }} >
				<Col className="sidePanel">
						<h5>Movies we think you will like</h5>
						<VerticalMovieRibbon
							customKey="topN_recommendations"
							ratingCallback={rateMoviesHandler}
							movies={recommendedMovies}
							showStarRating={true}
							allowRating={true}
							loading={recLoading}
							infoButton={true}
							watchedMovieCallback={watchedMovieHandler}
							watchListCallback={watchListHandler}/>
					</Col>
					<Col className="sidePanel">
						<h5>Movies we think you will like</h5>
						<VerticalMovieRibbon
							customKey="topN_recommendations"
							ratingCallback={rateMoviesHandler}
							movies={recommendedMovies}
							showStarRating={true}
							allowRating={true}
							loading={recLoading}
							infoButton={true} />
					</Col>
					<Col className="sidePanel">
						<h5>Movies we think you will like</h5>
						<VerticalMovieRibbon
							customKey="topN_recommendations"
							ratingCallback={rateMoviesHandler}
							movies={recommendedMovies}
							showStarRating={true}
							allowRating={true}
							loading={recLoading}
							infoButton={true} />
					</Col>
					<Col className="sidePanel">
						<h5>Movies we think you will like</h5>
						<VerticalMovieRibbon
							customKey="topN_recommendations"
							ratingCallback={rateMoviesHandler}
							movies={recommendedMovies}
							showStarRating={true}
							allowRating={true}
							loading={recLoading}
							infoButton={true} />
					</Col>
					<Col className="sidePanel">
						<h5>These are the movies <span>{RSSA_CONDITIONS[rssaCondition]}</span></h5>
						<VerticalMovieRibbon
							customKey="condition_recommendations"
							ratingCallback={rateMoviesHandler}
							movies={conditionRecommendations}
							showStarRating={true}
							allowRating={true}
							loading={conLoading}
							infoButton={true} />
					</Col>
				</Col> */}
			</Row>
			<Row>
				{/* <div className="bottomPanel">
					<h5>Movies You Rated</h5>
					<HorizontalMovieRibbon customKey="rating_history"
						ratingCallback={rateMoviesHandler}
						movies={ratedMovies}
						loading={false}
						showStarRating={true}
						allowRemove={true}
						autoScroll={'right'}
						removeItemCallback={removeMovieHandler} />
				</div> */}
			</Row>
			<Row>
				<Footer callback={dataSubmitted ? handleNextBtn
					: () => setShowConfirmation(true)}
					disabled={nextButtonDisabled}
					text={!dataSubmitted ? "Submit" : "Next"}
				/>
			</Row>
		</Container>
	);
}


export default RssaMain;