import { StudyLayoutOneProps } from "./StudyLayoutOne.types";
// import MovieGallery from "../../../widgets/moviegallery/MovieGallery";
import { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import { useStudy } from "rssa-api";
import { MovieRating } from "../../../widgets/moviegrid/moviegriditem/MovieGridItem.types";
import HorizontalRibbon from "../../../widgets/movieribbon/MovieRibbon";


const StudyLayoutOne: React.FC<StudyLayoutOneProps> = ({
	
}) => {
	/**
	 * This is the layout for the first study condition.
	 * Randomized navigable gallery with 28 (7 x 4) movies per page. x1
	 * TopN movie gallery with fix 7 (7 x 1) movies. x1
	 * 
	 */

	const { studyApi } = useStudy();

	const itemsPerPage = 28;
	const [movieIds, setMovieIds] = useState<string[]>([]);
	const [ratedMovies, setRatedMovies] = useState<MovieRating[]>([]);


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

	return (
		<>
			<Col>
				{/* 
					FIXME: We should deal with movie ids only for the random gallery 
					and let the gallery fetch the details.
				*/}
				{/* <MovieGallery movies={[]} rows={7} cols={4} navigation={true} /> */}
				{/* <MovieGrid
						dataCallback={setRatedMovies}
						movieIds={movieIds}
						itemsPerPage={itemsPerPage} /> */}
				{/* <HorizontalRibbon rows={7} cols={4} header={"Random"} /> */}
			</Col>
			<Col>
				{/*
				FIXME: It might be better to provide the gallery with the rated movies
				and let the gallery fetch the respective recommendations.
			 */}
				{/* <MovieGallery movies={[]} rows={7} cols={1} navigation={false} /> */}
				{/* <HorizontalRibbon rows={7} cols={1} header={"TopN"} /> */}
			</Col>
		</>
	)
}

export default StudyLayoutOne;