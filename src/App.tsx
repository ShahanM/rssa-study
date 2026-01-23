// import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/_custom-bootstrap.scss';
import './styles/App.css';
import './styles/components.css';
import { Suspense, useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { DemographyPage } from './pages/demographyPage';
import { FeedbackPage } from './pages/feedbackPage';
import RssaMain from './pages/recsystem/recsystemPage';
import { WarningDialog } from './components/dialogs/warningDialog';
import { useStudy, isEmptyParticipant, isEmptyStep } from 'rssa-api';
import {
	Participant,
	StudyStep,
	emptyParticipant,
	emptyStep
} from 'rssa-api';
import { ThemeProvider } from 'react-bootstrap';
import { STRINGS } from './utils/constants';
import Welcome from './pages/WelcomePage';
import StudyMap from './pages/StudyMap';
import Survey from './pages/SurveyPage';
import MovieRatingPage from './pages/MovieRatingPage';

const customBreakpoints = {
	xl: 1200,
	xxl: 1400,
	xxxl: 1800, // Custom breakpoint for viewport size greater than 1800px
	xl4: 2000
};

function App() {

	const { studyApi } = useStudy();
	const [showWarning, setShowWarning] = useState(false);
	const [participant, setParticipant] = useState<Participant>(emptyParticipant);
	const [studyStep, setStudyStep] = useState<StudyStep>(emptyStep);
	const [checkpointUrl, setCheckpointUrl] = useState<string>('/');
	const [studyError, setStudyError] = useState<boolean>(false);

	const handleStepUpdate = (step: StudyStep, referrer: string) => {
		const newParticipant = { ...participant, current_step: step.id };
		studyApi.put('participant/', newParticipant).then(() => {
			localStorage.setItem('participant', JSON.stringify(newParticipant));
			localStorage.setItem('studyStep', JSON.stringify(step));
			localStorage.setItem('lastUrl', referrer);
		});
		setParticipant(newParticipant);
		setStudyStep(step);
		setCheckpointUrl(referrer);
	}

	useEffect(() => {
		const participantCache = localStorage.getItem('participant');
		const studyStepCache = localStorage.getItem('studyStep');
		const checkpointUrl = localStorage.getItem('lastUrl');
		if (participantCache && studyStepCache) {
			const cparticipant = JSON.parse(participantCache);
			if (!isEmptyParticipant(cparticipant)) {
				setParticipant(cparticipant);
			}
			const cstudyStep = JSON.parse(studyStepCache);
			if (!isEmptyStep(cstudyStep)) {
				setStudyStep(cstudyStep);
			}

			if (checkpointUrl) {
				setCheckpointUrl(checkpointUrl);
			}
		} else {
			studyApi.get<StudyStep>('studystep/first')
				.then((studyStep: StudyStep) => {
					setStudyStep(studyStep);
					setStudyError(false);
				}).catch((error: any) => {
					setStudyError(true);
				});
		}
	}, [studyApi]);


	useEffect(() => {
		const handleResize = () => { setShowWarning(window.innerWidth < 1200); }
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);
	return (
		<ThemeProvider breakpoints={Object.keys(customBreakpoints)}>

			<div className="App">
				{showWarning &&
					<WarningDialog
						show={showWarning}
						title="Warning"
						message={STRINGS.WINDOW_TOO_SMALL}
						disableHide={true} />
				}
				{studyError &&
					<WarningDialog
						show={studyError}
						title="Error"
						message={STRINGS.STUDY_ERROR} />
				}
				<Router basename='/rssa-study'>
					<Suspense fallback={<h1>Loading</h1>}>
						<Routes>
							<Route path="/" element={
								<Welcome
									next="/studyoverview"
									checkpointUrl={checkpointUrl}
									studyStep={studyStep}
									setNewParticipant={setParticipant}
									updateCallback={handleStepUpdate}
									sizeWarning={showWarning}
								/>
							} />
							<Route path="/studyoverview" element={
								<StudyMap
									next="/presurvey"
									checkpointUrl={checkpointUrl}
									participant={participant}
									studyStep={studyStep}
									updateCallback={handleStepUpdate}
									sizeWarning={showWarning}
								/>
							} />
							<Route path="/presurvey" element={
								<Survey
									next="/ratemovies"
									checkpointUrl={checkpointUrl}
									participant={participant}
									studyStep={studyStep}
									updateCallback={handleStepUpdate}
									sizeWarning={showWarning}
								/>
							} />
							<Route path="/ratemovies" element={
								<MovieRatingPage
									next="/recommendations"
									checkpointUrl={checkpointUrl}
									participant={participant}
									studyStep={studyStep}
									updateCallback={handleStepUpdate}
									sizeWarning={showWarning}
								/>
							} />
							<Route path="/recommendations" element={
								<RssaMain
									next="/feedback"
									checkpointUrl={checkpointUrl}
									participant={participant}
									studyStep={studyStep}
									updateCallback={handleStepUpdate}
									sizeWarning={showWarning}
								/>
							} />
							{/* <Route path="/" element={<WelcomePage next="/studyoverview" />} /> */}
							{/* <Route path="/studyoverview" element={<StudyOverviewPage next="/presurvey" />} /> */}
							{/* <Route path="/presurvey" element={<Survey next="/ratemovies" />} /> */}
							{/* <Route path="/ratemovies" element={<RateMovies next="/rssa" />} /> */}
							{/* <Route path="/rssa" element={<RssaMain next="/feedback" />} /> */}
							{/* <Route path="/feedback" element={<FeedbackPage next="/postsurvey" />} /> */}
							{/* <Route path="/postsurvey" element={<Survey next="/demography" />} /> */}
							{/* <Route path="/demography" element={<DemographyPage next="/quit" />} /> */}
							{/* <Route path="/quit" element={<h1>Thank you for participating!</h1>} /> */}
						</Routes>
					</Suspense>
				</Router>
			</div>
		</ThemeProvider>
	);
}

export default App;
