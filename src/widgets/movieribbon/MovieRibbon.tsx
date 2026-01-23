import { Container } from "react-bootstrap";
import "./MovieRibbon.css";
import RibbonItem from "./ribbonitem/RibbonItem";
import { Movie } from "../moviegrid/moviegriditem/MovieGridItem.types";


export interface MovieRibbonProps {
	rows: number;
	cols: number;
	header: string;
	movies: Movie[];
}

const HorizontalRibbon: React.FC<MovieRibbonProps> = ({
	rows,
	cols,
	header,
	movies
}) => {

	if (rows < 1 || cols < 1) {
		throw new Error("Invalid rows or cols value");
	}

	if (movies.length < rows * cols) {
		console.log(movies.length);
		throw new Error("Not enough movies to fill the ribbon");
	}

	return (
		<Container>
			<h1>{header}</h1>
			{
				Array.from({ length: rows }).map((_, i) => {
					return (
						<div key={i} className="ribbon-row">
							{Array.from({ length: cols }).map((_, j) => {
								return (
									// <div key={j} className="ribbon-item">
									// 	<div className="ribbon-item-image">cs</div>
									// 	<div className="ribbon-item-title"></div>
									<RibbonItem key={`ribbon-item-${j}`}
										movie={movies[i*cols + j]}/>
									// </div>
								)
							})}
						</div>
					)
				})
			}
		</Container>
	)
}

export default HorizontalRibbon;