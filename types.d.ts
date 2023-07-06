type Difficulty = {
    type: 'normal' | 'medal',
    color: string,
    textColor: string,
    rate: number,
    value: number
};

type Problem = {
    index: string,
    title: string,
    link: string | null,
    difficulty: Difficulty | null
};
type ProblemSet = {
    [id: string]: Problem
};

type Contest = {
    title: string,
    link: string | null,
    problems: ProblemSet
};
type ContestSet = {
    [id: string]: Contest
};

type Category = {
    title: string,
    color: string,
    contests: string[]
};
type CategorySet = {
    [id: string]: Category
};

type Data = {
    categories: CategorySet,
    contests: ContestSet
};

type Modules = {
    [id: string]: any
};

type Info = {
    title: string,
    icon: string,
    link: string
}
