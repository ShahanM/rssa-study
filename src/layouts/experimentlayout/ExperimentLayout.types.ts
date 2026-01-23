import { Movie, MovieRating } from "../../widgets/moviegrid/moviegriditem/MovieGridItem.types";

export interface ExperimentLayoutProps {
	condition: number;
	movies: Movie[];
	recommendations: Movie[];
	ratingsCallback: (ratings: MovieRating[]) => void;
}