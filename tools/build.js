const { exec } = require("child_process");
const fs = require("fs");
const rimraf = require("rimraf");

rimraf.sync("dist");

exec("babel src -d dist", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    fs.copyFileSync("README.md", "dist/README.md");
    fs.copyFileSync("LICENSE", "dist/LICENSE");
    fs.copyFileSync("package.json", "dist/package.json");
});
