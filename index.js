/**
 * medievil2019_wemjsontool
 * Renames MediEvil 2019 .wem files to match src filenames from JSON
*/

// Includes
const minimist = require('minimist');
const fs = require("fs");

// Build-time constants
const DEBUG = false;
const VERSION = "1.0.0";
const FLAGS = {
    VERSION: "version",
    SAFE_MODE: "safe",
    HELP: "help",
    JSON_PATH: "json",
    VERBOSE: "verbose",
    INPUT_FOLDER: "input"
}

// Run-time constants
const start = Date.now();
const args = minimist(
    process.argv.slice(2),
    {
        alias: {
            h: FLAGS.HELP,
            v: FLAGS.VERSION,
            s: FLAGS.SAFE_MODE,
            j: FLAGS.JSON_PATH,
            i: FLAGS.INPUT_FOLDER
        }
    }
);

function hasFlag(_flag) {
    return Boolean(args[_flag]);
}

function getFlagData(_flag) {
    return args[_flag] || null;
}

function main() {
    if(DEBUG) {
        console.log(args);
    }

    if(hasFlag(FLAGS.VERSION)) {
        console.log(VERSION);
        return;
    } else if(hasFlag(FLAGS.HELP)) {
        console.log(`
medievil2019_wemjsontool
Usage: node index.js [flags]
Flags:
    -s, --safe,     Run in safemode (don't rename input files)
        --json,     Path to JSON input
    -i, --input,    Path to folder with .wem files
    -h, --help,     Print this help screen
    -v, --version,  Print version to console
`
        );
        return;
    }

    if(!hasFlag(FLAGS.SAFE_MODE)) {
        console.warn("Running in unsafe mode; files will be renamed!");
    }
    if(!hasFlag(FLAGS.JSON_PATH)) {
        throw new Error("Must provide path to input JSON file.")
    }
    if(!hasFlag(FLAGS.INPUT_FOLDER)) {
        throw new Error("Must provide path to folder containing input files.")
    }

    if(!fs.existsSync(getFlagData(FLAGS.INPUT_FOLDER))) {
        throw new Error(`Path to input folder (${getFlagData(FLAGS.INPUT_FOLDER)}) is invalid!`);
    }
    if(!fs.existsSync(getFlagData(FLAGS.JSON_PATH))) {
        throw new Error(`Path to input JSON (${getFlagData(FLAGS.JSON_PATH)}) is invalid!`);
    }

    // checks done, proceed
    const jsonBuffer = fs.readFileSync(getFlagData(FLAGS.JSON_PATH), "utf8");
    let json;
    try {
        json = JSON.parse(jsonBuffer);
    } catch(err) {
        console.error("Failed to parse input JSON file!");
        throw err;
    }

    // json.SoundBanksInfo.StreamedFiles = [] = "test"
    // test.ShortName = "Weapons\\Weapon_Sword_Material_Impacts\\WPN_Sword_Hit_Foliage_A_12.wav"
    if(!json.SoundBanksInfo || !json.SoundBanksInfo.StreamedFiles) {
        throw new Error("Input JSON is valid JSON but not valid for this program; missing SoundBanksInfo.StreamedFiles properties");
    }

    const dirList = fs.readdirSync(getFlagData(FLAGS.INPUT_FOLDER));
    for(let i = 0; i < dirList.length; i++) {
        if(dirList[i].substr(dirList[i].length - 3) !== "wem") continue;
        const filepath = getFlagData(FLAGS.INPUT_FOLDER) + "/" + dirList[i];
        const filename = dirList[i].substr(0, dirList[i].lastIndexOf(".wem"));
        const jsonData = json.SoundBanksInfo.StreamedFiles.find((e) => {
            return e["Id"] === filename;
        });

        if(!jsonData) {
            console.warn(`Unable to find filename for file ${dirList[i]}`);
            continue;
        }

        const realname = jsonData["ShortName"].substr(
            jsonData["ShortName"].lastIndexOf("\\") + 1
        );
        if(hasFlag(FLAGS.VERBOSE))
            console.log(`${filename} becomes ${realname}`);
        if(!hasFlag(FLAGS.SAFE_MODE)) {
            fs.renameSync(filepath, getFlagData(FLAGS.INPUT_FOLDER) + "/" + realname);
        }
        // if(DEBUG) {
        //     console.log(`Would have renamed ${filepath} to ${getFlagData(FLAGS.INPUT_FOLDER) + "/" + realname}`);
        // }
    }

    const end = Date.now();
    console.log("Finished in %dms", end - start);
}

main();
