import { readdirSync, readFileSync, statSync, unlinkSync } from 'fs';

const ELEMENTS_TO_DISPLAY = 120;

type TimelineChunk = {
  timestamp: number;
  executionTimeMin: number;
  executionTimeAvg: number;
  executionTimeMax: number;
  charactersMin: number;
  charactersAvg: number;
  charactersMax: number;
  encountersMin: number;
  encountersAvg: number;
  encountersMax: number;
};

type QuantityChart = {
  quantity: number;
  min: number;
  avg: number;
  max: number;
};

type TickTimeStats = {
  timeline: TimelineChunk[];
  charactersChart: QuantityChart[];
  encountersChart: QuantityChart[];
};

export function parseStats(
  rawStats: number[][],
  timestamp: number
): TimelineChunk {
  const executionTime = rawStats.map((stat) => stat[0]);
  const characters = rawStats.map((stat) => stat[1]);
  const encounters = rawStats.map((stat) => stat[2]);

  const executionTimeMin = Math.min(...executionTime);
  const executionTimeAvg =
    executionTime.reduce((a, b) => a + b, 0) / executionTime.length;
  const executionTimeMax = Math.max(...executionTime);

  const charactersMin = Math.min(...characters);
  const charactersAvg =
    characters.reduce((a, b) => a + b, 0) / characters.length;
  const charactersMax = Math.max(...characters);

  const encountersMin = Math.min(...encounters);
  const encountersAvg =
    encounters.reduce((a, b) => a + b, 0) / encounters.length;
  const encountersMax = Math.max(...encounters);

  return {
    timestamp: Number(timestamp),
    executionTimeMin,
    executionTimeAvg,
    executionTimeMax,
    charactersMin,
    charactersAvg,
    charactersMax,
    encountersMin,
    encountersAvg,
    encountersMax
  };
}

export function getRawStatsFromFile(file: string): number[][] {
  const b: Buffer = readFileSync(file);
  const s: string = b.toString();
  const al: string[] = s.split('\n');
  return al.map((line) => line.split(',').map((value) => Number(value)));
}

export function getTickTimeStats(statsDir: string): TickTimeStats {
  const files: string[] = readdirSync(statsDir);

  const filesWithCTime = files
    .map((file) => ({
      name: file,
      mtime: statSync(`${statsDir}/${file}`).mtime
    }))
    .sort((a, b) => a.mtime.getTime() - b.mtime.getTime());

  const filesToDisplay = filesWithCTime
    .slice(-ELEMENTS_TO_DISPLAY)
    .map((file) => file.name);

  const filesToDelete = filesWithCTime.slice(0, -ELEMENTS_TO_DISPLAY);
  filesToDelete.forEach((file) => unlinkSync(`${statsDir}/${file.name}`));

  let allRawStats: number[][] = [];

  const timeline = filesToDisplay.reduce(
    (result, timestamp): TimelineChunk[] => {
      const rawStats = getRawStatsFromFile(`${statsDir}/${timestamp}`);
      const stats = parseStats(rawStats, Number(timestamp));
      allRawStats = allRawStats.concat(rawStats);
      return [...result, stats];
    },
    []
  );

  return {
    timeline,
    charactersChart: calculateQuantityChart(allRawStats, 1),
    encountersChart: calculateQuantityChart(allRawStats, 2)
  };
}

export function calculateQuantityChart(
  stats: number[][],
  index: number
): QuantityChart[] {
  const statsMap = new Map<number, number[]>();
  stats.forEach((stat) => {
    if (statsMap.has(stat[index])) {
      statsMap.get(stat[index]).push(stat[0]);
    } else {
      statsMap.set(stat[index], []);
    }
  });

  return Array.from(statsMap.keys()).map((key) => {
    const stat: number[] = statsMap.get(key);

    return {
      quantity: key,
      min: Math.min(...stat),
      avg: stat.reduce((a, b) => a + b, 0) / stat.length,
      max: Math.max(...stat)
    };
  });
}
