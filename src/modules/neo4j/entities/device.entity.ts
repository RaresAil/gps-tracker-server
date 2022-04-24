import { Record } from 'neo4j-driver';

import { Permission } from '../../device/interfaces/permission.enum';

export class Device {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly permissions: Permission[],
    public readonly key: string,
    public readonly createdAt: Date,
  ) {}

  static fromRecord(record?: Record): Device | null {
    const node = record?.get('node')?.properties;
    if (!node) {
      return null;
    }

    return new Device(
      node.id,
      node.name,
      node.permissions,
      node.key,
      new Date(record?.get('createdAt')),
    );
  }
}
