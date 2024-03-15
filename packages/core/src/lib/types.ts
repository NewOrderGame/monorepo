export enum StatsGroups {
  TICK = 'tick'
}

type TickStats = {
  executionTime: number;
  charactersCount: number;
  encountersCount: number;
};

export type Stats = {
  tick: TickStats[];
};
