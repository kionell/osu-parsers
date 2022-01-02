import fs from 'fs';
import path from 'path';

import { BeatmapDecoder } from 'osu-parsers';
import { BeatmapTester } from './Utils/BeatmapTester';

const rulesets = [
  'Standard',
  'Catch',
  'Mania',
];

rulesets.forEach(async(ruleset) => {
  const beatmapsPath = path.resolve(__dirname, `./Files/${ruleset}/Beatmaps`);
  const beatmapType = ruleset === 'Mania' ? 'specific' : 'converted';

  describe(`${ruleset} ${beatmapType} beatmaps`, () => testRuleset(beatmapsPath));
});

function testRuleset(beatmapsPath: string): void {
  fs.readdirSync(beatmapsPath).forEach((fileName) => {
    testBeatmap(beatmapsPath, fileName);
  });
}

function testBeatmap(beatmapsPath: string, fileName: string): void {
  const filePath = path.resolve(beatmapsPath, fileName);
  const decoded = new BeatmapDecoder().decodeFromPath(filePath, false);

  const beatmapID = fileName.split('.')[0];

  const artist = decoded.metadata.artist;
  const title = decoded.metadata.title;
  const creator = decoded.metadata.creator;
  const version = decoded.metadata.version;

  describe(`${artist} - ${title} (${creator}) [${version}]`, () => {
    const tester = new BeatmapTester(beatmapsPath, beatmapID, decoded);

    tester.test(tester.loadFiles());
  });
}
