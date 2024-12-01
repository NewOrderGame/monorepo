jest.mock('./game-namespace');

jest.mock('./store/encounter-socket-store', () => ({
  getEncounterSocket: jest.fn(() => ({
    emit: jest.fn()
  }))
}));

// const DEFAULT_CHARACTER_STATS: CharacterStats = {
//   outlook: [0, 0, 0],
//   speed: 30,
//   sightRange: 100
// };

describe('Encounter', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runAllTimers();
  });

  describe('', () => {
    test('', () => {});
  });
});
