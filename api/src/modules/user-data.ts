// Inc
import { prisma } from '@inc/db';
//import * as config from '../inc/config.json';

// Modules
import LoginModule from './login';
//import Admins from './admins';

// Entities
/*import { Mo } from '../../db/entity/mo';
import { MoMultisite } from '../../db/entity/moMultisite';
import { MoAdmins } from '../../db/entity/moAdmins';*/

// Interfaces
//import { PasswordFormInterface, MultisiteInterface } from '../interfaces/user-data';
import { MenuInterface } from '@src/interfaces/user-data';
import { AdminInterface } from '@shared/interfaces/admins';

export default class UserData {
  private loginModule = new LoginModule();

  public async fetchMenu(user: AdminInterface): Promise<MenuInterface[]> {
    // Fetching menu json from database (Prisma)
    const dbMenu = await prisma.mo.findFirst({
      where: {
        setting: 'menu'
      }
    });

    if (!dbMenu || !dbMenu.value) {
      return [];
    }

    // Converting menu to proper json
    let jsonMenu: any[] = [];

    try {
      jsonMenu = JSON.parse(dbMenu.value);
    } catch (err) {
      // If parsing fails, return empty menu
      console.error('Failed to parse menu JSON:', err);

      return [];
    }

    const returnMenu: MenuInterface[] = [];

    for (const m of jsonMenu) {
      // Check if user level is allowing him to access the page
      if (m.level <= user.level || (user.level === 0 && Array.isArray(user.customAccess) && user.customAccess.indexOf(m.key) >= 0)) {
        const menuItem: any = {
          url: `/${m.key}`,
          title: m.name,
          icon: m.iconClasses
        };

        // Check if there are subpages
        if (m.subCategories && m.subCategories.length) {
          menuItem.sublinks = [];

          for (const subMenu of m.subCategories) {
            // Check if user level is allowing access to the sub page
            if (subMenu.level <= user.level || (user.level === 0 && Array.isArray(user.customAccess) && user.customAccess.indexOf(subMenu.key) >= 0)) {
              menuItem.sublinks.push({
                url: `/${subMenu.key}`,
                title: subMenu.name,
                icon: subMenu.iconClasses
              });
            }
          }
        }

        returnMenu.push(menuItem);
      }
    }

    return returnMenu;
  }

  public async logout(user: AdminInterface): Promise<void> {
    // In case user is empty we do nothing
    if (!user || !user.id) {
      return;
    }

    // Otherwise we're fetching user from database
    const admin = await prisma.mo_admins.findUnique({
      where: {
        id: user.id
      }
    });

    if (!admin) {
      return;
    }

    await this.loginModule.cleanAuth(admin);

    return;
  }

  /*public async updatePassword(attributes: PasswordFormInterface): Promise<boolean> {
    if (!await this.checkFormPassword(attributes)) {
      return false;
    }

    try {
      const admin = await getConnection().getRepository(MoAdmins)
        .findOne({
          id: this.user.id
        });

      admin.password = await Admins.passwordConvert(attributes.newPass);

      await getConnection().getRepository(MoAdmins).save(admin);
    } catch (error) {
      console.error(error);

      return false;
    }

    return true;
  }

  private async checkFormPassword(attributes: PasswordFormInterface): Promise<boolean> {
    if (!attributes.currentPass) {
      this.message += 'Current Password is empty<br />';
      this.fields.push('currentPass');
    }

    if (!attributes.newPass) {
      this.message += 'New Password is empty<br />';
      this.fields.push('newPass');
    }

    if (!attributes.repeatPass) {
      this.message += 'Repeat Password is empty<br />';
      this.fields.push('repeatPass');
    }

    if (attributes.newPass.length < config.minPasswordLength) {
      this.message += `New Password must be at least ${config.minPasswordLength} characters long<br />`;
      this.fields.push('newPass');
    }

    if (attributes.newPass !== attributes.repeatPass) {
      this.message += 'Passwords does not match<br />';
      this.fields.push('repeatPass');
    }

    const checkPassword = await getConnection().getRepository(MoAdmins)
      .findOne({
        id: this.user.id
      });

    if (!await Login.passwordVerify(attributes.currentPass, checkPassword.password.replace('$2y$', '$2a$'))) {
      this.message += 'Current password is incorrect<br />';
      this.fields.push('currentPass');
    }

    // In case if there are any messages, return false
    if (this.message) {
      return false;
    }

    return true;
  }*/
}