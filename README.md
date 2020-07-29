# MediEvil2019-wem-resolver
A Node script for resolving Wwise .wem filenames from their IDs.

# Flags
```text
	-s, --safe,     Run in safemode (don't rename input files)
        --json,     Path to JSON input
    -i, --input,    Path to folder with .wem files
    -h, --help,     Print this help screen
    -v, --version,  Print version to console
        --verbose,  Print additional information to the console
```
		
# Requirements
Requires NodeJS and/or npm to be installed. Requires `SoundBanksInfo.json` from the game files.

# How to use
- Clone/download the repository
- Open a command prompt inside the repository folder (same as `package.json`)
- Run `npm install`
- Run `node index.js --json ./SoundBanksInfo.json --input [path to game .wem files] --safe --verbose`
- Once the desired output is confirmed, run the above command but without the `--safe` flag