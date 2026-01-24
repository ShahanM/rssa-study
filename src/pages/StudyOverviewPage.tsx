import { useEffect } from 'react';
import { useStepCompletion } from 'rssa-study-template';
import rsinteract from '../assets/interact.png';
import postsurvey from '../assets/post-survey.png';
import presurvey from '../assets/pre-survey.png';
import rspref from '../assets/rate-prefs.png';

const StudyOverviewPage: React.FC = () => {
    const { setIsStepComplete } = useStepCompletion();

    const stepCards = [
        { img: presurvey, title: 'Pre-survey' },
        { img: rspref, title: 'Indicate your preference' },
        { img: rsinteract, title: 'Interact with the system' },
        { img: postsurvey, title: 'Post-survey' },
    ];

    useEffect(() => {
        setIsStepComplete(true);
    }, [setIsStepComplete]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Study Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stepCards.map((card, idx) => (
                    <div key={idx} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
                        <h3 className="text-xl font-semibold mb-4 text-center">{card.title}</h3>
                        <img src={card.img} alt={card.title} className="w-full h-auto object-contain max-h-48" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudyOverviewPage;
