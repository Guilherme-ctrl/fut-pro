import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

export type JwtPayload = {
  sub: string;
  role: UserRole;
  athleteId: string | null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: {
    sub: string;
    role: UserRole;
  }): Promise<JwtPayload> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    let athleteId: string | null = null;
    if (user.role === UserRole.ATHLETE) {
      const athlete = await this.prisma.athlete.findFirst({
        where: { userId: user.id },
      });
      athleteId = athlete?.id ?? null;
      if (!athleteId) {
        throw new UnauthorizedException({
          code: 'UNAUTHORIZED',
          message: 'Atleta sem perfil vinculado',
        });
      }
    }
    return { sub: user.id, role: user.role, athleteId };
  }
}
