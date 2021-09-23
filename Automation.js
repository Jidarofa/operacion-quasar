const npm = require('npm');
const argv = require('yargs').argv;
const fs = require('fs');

npm.load(() => {
    let d = "products/settings.json";
    const projectSettingsRaw = fs.readFileSync(d);
    const projectSettings = JSON.parse(projectSettingsRaw);
    npm.run(argv.debug ? "run-debug" : projectSettings.script, ...getParameters(projectSettings.script, "products/**/", projectSettings.tests.find(e => e.name === argv.t).options));
});

function getParameters(type, directory, content) {
    let result = getScenariosArray(content.scenarios, directory);

    return result;
}

function getScenariosArray(scenarios, directory){
    let result = [];

    if(scenarios.names) {
        scenarios.names.forEach(element => {
            result.push("-n " + element);
        });
    }

    if(scenarios.files) {
        scenarios.files.forEach(element => {
            result.push(directory + element);
        });
    }

    return result;
}