// Inc
import { prisma } from '@inc/db';

// Interfaces
import { PermissionsFormInterface } from '../interfaces/permissions';
import { GeneralResponseInterface } from '@shared/interfaces/general';

export default class Permissions {
  public async getPermissions(): Promise<string[]> {
    let returnPermissions = [];

    try {
      // Fetch menu row using Prisma
      const permissions = await prisma.mo.findFirst({
        where: {
          setting: 'menu'
        }
      });

      if (permissions) {
        returnPermissions = JSON.parse(permissions.value);
      }
    } catch (error) {
      console.error(error);
    }

    return returnPermissions;
  }

  public async updatePermissions(attributes: PermissionsFormInterface[]): Promise<GeneralResponseInterface> {
    const formData = this.checkForm(attributes);

    if (formData) {
      return {
        status: false,
        message: formData
      };
    }

    try {
      // Try to update existing row; if none exists, create it
      const updated = await prisma.mo.updateMany({
        where: {
          setting: 'menu'
        },
        data: {
          value: JSON.stringify(attributes)
        }
      });

      if (updated.count === 0) {
        await prisma.mo.create({
          data: {
            setting: 'menu',
            value: JSON.stringify(attributes)
          }
        });
      }
    } catch (error) {
      console.error(error);

      return {
        status: false,
        message: 'Database error, could not update permissions'
      };
    }

    return {
      status: true,
    };
  }

  private checkForm(attributes: Array<PermissionsFormInterface>): string {
    let message = '';

    for (const attribute of attributes) {
      if (!attribute.name) {
        message += `${attribute.key.charAt(0).toUpperCase()}${attribute.key.slice(1)} name is empty<br />`;
      }

      if (!attribute.level) {
        message += `${attribute.key.charAt(0).toUpperCase()}${attribute.key.slice(1)} level is empty<br />`;
      }
    }

    return message;
  }
}