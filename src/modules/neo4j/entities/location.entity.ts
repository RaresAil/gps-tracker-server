import { Record } from 'neo4j-driver';

export class Location {
  constructor(
    public readonly id: string,
    public readonly device: string,
    public readonly at: Date,
    public readonly lng: number,
    public readonly lat: number,
  ) {}

  static fromRecord(record?: Record): Location | null {
    const node = record?.get('node')?.properties;
    if (!node) {
      return null;
    }

    return new Location(
      node.id,
      node.device,
      new Date(record?.get('at')),
      node.lng,
      node.lat,
    );
  }
}
