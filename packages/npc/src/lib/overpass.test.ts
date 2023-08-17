import {
  getBuildingsInSight,
  getRandomHouseEntryCoordinates
} from './overpass';
import logger from './utils/logger';

describe('Overpass module', () => {
  test(
    'getBuildingsInSight. Should return the buildings in sight from the' +
      ' Overpass API',
    (done) => {
      getBuildingsInSight(
        {
          lat: 46.47698867216693,
          lng: 30.730540752410892
        },
        100
      ).then((data) => {
        expect(data).toBeDefined();
        done();
      });
    }
  );

  test(`getRandomSpawnPoint. Should return random spawn point in character's sight`, async () => {
    const spawnCoordinates = await getRandomHouseEntryCoordinates(
      {
        lat: 46.47698867216693,
        lng: 30.730540752410892
      },
      100
    );

    logger.info(spawnCoordinates, 'Spawn Coordinates');
  });
});
