
export const imgurl = (identifier) => {
	if (identifier === undefined || identifier === null) {
		return 'https://rssa.recsys.dev/movie/poster/default_movie_icon.svg';
	}
	return 'https://rssa.recsys.dev/movie/poster/' + identifier;
}