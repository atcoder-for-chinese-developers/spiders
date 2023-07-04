declare type Difficulty = {
    type: 'normal' | 'medal',
    color: string,
    textColor: string,
    rate: number,
    value: number
};

declare type Problem = {
    index: string,
    title: string,
    difficulty: Difficulty | null
};
declare type ProblemSet = {
    [id: string]: Problem
};

declare type Contest = {
    title: string,
    problems: ProblemSet
};
declare type ContestSet = {
    [id: string]: Contest
};

declare type Category = {
    title: string,
    color: string,
    contests: string[]
};
declare type CategorySet = {
    [id: string]: Category
};

declare type Data = {
    categories: CategorySet,
    contests: ContestSet
};

declare type Modules = {
    [id: string]: any
};
