import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useStudy } from 'rssa-api';
import type { MovieDetails, RatedItem } from '../types';
import { VerticalMovieRibbon } from './MovieRibbon';

interface RecommendationRibbonProps {
    recType?: string;
    header?: string;
    userRatings?: RatedItem[];
}

interface EnrichedResponseWrapper {
    rec_type: string;
    items: { [key: string]: MovieDetails } | MovieDetails[];
}

interface StudyLayoutContextType {
    studyStep: {
        id: string;
        key: string;
    };
}

/**
 * Smart Component that fetches its own recommendations based on the current Study Step.
 */
const RecommendationRibbon: React.FC<RecommendationRibbonProps> = ({ 
    recType = 'recommendation_task',
    header = "Recommended for You",
    userRatings = []
}) => {
    const { studyApi } = useStudy();
    const { studyStep } = useOutletContext<StudyLayoutContextType>(); 
    
    const [movies, setMovies] = useState<MovieDetails[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchRecs = async () => {
            if (!studyStep?.id) return;
            
            setLoading(true);
            setError(false);
            
            try {
                const payload = {
                    step_id: studyStep.id,
                    context_tag: recType
                };

                const response = await studyApi.post<typeof payload, EnrichedResponseWrapper>(
                    "recommendations/", 
                    payload
                );

                if (response) {
                    let recs: MovieDetails[] = [];
                    if (Array.isArray(response.items)) {
                        recs = response.items as MovieDetails[];
                    } else if (typeof response.items === 'object') {
                         recs = Object.values(response.items) as MovieDetails[];
                    }
                    setMovies(recs);
                }
            } catch (e) {
                console.error("Failed to fetch recommendations", e);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchRecs();
    }, [studyStep, recType, studyApi]);

    return (
        <div className="h-[75vh] flex flex-col p-2 rounded bg-gray-900/50">
            <h5 className="text-xl font-bold mb-2 text-white flex-shrink-0">
                {header}
            </h5>
            <div className="flex-grow overflow-hidden">
                {error ? (
                    <div className="text-red-400 p-4 text-center">
                        Failed to load recommendations.
                    </div>
                ) : (
                    <VerticalMovieRibbon 
                        movies={movies} 
                        loading={loading}
                        allowRemove={false}
                        userRatings={userRatings}
                    />
                )}
            </div>
        </div>
    );
};

export default RecommendationRibbon;
