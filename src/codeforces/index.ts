import fetch from "node-fetch";
import { NativeContestsData, NativeProblemsData } from "./types.ts";

function resolveDifficulty(rating: number | undefined): Difficulty | null {
    if (!rating) return null;
    if (rating < 1200) return {
        type: 'normal',
        color: '#ccc',
        rate: (rating - 800) / (1200 - 800),
        value: rating,
        textColor: '#ccc'
    };
    if (rating < 1400) return {
        type: 'normal',
        color: '#7f7',
        rate: (rating - 1200) / (1400 - 1200),
        value: rating,
        textColor: '#7f7'
    };
    if (rating < 1600) return {
        type: 'normal',
        color: '#7db',
        rate: (rating - 1400) / (1600 - 1400),
        value: rating,
        textColor: '#7db'
    };
    if (rating < 1900) return {
        type: 'normal',
        color: '#aaf',
        rate: (rating - 1600) / (1900 - 1600),
        value: rating,
        textColor: '#aaf'
    };
    if (rating < 2100) return {
        type: 'normal',
        color: '#f8f',
        rate: (rating - 1900) / (2100 - 1900),
        value: rating,
        textColor: '#f8f'
    };
    if (rating < 2300) return {
        type: 'normal',
        color: '#fc8',
        rate: (rating - 2100) / (2300 - 2100),
        value: rating,
        textColor: '#fc8'
    };
    if (rating < 2400) return {
        type: 'normal',
        color: '#fb5',
        rate: (rating - 2300) / (2400 - 2300),
        value: rating,
        textColor: '#fb5'
    };
    if (rating < 2600) return {
        type: 'normal',
        color: '#f77',
        rate: (rating - 2400) / (2600 - 2400),
        value: rating,
        textColor: '#f77'
    };
    if (rating < 3000) return {
        type: 'normal',
        color: '#f33',
        rate: (rating - 2600) / (3000 - 2600),
        value: rating,
        textColor: '#f33'
    };
    if (rating < 3200) return {
        type: 'medal',
        color: 'rgb(150, 92, 44)',
        rate: 1,
        value: rating,
        textColor: 'a00'
    };
    if (rating < 3400) return {
        type: 'medal',
        color: 'rgb(128, 128, 128)',
        rate: 1,
        value: rating,
        textColor: 'a00'
    };
    return {
        type: 'medal',
        color: 'rgb(255, 215, 0)',
        rate: 1,
        value: rating,
        textColor: '#a00'
    };
}

export async function getData(): Promise<Data> {
    let nativeProblems = await (await fetch('https://codeforces.com/api/problemset.problems')).json() as NativeProblemsData;
    let problems = [] as Problem[];
    let contestSet = {} as {[id: string]: Contest};
    if (nativeProblems.status !== 'OK') throw nativeProblems;
    for (const problem of nativeProblems.result.problems) {
        problems.push({
            id: `${problem.contestId}${problem.index}`,
            title: problem.name,
            link: `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`,
            difficulty: resolveDifficulty(problem.rating)
        });
        if (!contestSet[`${problem.contestId}`]) {
            contestSet[`${problem.contestId}`] = {
                id: `${problem.contestId}`,
                title: '',
                link: `https://codeforces.com/contest/${problem.contestId}`,
                problems: []
            };
        }
        contestSet[`${problem.contestId}`].problems.push({id: `${problem.contestId}${problem.index}`, index: `${problem.index}`});
    }
    let nativeContests = await (await fetch('https://codeforces.com/api/contest.list')).json() as NativeContestsData;
    for (const contest of nativeContests.result) {
        if (contestSet[`${contest.id}`]) contestSet[`${contest.id}`].title = contest.name;
    }
    let contests = [] as Contest[];
    for (const id in contestSet) contestSet[id].problems = contestSet[id].problems.reverse(), contests.push(contestSet[id]);
    let categories = [] as Category[];
    return {categories: categories, contests: contests, problems: problems};
}
export async function getInfo(): Promise<Info> {
    return {
        title: 'Codeforces',
        icon: 'https://codeforces.com/favicon.png',
        link: 'https://codeforces.com/'
    }
}
