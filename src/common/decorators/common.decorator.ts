import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata('Public', true);
export const Role = (...args: string[]) => SetMetadata('roles', args);
