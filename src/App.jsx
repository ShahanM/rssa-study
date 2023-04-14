import 'bootstrap/dist/css/bootstrap.min.css';
import { Suspense, useEffect, useState } from 'react';
import { Navbar } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { DemographyPage } from './pages/demographyPage';
import RssaMain from './pages/recsystemPage';
import { StudyOverviewPage } from './pages/studyOverviewPage';
import { Survey } from './pages/survey';
import { WelcomePage } from './pages/welcomePage';
import { WarningDialog } from './widgets/dialogs/warningDialog';
import { FeedbackPage } from './pages/feedbackPage';

function App() {

	const [showWarning, setShowWarning] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 720) {
				console.log('small', window.innerWidth);
				setShowWarning(true);
			} else {
				console.log('large', window.innerWidth);
				setShowWarning(false);
			}
		}
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return (
		<div className="App">
			{showWarning &&
				<WarningDialog
					show={showWarning}
					title="Warning"
					message="This study requires your browser to be at least 
					<strong><underline>720 pixels wide</underline></strong>. Please resize your browser window or use a 
					device with a larger screen."
					disableHide={true}
				/>
			}
			<Router basename='/rssa-study'>
				{/* <header className="App-header">
					<Navbar id="topnav" bg="light" style={{ width: "100%" }}>
						<Navbar.Brand style={{ marginLeft: "1em", fontWeight: "450", textAlign: 'center', height: "1.5em" }}>
							Movie Recommender Study
							</Navbar>
						</Navbar.Brand>
				</header> */}
				<Suspense fallback={<h1>Loading</h1>}>
					<Routes>
						<Route path="/" element={<WelcomePage next="/studyoverview" />} />
						<Route path="/studyoverview" element={<StudyOverviewPage next="/presurvey" />} />
						<Route path="/presurvey" element={<Survey next="/rssa" />} />
						<Route path="/rssa" element={<RssaMain next="/feedback" />} />
						<Route path="/feedback" element={<FeedbackPage next="/postsurvey" />} />
						<Route path="/postsurvey" element={<Survey next="/demography" />} />
						<Route path="/demography" element={<DemographyPage next="/quit" />} />
						<Route path="/quit" element={<h1>Thank you for participating!</h1>} />
					</Routes>
				</Suspense>
			</Router>
		</div>
	);
}

export default App;
