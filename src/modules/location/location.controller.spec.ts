import { Test, TestingModule } from '@nestjs/testing';
import { Permission } from '../device/interfaces/permission.enum';

import { LocationController } from './location.controller';
import { LocationService } from './location.service';

describe('LocationController', () => {
  let controller: LocationController;

  const createMock = jest.fn();
  const findAllMock = jest.fn();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [
        {
          provide: LocationService,
          useValue: {
            create: createMock,
            findAll: findAllMock,
          },
        },
      ],
    }).compile();

    controller = module.get<LocationController>(LocationController);
  });

  afterEach(() => {
    createMock.mockRestore();
    findAllMock.mockRestore();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create', async () => {
    const device = {
      id: '123',
      name: '',
      permissions: [Permission.Location],
      key: '',
      createdAt: new Date(),
    };

    const location = {
      name: 'test',
      description: 'test',
      lat: 123,
      lng: 123,
    };

    createMock.mockReturnValue(location);
    const response = await controller.create(device, location);

    expect(createMock).toHaveBeenCalledWith(location, device.id);
    expect(response).toEqual(location);
  });
});
