import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';
import { getFirstStudyStep, getStudy } from '../api/studyapi';
import { createUser, sendLog } from '../api/userapi';
import InformedConsentModal from '../widgets/dialogs/informedConsentModal';

export const WelcomePage = (props) => {

	const studyID = 2;

	const [show, setShowInformedConsent] = useState(false);
	const [userdata, setUserdata] = useState({});
	const [study, setStudy] = useState({});
	const [studyStep, setStudyStep] = useState({});
	const [starttime, setStarttime] = useState(new Date());

	const showInformedConsent = () => {
		setShowInformedConsent(!show);
	}

	const navigate = useNavigate();

	useEffect(() => {
		const userProps = ['id', 'condition', 'user_type', 'seen_items'];
		if (userProps.every(item => userdata.hasOwnProperty(item))) {
			sendLog(userdata, studyStep.id, null, starttime - new Date(),
				'user creation', 'study consent', null, null).then(() => {
					navigate(props.next,
						{
							state: {
								user: userdata,
								studyStep: studyStep.id
							}
						});
				})
		}
	}, [userdata, navigate, studyStep, props.next, starttime]);

	useEffect(() => {
		getStudy(studyID).then((studyres: studyres) => { setStudy(studyres) });
		getFirstStudyStep(studyID).then((studyStepRes: studyStepRes) => {
			setStudyStep(studyStepRes);
		});
		setStarttime(new Date());

	}, []);

	const consentCallbackHandler = (consent) => {
		if (consent) {
			createUser('rssaStudy', study.id)
				.then((response): Promise<user> => response.json())
				.then((user: user) => {
					setUserdata(user);
				})
				.catch((error) => console.log(error));

		}
	}

	return (
		<Container>
			<Row>
				<div className="jumbotron">
					<h1 className="header">Welcome</h1>
					<p>Welcome to the study on movie recommendation.</p>
				</div>
			</Row>

			<Row>
				<Card bg="light">
					<Card.Body className="instructionblurb">
						<Card.Title>What can you expect?</Card.Title>
						<p>
							In this study you will test a new recommender system
							for movies.
						</p>
						<p>
							There are four steps to the study:
						</p>
						<ol>
							<li>
								Complete a pre-survey.
							</li>
							<li>
								Rate a few movies you are familiar with to let
								recommender system know about your movie
								preferences.
							</li>
							<li>
								Interact with the movie recommender system, then
								pick one movie you would most like to watch.
							</li>
							<li>Complete a post-survey.</li>
						</ol>

						<p>
							Thanks,<br />
							Research Team
						</p>
					</Card.Body>
				</Card>
			</Row>

			<InformedConsentModal show={show}
				consentCallback={consentCallbackHandler} />

			<Row>
				<div className="jumbotron jumbotron-footer">
					<Button variant="ers" size="lg" className="footer-btn"
						onClick={showInformedConsent}>
						Get started
					</Button>
				</div>
			</Row>
		</Container>
	)
}