import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useFetchParticipant, useStudy } from 'rssa-api';
import { useNextButtonControl, useStepCompletion, LoadingScreen } from 'rssa-study-template';
import { useQuery } from '@tanstack/react-query';
import type { MovieDetails, RatedItem } from '../../types';
import { conditionMap } from './conditionMap';

interface RecommendationRequestPayload {
    step_id: string;
    context_tag: string;
    rec_type?: string;
}

interface EnrichedResponseWrapper {
    rec_type: string;
    items: { [key: string]: MovieDetails } | MovieDetails[];
}

interface PaginatedMovieResponse {
    data: MovieDetails[];
    count: number;
}

type StudyLayoutContextType = {
    studyStep: {
        id: string;
        key: string;
        // add other fields if known/needed
    };
};

const SelfActualizationPage: React.FC = () => {
    const { studyApi } = useStudy();
    const { data: participant, isLoading: isParticipantLoading } = useFetchParticipant();
    const { setIsStepComplete } = useStepCompletion();
    const { setButtonControl } = useNextButtonControl();
    
    // Guaranteed by RouteWrapper
    const { studyStep } = useOutletContext<StudyLayoutContextType>();

    const [randomMovies, setRandomMovies] = useState<MovieDetails[]>([]);
    const [recommendations, setRecommendations] = useState<MovieDetails[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Fetch User Ratings
    const { data: userRatings } = useQuery({
        queryKey: ["movieRatings"],
        queryFn: async () => await studyApi.get<RatedItem[]>(`responses/ratings/`),
        enabled: !!studyApi,
    });
    
    // Fetch Recommendations and Random Movies
    useEffect(() => {
        const fetchData = async () => {
             // Wait for participant loading
             if (isParticipantLoading || !participant) return;

             // Ensure studyStep (though guaranteed)
             if (!studyStep?.id) return;

            setLoading(true);

            // Fetch Random Movies
            try {
                 // The endpoint might return { data: [], count: ... } or just [] depending on version/config
                 const randomResponse = await studyApi.get<PaginatedMovieResponse | MovieDetails[]>('movies/?skip=0&limit=100');
                 
                 if (Array.isArray(randomResponse)) {
                     setRandomMovies(randomResponse);
                 } else if (randomResponse && 'data' in randomResponse && Array.isArray(randomResponse.data)) {
                     setRandomMovies(randomResponse.data);
                 }
            } catch (e) {
                console.error("Failed to fetch random movies", e);
            }

            // Fetch Recommendations
            try {
                // console.log("Fetching recommendations for step:", studyStep.id);

                const payload: RecommendationRequestPayload = {
                    step_id: studyStep.id,
                    context_tag: 'recommendation_task'
                };

                const recResponse = await studyApi.post<RecommendationRequestPayload, EnrichedResponseWrapper>("recommendations/", payload);
                
                if (recResponse) {
                    // Handle EnrichedResponseWrapper format
                    let recs: MovieDetails[] = [];
                    if (Array.isArray(recResponse.items)) {
                        recs = recResponse.items as MovieDetails[];
                    } else if (typeof recResponse.items === 'object') {
                         recs = Object.values(recResponse.items) as MovieDetails[];
                    }
                    
                    setRecommendations(recs);
                }
            } catch (e) {
                console.error("Failed to fetch recommendations", e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [studyApi, participant, studyStep, isParticipantLoading]);


    // Handle Next Button
    useEffect(() => {
        setButtonControl(prev => ({
            ...prev,
            isDisabled: false,
            action: () => {
                 setIsStepComplete(true);
            }
        }));
    }, [setButtonControl, setIsStepComplete]);


    if (isParticipantLoading || !participant) {
        return <LoadingScreen loading={true} message="Loading Participant Data..." />;
    }
    
    // View Selection
    const conditionId = participant?.study_condition_id; 
    const externalCode = participant?.study_condition?.short_code;
    
    let CurrentView = conditionMap["COND_1"].View;

    if (externalCode && conditionMap[externalCode]) {
        CurrentView = conditionMap[externalCode].View;
    } else if (conditionId) {
        if (conditionMap[conditionId]) {
            CurrentView = conditionMap[conditionId].View;
        } 
    }

    if (loading) {
        return <LoadingScreen loading={true} message="Loading Recommendations..." />;
    }

    return (
        <div className="container mx-auto p-4 min-h-screen">
            <div className="mt-4">
                <CurrentView 
                    randomMovies={randomMovies || []} 
                    recommendations={recommendations || []} 
                    userRatings={userRatings || []}
                    loading={loading} 
                />
            </div>
        </div>
    );
};

export default SelfActualizationPage;
