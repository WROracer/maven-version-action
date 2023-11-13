const core = require('@actions/core');
const github = require('@actions/github');

const { exec } = require("child_process");

function proccesVersion(version){
    console.log(`Version : ${version}`)
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
        console.log(`stdout: ${stdout}`);
        proccesVersion(`${stdout}`)
    });
} catch (error) {
    core.setFailed(error.message);
}