const core = require('@actions/core');
const github = require('@actions/github');

const { exec } = require("child_process");

function processVersion(version){
    console.log(`Version : ${version}`)
    let minor = version.split(".")[1];
    let major = version.split(".")[0];
    let patch = version.split(".")[2];
    let snapshot = version.split("-");

    patch++;


    let newVersion = major+"."+minor+"."+patch+"-"+snapshot;
    let newRelease = major+"."+minor+"."+patch;

    //create new Branch "release/version" and commit

    exec(`git branch release/${newRelease}`,(error, stdout, stderr) => {
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
    exec(`git checkout release/${newRelease}`,(error, stdout, stderr) => {
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

    exec(`mvn versions:set -DnewVersion=${newRelease}`,(error, stdout, stderr) => {
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

    exec(`git commit -m "[ACTION] Release version ${newRelease}"`,(error, stdout, stderr) => {
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

    exec(`git push -u origin -m release/${newRelease}`,(error, stdout, stderr) => {
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