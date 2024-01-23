import fetch from "node-fetch";
import { NativeContest, NativeContestProblem, NativeDifficultySet, NativeProblem } from "./types.ts";

async function getObject(url: string) {
    const response = await fetch(url);
    return await response.json();
}

async function resolveContests(): Promise<Data> {
    function getIndexes(indexes: string[]) {
        let obj = {} as {[name: string]: string};
        for (const name of indexes) {
            const regex = name;
            regex.replace(/\//g, '|');
            obj[name] = `(${regex})\\d\*`;
        }
        return obj;
    }
    let categories = {
        abc: { id: "abc", title: "ABC", color: "#00f", contests: [], indexes: getIndexes(["A", "B", "C", "D", "E", "F", "G", "H/Ex"]) },
        arc: { id: "arc", title: "ARC", color: "#ff8000", contests: [], indexes: getIndexes(["A", "B", "C", "D", "E", "F"]) },
        agc: { id: "agc", title: "AGC", color: "#ff1818", contests: [], indexes: getIndexes(["A", "B", "C", "D", "E", "F"]) },
        abc_like: { id: "abc_like", title: "ABC Like", color: "#00f", contests: [], indexes: getIndexes(["A", "B", "C", "D", "E", "F", "G", "H/Ex"]) },
        arc_like: { id: "arc_like", title: "ARC Like", color: "#ff8000", contests: [], indexes: getIndexes(["A", "B", "C", "D", "E", "F"]) },
        agc_like: { id: "agc_like", title: "AGC Like", color: "#ff1818", contests: [], indexes: getIndexes(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]) },
        ahc: { id: "ahc", title: "AHC", color: "#181818", contests: [] },
        others: { id: "others", title: "其他", color: "#181818", contests: [] }
    } as {[id: string]: Category};
    let data = {
        categories: [],
        contests: [],
        problems: []
    } as Data;
    const contests = await getObject("https://kenkoooo.com/atcoder/resources/contests.json") as NativeContest[];
    for (const i in contests) {
        const contest = contests[i], id = contest.id;
        data.contests.push({ id: id, title: contest.title, problems: [], link: "https://atcoder.jp/contests/" + contest.id });
        let prefix = id.slice(0, 3);
        if (prefix === "abc" || prefix === "arc" || prefix === "agc" || prefix === "ahc") categories[prefix].contests.push(id);
    	else {
            try {
                let ratedRange = contest.rate_change, rightRangeStr = ratedRange.split("~")[1];
                if (rightRangeStr == " " || ratedRange == "All") rightRangeStr = "9999";
                if (!rightRangeStr) categories.others.contests.push(id);
                let rightRange = parseInt(rightRangeStr);
                if (rightRange < 2000) categories.abc_like.contests.push(id);
                else if (rightRange < 2800) categories.arc_like.contests.push(id);
                else categories.agc_like.contests.push(id);
	        } catch {
                 console.log("Failed to filter " + id + " failed.");
                 categories.others.contests.push(id);
	        }
	    }
    }
    for (const id in categories) data.categories.push(categories[id]);
    return data;
}

async function resolveProblems(): Promise<Problem[]> {
    let problems = [] as Problem[];
    const data = await getObject("https://kenkoooo.com/atcoder/resources/problems.json") as NativeProblem[];
    for (const i in data) {
        const problem = data[i];
        problems.push({ id: problem.id, title: problem.name, link: null, difficulty: null });
    }
    return problems.reverse();
}

function resolveDifficulty(difficulty: number): Difficulty {
    function getTextColor(difficulty: number): string {
        if (difficulty < 400) return 'rgb(128, 128, 128)';
        if (difficulty < 800) return 'rgb(128, 64, 0)';
        if (difficulty < 1200) return 'rgb(0, 128, 0)';
        if (difficulty < 1600) return 'rgb(0, 192, 192)';
        if (difficulty < 2000) return 'rgb(0, 0, 255)';
        if (difficulty < 2400) return 'rgb(192, 192, 0)';
        if (difficulty < 2800) return 'rgb(255, 128, 0)';
        return 'rgb(255, 0, 0)';
    }
    function getDifficultyColor(difficulty: number): string {
        if (difficulty < 400) return 'rgb(128, 128, 128)';
        if (difficulty < 800) return 'rgb(128, 64, 0)';
        if (difficulty < 1200) return 'rgb(0, 128, 0)';
        if (difficulty < 1600) return 'rgb(0, 192, 192)';
        if (difficulty < 2000) return 'rgb(0, 0, 255)';
        if (difficulty < 2400) return 'rgb(192, 192, 0)';
        if (difficulty < 2800) return 'rgb(255, 128, 0)';
        if (difficulty < 3200) return 'rgb(255, 0, 0)';
        if (difficulty < 3600) return 'rgb(150, 92, 44)';
        if (difficulty < 4000) return 'rgb(128, 128, 128)';
        return 'rgb(255, 215, 0)';
    }
    function getDifficultyRate(difficulty: number): number {
        let displayDifficulty = difficulty;
        if (displayDifficulty < 400) displayDifficulty = Math.round(400 / Math.exp(1 - displayDifficulty / 400));
        if (displayDifficulty >= 3200) return 1;
        return (displayDifficulty % 400) / 400;
    }
    return {
        type: difficulty >= 3200 ? 'medal' : 'normal',
        color: getDifficultyColor(difficulty),
        textColor: getTextColor(difficulty),
        rate: getDifficultyRate(difficulty),
        value: difficulty
    };
}
async function resolveDifficulties(problems: Problem[]): Promise<Problem[]> {
    const data = await getObject("https://kenkoooo.com/atcoder/resources/problem-models.json") as NativeDifficultySet;
    for (const i in problems) {
        const problem = data[problems[i].id];
        if (problem && problem.difficulty) problems[i].difficulty = resolveDifficulty(problem.difficulty);
    }
    return problems;
}

async function mergeData(data: Data, problems: Problem[]): Promise<Data> {
    const contestProblem = await getObject("https://kenkoooo.com/atcoder/resources/contest-problem.json") as NativeContestProblem[];
    const contestProblemSet = {} as {[id: string]: ContestProblem[]};
    const problemSet = new Set<string>();
    const linkSet = {} as {[id: string]: string};
    for (const problem of problems) problemSet.add(problem.id);
    for (const i in contestProblem) {
        const cur = contestProblem[i];
        if (!problemSet.has(cur.problem_id)) {
            console.log("Problem '" + cur.problem_id + "' belongs to contest '" + cur.contest_id + "' not found.");
            continue;
        }
        if (!contestProblemSet[cur.contest_id]) contestProblemSet[cur.contest_id] = [];
        contestProblemSet[cur.contest_id].push({id: cur.problem_id, index: cur.problem_index});
        linkSet[cur.problem_id] = `https://atcoder.jp/contests/${cur.contest_id}/tasks/${cur.problem_id}`;
    }
    for (const i in data.contests) {
        const contest = data.contests[i];
        if (contestProblemSet[contest.id]) data.contests[i].problems = contestProblemSet[contest.id];
    }
    data.problems = problems;
    for (let i = 0; i < data.problems.length; i++) {
        data.problems[i].link = linkSet[data.problems[i].id] || null;
    }
    return data;
}

export async function getData(): Promise<Data> {
    let data = await resolveContests();
    let problems = await resolveProblems();
    problems = await resolveDifficulties(problems);
    return await mergeData(data, problems);
}

export async function getInfo(): Promise<Info> {
    return {
        title: 'Atcoder',
        icon: 'https://img.atcoder.jp/assets/logo.png',
        link: 'https://atcoder.jp/'
    };
}
