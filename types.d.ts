type Difficulty = {
    type: 'normal' | 'medal',
    color: string,
    textColor: string,
    rate: number,
    value: number
};

type ContestProblem = {
    id: string,
    index: string
};
type Problem = {
    id: string,
    title: string,
    difficulty: Difficulty | null,
    link: string | null
}

type Contest = {
    id: string,
    title: string,
    link: string | null,
    problems: ContestProblem[];
};

type Category = {
    id: string,
    title: string,
    color: string,
    contests: string[],
    indexes?: {[name: string]: string}
};

type Data = {
    categories: Category[],
    contests: Contest[],
    problems: Problem[]
};

type Modules = {
    [id: string]: any
};

type Info = {
    title: string,
    icon: string,
    link: string
}
