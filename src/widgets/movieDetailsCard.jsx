import DOMPurify from "dompurify";
import parse from "html-react-parser";
import React, { useEffect, useState } from "react";
import { Button, Col, Image, Modal, Row } from "react-bootstrap";


export const MovieDetailsCard = (props) => {

	const [movieItem, setMovieItem] = useState(props.movieItem);
	useEffect(() => { setMovieItem(props.movieItem) }, [props.movieItem]);
	const [show, setShow] = useState(false);
	useEffect(() => { setShow(props.show) }, [props.show]);
	const handleClose = () => {
		if (!props.disableHide) {
			setShow(false);
			props.closeCallback();
		}
	}

	const htmlparser = (html) => {
		const clean = DOMPurify.sanitize(html);
		const parsed = parse(clean);
		return parsed;
	}

	const parsePersonString = (castString) => {
		const personArray = castString.split("|");
		const person = personArray.map((person, index) => {
			return <span style={{marginLeft: "0.5em"}} key={index}>- {person}</span>
		});
		return person;
	}


	return (
		<>
			<Modal show={show} onHide={handleClose} dialogClassName="modal-80w" style={{ zIndex: "2050" }}>
				<Modal.Header className="movieDetailsModalHeader" closeButton>
					<Modal.Title>{htmlparser(movieItem.title)}</Modal.Title>

				</Modal.Header>
				<Modal.Body className="movieDetailsModalBody">
					<Row>
						<Col>
							<div className="movie-preview-card-image">
								<Image src={movieItem.poster} alt={"Poster of the movie " + movieItem.title}
									variant="left"
									className="d-flex mx-auto d-block img-thumbnail"
									style={{
										maxHeight: "36%", minHeight: "36%",
										width: "auto"
									}} />
							</div>
						</Col>
						<Col>
							<Row>
								<h5 style={{ textAlign: "left" }}>{movieItem.title} ({movieItem.year})</h5>
							</Row>
							<Row style={{ height: "270px", overflowY: "scroll" }}>
								<p style={{ textAlign: "left" }}>
									{movieItem.description}
								</p>
							</Row>
						</Col>
					</Row>
					<hr />
					<Row style={{ height: "216px", overflowY: "scroll", marginTop: "18px" }}>
						<p>
							{movieItem.director && <span><strong>Director:</strong> {parsePersonString(movieItem.director)}</span>}
						</p>
						<p>
							{movieItem.cast && <span><strong>Cast:</strong> {parsePersonString(movieItem.cast)}</span>}
						</p>
					</Row>
				</Modal.Body>
				<Modal.Footer className="movieDetailsModalHeader">
					{props.cancelCallback &&
						<Button variant="ersCancel" onClick={() => props.cancelCallback()}>
							Close
						</Button>
					}
					<Button variant="ers" onClick={
						props.confirmCallback ?
							() => props.confirmCallback()
							: handleClose
					}>
						{props.confirmText || "Close"}
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}