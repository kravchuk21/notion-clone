import { prisma } from '../lib/prisma.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { createError } from '../middleware/errorHandler.js';
import { RegisterInput, LoginInput } from '../schemas/auth.schema.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants/index.js';

/** User fields to select for public responses */
const USER_PUBLIC_SELECT = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  createdAt: true,
} as const;

interface AuthResult {
  user: {
    id: string;
    email: string;
    createdAt: Date;
  };
  token: string;
}

/**
 * Registers a new user
 * @throws AppError if email already exists
 */
export async function registerUser(input: RegisterInput): Promise<AuthResult> {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw createError(ERROR_MESSAGES.AUTH.EMAIL_EXISTS, HTTP_STATUS.BAD_REQUEST);
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
    },
    select: USER_PUBLIC_SELECT,
  });

  const token = generateToken({ userId: user.id, email: user.email });

  return { user, token };
}

/**
 * Authenticates a user with email and password
 * @throws AppError if credentials are invalid
 */
export async function loginUser(input: LoginInput): Promise<AuthResult> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw createError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
  }

  const isValid = await verifyPassword(input.password, user.passwordHash);

  if (!isValid) {
    throw createError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
  }

  const token = generateToken({ userId: user.id, email: user.email });

  return {
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    },
    token,
  };
}

/**
 * Gets current user by ID
 * @throws AppError if user not found
 */
export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: USER_PUBLIC_SELECT,
  });

  if (!user) {
    throw createError(ERROR_MESSAGES.USER.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return user;
}

/**
 * Gets user profile by ID
 * @throws AppError if user not found
 */
export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: USER_PUBLIC_SELECT,
  });

  if (!user) {
    throw createError(ERROR_MESSAGES.USER.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return user;
}

/**
 * Updates user profile
 * @throws AppError if user not found
 */
export async function updateUserProfile(userId: string, input: { firstName?: string; lastName?: string }) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw createError(ERROR_MESSAGES.USER.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return prisma.user.update({
    where: { id: userId },
    data: input,
    select: USER_PUBLIC_SELECT,
  });
}

