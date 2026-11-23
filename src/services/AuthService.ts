import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IsNull, Repository } from "typeorm";
import { authConfig } from "../config/auth";
import { CreateUserDTO } from "../dto/CreateUserDTO";
import { RefreshToken } from "../entities/RefreshToken";
import { User } from "../entities/User";
import { UnauthenticatedError } from "../graphql/errors";
import { validateDto } from "../utils/validate";
import { UserService } from "./UserService";

export type AuthPayload = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

const hashToken = (token: string) => crypto.createHash("sha256").update(token).digest("hex");

export class AuthService {
  constructor(
    private userService: UserService,
    private refreshTokenRepository: Repository<RefreshToken>
  ) {}

  async register(data: CreateUserDTO): Promise<AuthPayload> {
    const user = await this.userService.createUser(data);
    return this.issueTokens(user);
  }

  async login(email: string, password: string): Promise<AuthPayload> {
    const user = await this.userService.getUserByEmail(email);
    const valid = user ? await bcrypt.compare(password, user.password) : false;
    if (!user || !valid) {
      throw new UnauthenticatedError("Invalid email or password");
    }
    return this.issueTokens(user);
  }

  async refresh(rawToken: string): Promise<AuthPayload> {
    const stored = await this.refreshTokenRepository.findOne({
      where: { tokenHash: hashToken(rawToken) },
      relations: ["user"],
    });

    if (!stored) {
      throw new UnauthenticatedError("Invalid refresh token");
    }

    // Reused revoked token: assume it leaked and revoke all sessions
    if (stored.revokedAt) {
      await this.revokeAllForUser(stored.user.id);
      throw new UnauthenticatedError("Invalid refresh token");
    }

    if (stored.expiresAt <= new Date()) {
      throw new UnauthenticatedError("Refresh token expired");
    }

    stored.revokedAt = new Date();
    await this.refreshTokenRepository.save(stored);
    return this.issueTokens(stored.user);
  }

  async logout(rawToken: string): Promise<boolean> {
    await this.refreshTokenRepository.update(
      { tokenHash: hashToken(rawToken), revokedAt: IsNull() },
      { revokedAt: new Date() }
    );
    return true;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    const user = await this.userService.getUserById(userId);
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      throw new UnauthenticatedError("Current password is incorrect");
    }

    await validateDto(CreateUserDTO, { password: newPassword }, { partial: true });
    await this.userService.updateUserPassword(userId, newPassword);
    await this.revokeAllForUser(userId);
    return true;
  }

  private async issueTokens(user: User): Promise<AuthPayload> {
    const accessToken = jwt.sign(
      { sub: user.id, role: user.role },
      authConfig.accessTokenSecret,
      { expiresIn: authConfig.accessTokenExpiresIn }
    );

    const refreshToken = crypto.randomBytes(48).toString("base64url");
    const expiresAt = new Date(Date.now() + authConfig.refreshTokenTtlDays * 24 * 60 * 60 * 1000);

    await this.refreshTokenRepository.save(
      this.refreshTokenRepository.create({ tokenHash: hashToken(refreshToken), user, expiresAt })
    );

    return { accessToken, refreshToken, user };
  }

  private async revokeAllForUser(userId: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { user: { id: userId }, revokedAt: IsNull() },
      { revokedAt: new Date() }
    );
  }
}
