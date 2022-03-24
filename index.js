
import { Command } from 'commander';
import fs from 'fs';
import packageJson from './package.json';

const program = new Command();
const fsProm = fs.promises

program.version(packageJson.version, '-v, --vers', 'output the current version');

function getValue (line, s) {
    const fv = line.indexOf(s);
    if (fv !== -1) {
        const fromIndex = line.substring(fv)
        const getFirst = fromIndex.split(',')
        if (getFirst && getFirst.length) {
            const getFirstC = getFirst[0]

            const d = getFirstC.split('=');
            const name = d[0]?.trim();
            const value =d[1]?.trim();
            return { name, value }

        }
    }
    return false
}

program
    .command('get')
    .action(() => {
        fs.unlinkSync('./results.txt')
        const allFileContents = fs.readFileSync('input.txt', 'utf-8');
        allFileContents.split(/\r?\n/).forEach(async (line) => {
            const RSRP = getValue(line, 'RSRP')
            const RSRQ = getValue(line, 'RSRQ')
            const SINR = getValue(line, 'SINR')
            const RSSI = getValue(line, 'RSSI')
            if(RSRP){
                const results = `RSRP,${RSRP.value},RSRQ,${RSRQ.value},SINR,${SINR.value},RSSI,${RSSI.value}\n`


                await fsProm.appendFile(
                    './results.txt', results
                );
             }

        });
    });


program.parse(process.argv);
