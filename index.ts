import fs from "fs";
import { modules } from "./src/modules.ts";

function deleteDirectory(path: string) {
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

async function build() {
    let siteList = {} as {[id: string]: Info};
    for (let site in modules) {
        console.log('Processing site %s...', site);
        try {
            let siteModule = modules[site];
            let data = await siteModule.getData();
            fs.mkdirSync('dist/' + site);
            fs.writeFileSync('dist/' + site + '/data.json', JSON.stringify(data));
            siteList[site] = await siteModule.getInfo();
        } catch (e) {
            console.log(e);
        } finally {
            console.log('Done.');
        }
    }
    fs.writeFileSync('dist/list.json', JSON.stringify(siteList));
}

makeDist();
build();

