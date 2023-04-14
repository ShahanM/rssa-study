import { get } from './middleware/requests';

export function getStudy(studyid) {
	return get('study/' + studyid)
		.then((response): Promise<studyres> => response.json())
		.then((studyres: studyres) => {
			return studyres;
		});
}

export function getFirstStudyStep(studyid) {
	return get('study/' + studyid + '/step/first/')
		.then((response): Promise<StudyStepRes> => response.json())
		.then((studyStepRes: studyStepRes) => {
			return studyStepRes;
		})
}

export function getNextStudyStep(studyid, stepid) {
	return get('study/' + studyid + '/step/' + stepid + '/next')
		.then((response): Promise<step> => response.json())
		.then((step: step) => {
			return step;
		})
}

export function getFirstStepPage(studyStep) {
	return get('study/' + studyStep.study_id + '/step/' + studyStep.id + '/page/first')
		.then((response): Promise<page> => response.json())
		.then((page: page) => {
			return page;
		})
}

export function getNextStepPage(studyid, stepid, pageid) {
	return get('study/' + studyid + '/step/' + stepid + '/page/' + pageid + '/next')
		.then((response): Promise<page> => response.json())
		.then((page: page) => {
			return page;
		})
}




