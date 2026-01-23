export type Rating = {
	movieId: number;
	rating: number;
}

export type Movie = {
	movie_id: number;
	imdb_id: number;
	title: string;
	year: number;
	runtime: number;
	genre: string;
	aveRating: number;
	director: string;
	writer: string;
	description: string;
	cast: string;
	poster: string;
	anger: number;
	anticipation: number;
	disgust: number;
	fear: number;
	joy: number;
	sadness: number;
	surprise: number;
	trust: number;
}