import React from 'react';
import type { MovieDetails, RatedItem } from '../../types';
import { VerticalMovieRibbon } from '../../components/MovieRibbon';
import RandomMovieGrid from '../../components/RandomMovieGrid';
import RecommendationRibbon from '../../components/RecommendationRibbon';

export interface ConditionViewProps {
    randomMovies: MovieDetails[];
    recommendations?: MovieDetails[];
    userRatings?: RatedItem[];
    loading: boolean;
}

// ----------------------
// Layout Logic Helpers
// ----------------------

const LegacyGridCell: React.FC<{ header: string; movies: MovieDetails[]; colSpan?: number; loading: boolean; userRatings?: RatedItem[] }> = ({ header, movies, colSpan = 1, loading, userRatings = [] }) => (
    <div className={`p-2 rounded bg-gray-900/50 md:col-span-${colSpan} h-[75vh] flex flex-col`}>
        <h5 className="text-xl font-bold mb-2 text-white flex-shrink-0">{header}</h5>
        <div className="flex-grow overflow-hidden">
            <VerticalMovieRibbon 
                movies={movies} 
                loading={loading}
                allowRemove={false}
                userRatings={userRatings}
            />
        </div>
    </div>
);

const GridContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
     <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
         {children}
     </div>
);


// Condition 1: 28 Random (4 cols) + 7 TopN (1 col)
const ConditionOneView: React.FC<ConditionViewProps> = ({ randomMovies = [], userRatings = [], loading }) => (
    <GridContainer>
        <div className="md:col-span-4">
             <RandomMovieGrid movies={randomMovies.slice(0, 28)} loading={loading} userRatings={userRatings} />
        </div>
        <div className="md:col-span-1">
            <RecommendationRibbon header="TopN" userRatings={userRatings} />
        </div>
    </GridContainer>
);

// Condition 2: 21 Random (3 cols) + 7 TopN (1 col) + 7 TopN (1 col)
const ConditionTwoView: React.FC<ConditionViewProps> = ({ randomMovies = [], recommendations = [], userRatings = [], loading }) => (
    <GridContainer>
        <div className="md:col-span-3">
             <RandomMovieGrid movies={randomMovies.slice(0, 21)} loading={loading} userRatings={userRatings} />
        </div>
        <LegacyGridCell header="TopN" movies={recommendations ? recommendations.slice(0, 7) : []} colSpan={1} loading={loading} userRatings={userRatings} />
        <LegacyGridCell header="TopN" movies={recommendations ? recommendations.slice(7, 14) : []} colSpan={1} loading={loading} userRatings={userRatings} />
    </GridContainer>
);

// Condition 3: 21 Random + 7 TopN + 7 Controversial
const ConditionThreeView: React.FC<ConditionViewProps> = ({ randomMovies = [], userRatings = [], loading }) => (
    <GridContainer>
        <div className="md:col-span-3">
             <RandomMovieGrid movies={randomMovies.slice(0, 21)} loading={loading} userRatings={userRatings} />
        </div>
        <div className="md:col-span-1">
            <RecommendationRibbon header="TopN" userRatings={userRatings} />
        </div>
        <div className="md:col-span-1">
            <RecommendationRibbon header="Controversial" recType="controversial" userRatings={userRatings} />
        </div>
    </GridContainer>
);

// Condition 4: 21 Random + 7 TopN + 7 First to try
const ConditionFourView: React.FC<ConditionViewProps> = ({ randomMovies = [], userRatings = [], loading }) => (
    <GridContainer>
        <div className="md:col-span-3">
             <RandomMovieGrid movies={randomMovies.slice(0, 21)} loading={loading} userRatings={userRatings} />
        </div>
        <div className="md:col-span-1">
            <RecommendationRibbon header="TopN" userRatings={userRatings} />
        </div>
        <div className="md:col-span-1">
            <RecommendationRibbon header="First to try" recType="first_to_try" userRatings={userRatings} />
        </div>
    </GridContainer>
);

// Condition 5: 21 Random + 7 TopN + 7 No idea
const ConditionFiveView: React.FC<ConditionViewProps> = ({ randomMovies = [], userRatings = [], loading }) => (
    <GridContainer>
        <div className="md:col-span-3">
             <RandomMovieGrid movies={randomMovies.slice(0, 21)} loading={loading} userRatings={userRatings} />
        </div>
        <div className="md:col-span-1">
            <RecommendationRibbon header="TopN" userRatings={userRatings} />
        </div>
        <div className="md:col-span-1">
            <RecommendationRibbon header="No idea" recType="no_idea" userRatings={userRatings} />
        </div>
    </GridContainer>
);

// Condition 6: 21 Random + 7 TopN + 7 Hate
const ConditionSixView: React.FC<ConditionViewProps> = ({ randomMovies = [], userRatings = [], loading }) => (
    <GridContainer>
        <div className="md:col-span-3">
             <RandomMovieGrid movies={randomMovies.slice(0, 21)} loading={loading} userRatings={userRatings} />
        </div>
        <div className="md:col-span-1">
            <RecommendationRibbon header="TopN" userRatings={userRatings} />
        </div>
        <div className="md:col-span-1">
            <RecommendationRibbon header="Most Hated" recType="hate" userRatings={userRatings} />
        </div>
    </GridContainer>
);

// Condition 7: 7 Controversial + 7 First to try + 7 No idea + 7 Hate + 7 TopN
const ConditionSevenView: React.FC<ConditionViewProps> = ({ recommendations = [], userRatings = [], loading }) => (
    <GridContainer>
        <LegacyGridCell header="Controversial" movies={recommendations ? recommendations.slice(0, 7) : []} colSpan={1} loading={loading} userRatings={userRatings} />
        <LegacyGridCell header="First to try" movies={recommendations ? recommendations.slice(7, 14) : []} colSpan={1} loading={loading} userRatings={userRatings} />
        <LegacyGridCell header="No idea" movies={recommendations ? recommendations.slice(14, 21) : []} colSpan={1} loading={loading} userRatings={userRatings} />
        <LegacyGridCell header="Hate" movies={recommendations ? recommendations.slice(21, 28) : []} colSpan={1} loading={loading} userRatings={userRatings} />
        <LegacyGridCell header="TopN" movies={recommendations ? recommendations.slice(28, 35) : []} colSpan={1} loading={loading} userRatings={userRatings} />
    </GridContainer>
);

// To handle "unknown" safely
export const ErrorView: React.FC<ConditionViewProps> = () => (
    <div className="text-center text-red-500">
        <h3>Configuration Error (Unknown Condition)</h3>
    </div>
);


export type ConditionConfig = {
    View: React.FC<ConditionViewProps>;
};

// Map short_codes or condition IDs to Views
export const conditionMap: Record<string, ConditionConfig> = {
    // Condition 1
    "COND_1": { View: ConditionOneView },
    // Condition 2
    "COND_2": { View: ConditionTwoView },
    // Condition 3
    "COND_3": { View: ConditionThreeView },
    // Condition 4
    "COND_4": { View: ConditionFourView },
    // Condition 5
    "COND_5": { View: ConditionFiveView },
    // Condition 6
    "COND_6": { View: ConditionSixView },
    // Condition 7
    "COND_7": { View: ConditionSevenView },
    
    // Fallback ID mapping (legacy UUIDs could go here if needed as keys)
     "f865835f-fd3d-48a5-bdd1-3aad793c45cd": { View: ConditionOneView }
};

// Helper for numeric mapping if the backend returns integers 1-7 in a "condition_id" or similar field
export const numericConditionMap: Record<number, ConditionConfig> = {
    1: { View: ConditionOneView },
    2: { View: ConditionTwoView },
    3: { View: ConditionThreeView },
    4: { View: ConditionFourView },
    5: { View: ConditionFiveView },
    6: { View: ConditionSixView },
    7: { View: ConditionSevenView }
};
