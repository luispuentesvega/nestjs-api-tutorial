import { ForbiddenException, Injectable } from '@nestjs/common';
import { User, Bookmark } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor (private prisma: PrismaService) { }

  async signin(dto: AuthDto) {
    //find the user byu email
    const user: User = await this.prisma.user.findFirst({
      where: { email: dto.email },
    });
    //if user does not exist throw exception
    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }

    //compare password
    const pwdMatches = await argon.verify(user.hash, dto.password);
    //if password incorrect throw exceptiom
    if (!pwdMatches) {
      throw new ForbiddenException('Credentials incorrect 2');
    }

    delete user.hash;

    //return user
    return user;
  }

  async signup(dto: AuthDto) {
    // generate password
    const hash = await argon.hash(dto.password);

    //save the new user
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });
      // return the saved user
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }
}
