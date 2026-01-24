import React from 'react';
import { WelcomePage as GenericWelcomePage } from 'rssa-study-template';

const WelcomeContent: React.FC = () => {
    return (
        <div className="m-3 p-5 text-left rounded-3">
            <h3 className="mb-3 text-2xl font-bold">What can you expect?</h3>
            <p className="mb-2">In this study you will test a new recommender system for movies.</p>
            <p className="mb-2">There are four steps to the study:</p>
            <ol className="list-decimal pl-5 mb-4 space-y-1">
                <li className="p-1">Complete a pre-survey.</li>
                <li className="p-1">
                    Rate a few movies you are familiar with to let the recommender system know about your movie preferences.
                </li>
                <li className="p-1">Interact with the movie recommender system.</li>
                <li className="p-1">Complete a post-survey.</li>
            </ol>
            <p>
                Thanks,
                <br />
                Research Team
            </p>
        </div>
    );
};

// Check props for GenericWelcomePage in library to ensure compatibility
const WelcomePage: React.FC<any> = (props) => {
    return <GenericWelcomePage {...props} ContentComponent={WelcomeContent} />;
};

export default WelcomePage;
