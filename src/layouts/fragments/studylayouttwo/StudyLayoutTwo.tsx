import { StudyLayoutTwoProps } from "./StudyLayoutTwo.types";
import MovieGrid from "../../../widgets/moviegrid/MovieGrid";
import { Col } from "react-bootstrap";
import { useState } from "react";
import { MovieRating } from "../../../widgets/moviegrid/moviegriditem/MovieGridItem.types";


const StudyConditionTwo: React.FC<StudyLayoutTwoProps> = () => {
	/**
	 * This is the layout for study condition two, three, four, five, and six.
	 * Randomized navigable gallery with 21 (7 x 3) movies per page. x1
	 * TopN movie gallery with fix 7 (7 x 1) movies. x1
	 * One of the following:
	 *  - Additional TopN movie gallery with fix 7 (7 x 1) movies. x1
	 *  - Controversial movie gallery with fix 7 (7 x 1) movies. x1
	 *  - First to try movie gallery with fix 7 (7 x 1) movies. x1
	 *  - No idea movie gallery with fix 7 (7 x 1) movies. x1
	 *  - Hate movie gallery with fix 7 (7 x 1) movies. x1
	 */
	const itemsPerPage = 21;
	const [movieIds, setMovieIds] = useState<string[]>([]);
	const [ratedMovies, setRatedMovies] = useState<MovieRating[]>([]);


	return (
		<>
			<Col>
			<MovieGrid
						dataCallback={setRatedMovies}
						movieIds={movieIds}
						itemsPerPage={itemsPerPage} />
			</Col>
			<Col>
			</Col>
			<Col>
			</Col>
		</>
	)
}

export default StudyConditionTwo;