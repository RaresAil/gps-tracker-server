import { CustomDecorator, SetMetadata } from '@nestjs/common';

import { Permission } from '../modules/device/interfaces/permission.enum';

export const REQUIRE_PERMISSION = 'REQUIRE_PERMISSION_KEY';

export const RequirePermissions = (
  ...permissions: Permission[]
): CustomDecorator<string> => SetMetadata(REQUIRE_PERMISSION, permissions);
