import fetch from "node-fetch";

async function getObject(url: string) {
    const response = await fetch(url);
    return await response.json();
}

async function resolveContests(): Promise<Data> {
    let data = {
        categories: {
            abc: { title: "ABC", color: "#00f", contests: [] },
            arc: { title: "ARC", color: "#ff8000", contests: [] },
            agc: { title: "AGC", color: "#ff1818", contests: [] },
            abc_like: { title: "ABC Like", color: "#00f", contests: [] },
            arc_like: { title: "ARC Like", color: "#ff8000", contests: [] },
            agc_like: { title: "AGC Like", color: "#ff1818", contests: [] },
            ahc: { title: "AHC", color: "#181818", contests: [] },
            others: { title: "其他", color: "#181818", contests: [] }
        },
        contests: {}
    } as Data;
    const contests = await getObject("https://kenkoooo.com/atcoder/resources/contests.json") as NativeContest[];
    for (const i in contests) {
        const contest = contests[i], id = contest.id;
        data.contests[id] = { title: contest.title, problems: {}, link: "https://atcoder.jp/contests/" + contest.id } as Contest;
        let prefix = id.slice(0, 3);
        if (prefix === "abc" || prefix === "arc" || prefix === "agc" || prefix === "ahc") data.categories[prefix].contests.push(id);
    	else {
            try {
                let ratedRange = contest.rate_change, rightRangeStr = ratedRange.split("~")[1];
                if (rightRangeStr == " " || ratedRange == "All") rightRangeStr = "9999";
                if (!rightRangeStr) data.categories.others.contests.push(id);
                let rightRange = parseInt(rightRangeStr);
                if (rightRange < 2000) data.categories.abc_like.contests.push(id);
                else if (rightRange < 2800) data.categories.arc_like.contests.push(id);
                else data.categories.agc_like.contests.push(id);
	        } catch {
                 console.log("Failed to filter " + id + " failed.");
                 data.categories.others.contests.push(id);
	        }
	    }
    }
    return data;
}

async function resolveProblems(): Promise<ProblemSet> {
    let problems = {} as ProblemSet;
    const data = await getObject("https://kenkoooo.com/atcoder/resources/problems.json") as NativeProblem[];
    for (const i in data) {
        const problem = data[i];
        problems[problem.id] = { index: problem.problem_index, title: problem.name, link: null, difficulty: null };
    }
    return problems;
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
async function resolveDifficulties(problems: ProblemSet): Promise<ProblemSet> {
    const data = await getObject("https://kenkoooo.com/atcoder/resources/problem-models.json") as NativeDifficultySet;
    for (const i in data) {
        const problem = data[i];
        if (problems[i] && problem.difficulty) {
            problems[i].difficulty = resolveDifficulty(problem.difficulty);
        }
    }
    return problems;
}

async function mergeData(data: Data, problems: ProblemSet): Promise<Data> {
    const contestProblem = await getObject("https://kenkoooo.com/atcoder/resources/contest-problem.json") as NativeContestProblem[];
    for (const i in contestProblem) {
        const cur = contestProblem[i];
        let problem = problems[cur.problem_id];
        if (problem == undefined) {
            console.log("Problem '" + cur.problem_id + "' belongs to contest '" + cur.contest_id + "' not found.");
            continue;
        }
        data.contests[cur.contest_id].problems[cur.problem_id] = Object.assign({}, problem);
        data.contests[cur.contest_id].problems[cur.problem_id].index = cur.problem_index;
        data.contests[cur.contest_id].problems[cur.problem_id].link = "https://atcoder.jp/contests/" + cur.contest_id + "/tasks/" + cur.problem_id;
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
        icon: 'https://img.atcoder.jp/assets/logo.png'
    };
}
