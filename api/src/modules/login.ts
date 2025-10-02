// 3rd party libs
import { addDays, addMinutes } from 'date-fns';
import { compare, hash } from 'bcrypt';
import { address } from 'ip';

// Inc
import { cmsConfig } from '@src/inc/cms-config';
import { prisma } from '@inc/db';

// Interfaces
import { LoginFormInterface } from '../interfaces/login';

// Interfaces
import type { LoginResponseInterface } from '@shared/interfaces/login';
import type { mo_admins as MoAdminsInterface } from '@prisma/client';

export default class Login {
  public async login(attributes: LoginFormInterface): Promise<LoginResponseInterface> {
    if (!attributes.login || !attributes.password) {
      return {
        status: false,
        message: 'Login or password is empty',
      }
    }

    if (!await this.checkBruteForce()) {
      return {
        status: false,
        message: 'Brute force detected, your IP is blocked for 5 minutes',
      };
    }

    // Check if such login exist
    const user = await prisma.mo_admins.findFirst({
      where: {
        login: attributes.login,
        deleted: 0
      }
    });

    // If user not found, we return generic error
    if (!user) {
      return {
        status: false,
        message: 'Login or password is incorrect',
      };
    }

    // If user found, we're checking password
    if (!await this.passwordVerify(attributes.password, user.password)) {
      return {
        status: false,
        message: 'Login or password is incorrect',
      };
    }

    // Update last login and IP using Prisma
    await prisma.mo_admins.update({
      where: {
        id: user.id
      },
      data: {
        lastIp: address(),
        lastLogin: new Date()
      }
    });

    return {
      status: true,
      sessionToken: await this.createToken(user)
    };
  }

  private async createToken(user: MoAdminsInterface): Promise<string> {
    // Create new random session token
    const randomString = `${Math.random()}:${Math.random()}`;
    const convertedSessionToken = await this.passwordConvert(randomString);

    // Remove old auth key, just in case it's in DB
    await this.cleanAuth(user);

    // Create new auth key
    try {
      await prisma.mo_users_auth.create({
        data: {
          timestamp: addDays(new Date(), 7),
          token: convertedSessionToken,
          userId: user.id
        }
      });
    } catch (error) {
      console.error('Error saving auth token', error);

      return '';
    }

    return convertedSessionToken;
  }

  public async cleanAuth(user: MoAdminsInterface): Promise<boolean> {
    try {
      await prisma.mo_users_auth.deleteMany({
        where: {
          userId: user.id
        }
      });
    } catch (error) {
      console.error('Error cleaning auth records', error);

      return false;
    }

    return true;
  }

  private async checkBruteForce(): Promise<boolean> {
    // Remove timed out IPs
    this.timeOutAuthAttempts(true);

    try {
      // Fetching previous attempts to login
      const response = await prisma.mo_users_auth_attempts.findFirst({
        where: {
          ip: address()
        }
      });

      if (response && response.attempts >= cmsConfig.availableLoginAttempts) {
        // Immediately trigger response as false to block off bruteforce
        return false;
      }

      // Atomically try to increment attempts for this IP. updateMany won't throw if no record exists.
      const updateResult = await prisma.mo_users_auth_attempts.updateMany({
        where: {
          ip: address()
        },
        data: {
          attempts: {
            increment: 1
          }
        }
      });

      if (updateResult.count === 0) {
        // No existing record — create the first attempt
        await prisma.mo_users_auth_attempts.create({
          data: {
            attempts: 1,
            timestamp: addMinutes(new Date(), 5), // Timeout after 5 minute
            ip: address()
          }
        });
      }

      // Re-fetch current attempts to check threshold
      const current = await prisma.mo_users_auth_attempts.findFirst({
        where: {
          ip: address()
        }
      });

      if (current && current.attempts >= cmsConfig.availableLoginAttempts) {
        return false;
      }
    } catch (error) {
      console.error('Error fetching auth attempts on bruteforce', error);

      return false;
    }

    return true;
  }

  private async timeOutAuthAttempts(timer: boolean = false): Promise<boolean> {
    try {
      const whereClause: any = {
        ip: address()
      };

      if (timer) {
        whereClause.timestamp = {
          lt: new Date()
        };
      } else {
        whereClause.timestamp = null;
      }

      await prisma.mo_users_auth_attempts.deleteMany({
        where: whereClause
      });
    } catch (error) {
      console.error('Error fetching auth attempts', error);

      return false;
    }

    return true;
  }

  private async passwordConvert(password: string): Promise<string> {
    let returnPassword = '';

    try {
      returnPassword = await hash(password, 10);
    } catch (error) {
      console.error(error);
    }

    return returnPassword;
  }

  private async passwordVerify(userSpecifiedPassword: string, dbPassword: string): Promise<boolean> {
    try {
      const match = await compare(userSpecifiedPassword, dbPassword);

      return !!match;
    } catch (error) {
      console.error('Error verifying password', error);

      return false;
    }
  }
}