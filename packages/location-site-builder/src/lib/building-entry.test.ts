import { getBuildingsInSight } from './building-entry';

describe('Building module', () => {
  describe('getBuildingsInSight', () => {
    it('Should return buildings', async () => {
      const coordinates = {
        lat: 46.47700714308479,
        lng: 30.73033690452576
      };

      const buildings = await getBuildingsInSight(coordinates, 30);

      expect(buildings).toBeDefined();
    });
  });
});
