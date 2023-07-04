type NativeContest = {
    id: string,
    start_epoch_second: number,
    duration_second: number,
    title: string,
    rate_change: string
};

type NativeProblem = {
    id: string,
    contest_id: string,
    problem_index: string,
    name: string,
    title: string
};

type NativeDifficulty = {
    slope: number,
    intercept: number,
    variance: number,
    difficulty: number,
    discrimination: number,
    irt_loglikelihood: number,
    irt_users: number,
    is_experimental: boolean
};
type NativeDifficultySet = {
    [id: string]: NativeDifficulty
};

type NativeContestProblem = {
    contest_id: string,
    problem_id: string,
    problem_index: string
};
