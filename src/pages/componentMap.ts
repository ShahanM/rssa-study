import { DemographicsPage, FeedbackPage, MovieRatingPage, SurveyPage } from 'rssa-study-template';
import WelcomePage from './WelcomePage';
import ConsentPage from './ConsentPage';
import SelfActualizationPage from './selfactualization/SelfActualizationPage';
import StudyOverviewPage from './StudyOverviewPage';

export const componentMap: { [key: string]: React.FC } = {
    WelcomeStep: WelcomePage,
    ConsentStep: ConsentPage,
    StudyOverviewStep: StudyOverviewPage,
    SurveyStep: SurveyPage,
    PreferenceElicitationStep: MovieRatingPage,
    TaskStep: SelfActualizationPage,
    FeedbackStep: FeedbackPage,
    DemographicsStep: DemographicsPage,
};
