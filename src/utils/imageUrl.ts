export const imgurl = (identifier?: string | null) => {
    if (!identifier) {
        return 'https://rssa.recsys.dev/movie/poster/default_movie_icon.svg';
    }
    return 'https://rssa.recsys.dev/movie/poster/' + identifier;
};
