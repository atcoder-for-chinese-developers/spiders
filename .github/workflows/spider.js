import fetch from "node-fetch";
import { promises as fs } from "fs";

async function getObject(url) {
    const response = await fetch(url);
    return await response.json();
}

async function resolveContests() {
    let contests = {};
    const data = await getObject("https://kenkoooo.com/atcoder/resources/contests.json");
    for (const i in data) {
        const contest = data[i];
        contests[contest.id] = contest;
        contests[contest.id].problems = {};
    }
    return contests;
}

async function resolveProblems() {
    let problems = {};
    const data = await getObject("https://kenkoooo.com/atcoder/resources/problems.json");
    for (const i in data) {
        const problem = data[i];
        problems[problem.id] = problem;
        problems[problem.id].difficulty = null;
    }
    return problems;
}

async function resolveDifficulties(problems) {
    let resolved = problems;
    const data = await getObject("https://kenkoooo.com/atcoder/resources/problem-models.json");
    for (const i in data) {
        const problem = data[i];
        if (resolved[i] && problem.difficulty) resolved[i].difficulty = problem.difficulty;
    }
    return resolved;
}

async function mergeData(contests, problems) {
    let merged = contests;
    const data = await getObject("https://kenkoooo.com/atcoder/resources/contest-problem.json");
    for (const id in data) {
        const cur = data[id];
        let prb = problems[cur.problem_id];
        prb.problem_index = cur.problem_index;
        merged[cur.contest_id] = prb;
    }
    return merged;
}

async function get() {
    let contests = await resolveContests();
    let problems = await resolveProblems();
    problems = await resolveDifficulties(problems);
    contests = await mergeData(contests, problems);
    let data = {};
    data.abc = {}, data.arc = {}, data.agc = {}, data.ahc = {}, data.others = {};
    for (const id in contests) {
        const contest = contests[id];
        if (id.slice(0, 3) === "abc") data.abc[id] = contest;
        else if (id.slice(0, 3) === "arc") data.arc[id] = contest;
        else if (id.slice(0, 3) === "agc") data.agc[id] = contest;
        else if (id.slice(0, 3) === "ahc") data.ahc[id] = contest;
        else data.others[id] = contest;
    }
    return data;
}

export default async function spider({ github, context, core }) {
    get()
      .then(data => fs.writeFile("data.json", JSON.stringify(data)))
      .then(() => console.log("done"))
      .catch(e => console.log(e));
}
