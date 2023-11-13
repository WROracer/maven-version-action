const core = require('@actions/core');
const github = require('@actions/github');

const { exec,execSync } = require("child_process");

function processVersion(version){
    console.log(`Version : ${version}`)
    let minor = version.split(".")[1];
    let major = version.split(".")[0];
    let patch = version.split(".")[2].split("-")[0];
    let snapshot = version.split("-");




    let newRelease = major+"."+minor+"."+patch;
    patch++;
    let newVersion = major+"."+minor+"."+patch+"-"+snapshot;

    //create new Branch "release/version" and commit
    console.log(github.context.repo.repo)

    const url = core.getInput('url');

    execSync(`git remote set-url origin ${url}`)

    //  git config --global user.email "you@example.com"
    //   git config --global user.name "Your Name"
    execSync(`git config --global user.name "Action Bot"`)
    execSync(`git config --global user.name "Action-Bot@github.com"`)

    execSync(`git branch release/${newRelease}`,(error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    })
    execSync(`git checkout release/${newRelease}`,(error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    })

    execSync(`mvn versions:set -DnewVersion=${newRelease}`,(error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    })

    execSync(`git add ./\\pom.xml`,(error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    })

    execSync(`git commit -m \"[ACTION] Release version ${newRelease}\"`,(error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    })

    execSync(`git push -u origin release/${newRelease}`,(error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    })

    //commit with newVersion in master

}

try {
    /*// `who-to-greet` input defined in action metadata file
    const nameToGreet = core.getInput('who-to-greet');
    console.log(`Hello ${nameToGreet}!`);
    const time = (new Date()).toTimeString();
    core.setOutput("time", time);
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);*/
    // mvn help:evaluate -Dexpression=project.version -q -DforceStdout

    exec("mvn help:evaluate -Dexpression=project.version -q -DforceStdout", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        processVersion(`${stdout}`)
    });
} catch (error) {
    core.setFailed(error.message);
}