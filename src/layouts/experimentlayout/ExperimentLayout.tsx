import StudyLayoutOne from "../fragments/studylayoutone/StudyLayoutOne";
import StudyLayoutTwo from "../fragments/studylayouttwo/StudyLayoutTwo";
import StudyLayoutThree from "../fragments/studylayoutthree/StudyLayoutThree";
import { ExperimentLayoutProps } from "./ExperimentLayout.types";
import ConditionLayout from "../fragments/conditionlayout/ConditionLayout";

/*
	1: "28 random + 7 topN",
	2: "21 random + 7 topN + 7 topN",
	3: "21 random + 7 topN + 7 controversial",
	4: "21 random + 7 topN + 7 first to try",
	5: "21 random + 7 topN + 7 no idea",
	6: "21 random + 7 topN + 7 hate",
	7: "7 controversial + 7 first to try + 7 no idea + 7 hate + 7 topN",
*/

const ExperimentLayout: React.FC<ExperimentLayoutProps> = ({ 
	condition,
	movies,
	recommendations,
	ratingsCallback
}) => {
	switch (condition) {
		case 1: return (
			<ConditionLayout ribbonConfigs={[
				{ rows: 7, cols: 4, header: "Random", movies: movies.slice(0, 7*4)},
				{ rows: 7, cols: 1, header: "TopN", movies: recommendations.slice(0, 7)}
			]} />);
		case 2: return (
			<ConditionLayout ribbonConfigs={[
				{ rows: 7, cols: 3, header: "Random", movies: movies.slice(0, 7*3)},
				{ rows: 7, cols: 1, header: "TopN", movies: recommendations.slice(0, 7)},
				{ rows: 7, cols: 1, header: "TopN", movies: recommendations.slice(7, 7*2)}
			]} />);
		case 3: return (
			<ConditionLayout ribbonConfigs={[
				{ rows: 7, cols: 3, header: "Random", movies: movies.slice(0, 7*3)},
				{ rows: 7, cols: 1, header: "TopN", movies: recommendations.slice(0, 7)},
				{ rows: 7, cols: 1, header: "Controversial", movies: recommendations.slice(7, 7*2)}
			]} />);
		case 4: return (
			<ConditionLayout ribbonConfigs={[
				{ rows: 7, cols: 3, header: "Random", movies: movies.slice(0, 7*3)},
				{ rows: 7, cols: 1, header: "TopN", movies: recommendations.slice(0, 7)},
				{ rows: 7, cols: 1, header: "First to try", movies: recommendations.slice(7, 7*2)}
			]} />);
		case 5: return (
			<ConditionLayout ribbonConfigs={[
				{ rows: 7, cols: 3, header: "Random", movies: movies.slice(0, 7*3)},
				{ rows: 7, cols: 1, header: "TopN", movies: recommendations.slice(0, 7)},
				{ rows: 7, cols: 1, header: "No idea", movies: recommendations.slice(7, 7*2)}
			]} />);
		case 6: return (
			<ConditionLayout ribbonConfigs={[
				{ rows: 7, cols: 3, header: "Random", movies: movies.slice(0, 7*3)},
				{ rows: 7, cols: 1, header: "TopN", movies: recommendations.slice(0, 7)},
				{ rows: 7, cols: 1, header: "Hate", movies: recommendations.slice(7, 7*2)}
			]} />);
		case 7: return (
			<ConditionLayout ribbonConfigs={[
				{ rows: 7, cols: 1, header: "Controversial", movies: recommendations.slice(0, 7)},
				{ rows: 7, cols: 1, header: "First to try", movies: recommendations.slice(7, 7*2)},
				{ rows: 7, cols: 1, header: "No idea", movies: recommendations.slice(14, 7*3)},
				{ rows: 7, cols: 1, header: "Hate", movies: recommendations.slice(21, 7*4)},
				{ rows: 7, cols: 1, header: "TopN", movies: recommendations.slice(28, 7*5)}
			]} />);
		default: return (<><h1>Something went wrong.</h1></>);
	}
}

export default ExperimentLayout;