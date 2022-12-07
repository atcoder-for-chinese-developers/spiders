import fetch from "node-fetch";
import fs from "fs";

function deleteDirectory(path) {
	if (fs.existsSync(path)) {
		let list = fs.readdirSync(path);
		list.forEach(file => {
			let filePath = path + '/' + file;
			if (fs.statSync(filePath).isFile()) fs.unlinkSync(filePath);
			else deleteDirectory(filePath);
		});
		fs.rmdirSync(path);
	}
}

function makeDist() {
	deleteDirectory('dist');
	fs.mkdirSync('dist');
}

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
        if (prb == undefined) {
            console.log("Problem '" + cur.problem_id + "' belongs to contest '" + cur.contest_id + "' not found.");
            continue;
        }
        merged[cur.contest_id].problems[cur.problem_id] = Object.assign({}, prb);
        merged[cur.contest_id].problems[cur.problem_id].problem_index = cur.problem_index;
    }
    return merged;
}

async function get() {
    let contests = await resolveContests();
    let problems = await resolveProblems();
    problems = await resolveDifficulties(problems);
    contests = await mergeData(contests, problems);
    let data = {
        abc: {},
        arc: {},
        agc: {},
        ahc: {},
        abc_like: {},
	arc_like: {},
	agc_like: {},
        others: {}
    };
    for (const id in contests) {
        const contest = contests[id];
        if (id.slice(0, 3) === "abc") data.abc[id] = contest;
        else if (id.slice(0, 3) === "arc") data.arc[id] = contest;
        else if (id.slice(0, 3) === "agc") data.agc[id] = contest;
        else if (id.slice(0, 3) === "ahc") data.ahc[id] = contest;
	else {
            try {
                let ratedRange = contest.rate_change, rightRange = ratedRange.split("~")[1];
                if (rightRange == " " || ratedRange == "All") rightRange = "9999";
                if (rightRange < 2000) data.abc_like[id] = contest;
                else if (rightRange < 2800) data.arc_like[id] = contest;
                else if (rightRange != undefined) data.agc_like[id] = contest;
                else data.others[id] = contest;
	    } catch {
                 console.log("Failed to filter " + id + " failed.");
                 data.others[id] = contest;
	    }
	}
    }
    return data;
}

makeDist();

get()
    .then(data => fs.promises.writeFile("dist/data.json", JSON.stringify(data)))
    .then(() => console.log("done"))
    .catch(e => console.log(e));
