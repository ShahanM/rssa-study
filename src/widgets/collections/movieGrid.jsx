import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import MovieGridItem from './movieGridItem';


export default function MovieGrid(props) {
	const [currentPage, setCurrentPage] = useState(1);
	const [movies, setMovies] = useState(props.movies);
	useEffect(() => { setMovies(props.movies) }, [props.movies]);

	const renderPrev = () => {
		if (currentPage > 1) {
			if (props.pagingCallback) {
				props.pagingCallback(currentPage - 1);
			}
			setCurrentPage(currentPage - 1);
		}
	}

	const renderNext = () => {
		if (currentPage % 2 === 0) {
			props.dataCallback();
		}
		if (props.pagingCallback) {
			props.pagingCallback(currentPage + 1);
		}
		setCurrentPage(currentPage + 1);
	}

	return (
		<Container className="gallery">
			<Row>
				<Col md={12}>
					{(currentPage * props.itemsPerPage <= movies.length) ?
						<div className="grid-container">
							{movies.slice((currentPage - 1) * props.itemsPerPage,
								currentPage * props.itemsPerPage).map(currentMovie => (
									<MovieGridItem key={"TN_" + currentMovie.id} movieItem={currentMovie}
										handleRating={props.ratingCallback} />
								))}
						</div>
						: <div style={{ minWidth: "585px", minHeight: "656px" }}>
							<Spinner animation="border" role="status" style={{ margin: "18% 50%", width: "54px", height: "54px" }} />
						</div>
					}
				</Col>
			</Row>
			<Row>
				<Col md={3}>
					<div className="btnDiv">
						<Button id="gallery-left-btn" disabled={currentPage === 1} variant="primary" onClick={renderPrev}>
							&lt;
						</Button>
					</div>
				</Col>
				<Col md={{ span: 3, offset: 3 }}>
					<div className="btnDiv">
						<Button id="gallery-right-btn" variant="primary" onClick={renderNext}>
							&gt;
						</Button>
					</div>
				</Col>
			</Row>
		</Container>
	);
}