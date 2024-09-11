export interface FileList {
	[unused: string]: File,
}

export interface File {
	// Score directory name
	id: string,
	// User visible name
	name: string,
	uploaded?: FileState,
}

export enum FileState {
	IN_PROGRESS_1 = 1,
	IN_PROGRESS_2 = 2,
	IN_PROGRESS_3 = 3,
	COMPLETE = 4,
}

export interface UserScore {
	// Student name
	_name: string,
	// Directory name
	_fname: string,
	[subject: string]: string | SubjectScore,
}

export interface SubjectScore {
	score: number|string,
	rank?: number,
	percent?: number,
}

export interface ScoreStats {
	_float: string,
	[subject: string]: string | {
		// Array of histogram buckets
		histogram: number[],
		// Full marks of this subject
		max: number,
		// Subject name
		name: string,
		// Number of people who has score
		count: number,
		// Highest score achieved
		hiscore: number,
		// Number of people who has the hiscore
		hiscore_cnt: number,
		// Lowest score achieved
		lowscore: number,
		// Number of people who has the lowest score achieved
		lowscore_cnt: number,
		// 2nd Lowest score achieved
		lowscore2: number,
		// Number of people who has the 2nd lowest score achieved
		lowscore2_cnt: number,

		// Mode (score that most people achieved)
		mode: number,
		// Number of people who has the mode score
		mode_cnt: number,
		// Average score
		average: number,
		// Standard Deviation
		sd: number,
	},
}
