export type NativeProblem = {
    contestId: number,
    index: string,
    name: string,
    type: string,
    rating?: number
};
export type NativeContest = {
    id: string,
    name: string,
    type: string
};

export type NativeProblemsData = {
    status: string,
    result: {
        problems: NativeProblem[]
    }
};
export type NativeContestsData = {
    status: string,
    result: NativeContest[]
};