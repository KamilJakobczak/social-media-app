import { Context } from '../..';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import { JWT_SIGNATURE } from '../keys';

interface SingupArgs {
  credentials: {
    email: string;
    password: string;
  };
  name: string;
  bio: string;
}
interface SinginArgs {
  credentials: {
    email: string;
    password: string;
  };
}
interface UserPayload {
  userErrors: {
    message: string;
  }[];
  token: string | null;
}

export const authResolvers = {
  signup: async (
    _: any,
    { credentials, name, bio }: SingupArgs,
    { prisma }: Context
  ): Promise<UserPayload> => {
    const { email, password } = credentials;
    const isEmail = validator.isEmail(email);

    if (!isEmail) {
      return {
        userErrors: [
          {
            message: 'Invalid email',
          },
        ],
        token: null,
      };
    }
    const isValidPassword = validator.isLength(password, { min: 5 });
    if (!isValidPassword) {
      return {
        userErrors: [{ message: 'Invalid Password' }],
        token: null,
      };
    }

    const isValidName = validator.isLength(name, {
      min: 2,
    });
    const isValidBio = validator.isLength(bio, {
      min: 1,
    });
    if (!isValidName || !isValidBio) {
      return {
        userErrors: [{ message: 'Invalid name or bio' }],
        token: null,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    await prisma.profile.create({
      data: {
        bio: bio,
        userId: user.id,
      },
    });

    return {
      userErrors: [],
      token: JWT.sign(
        {
          userId: user.id,
          email: user.email,
        },
        JWT_SIGNATURE,
        {
          expiresIn: 360000,
        }
      ),
    };
  },
  signin: async (
    _: any,
    { credentials }: SinginArgs,
    { prisma }: Context
  ): Promise<UserPayload> => {
    const { email, password } = credentials;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return {
        userErrors: [{ message: 'Invalid credentials' }],
        token: null,
      };
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        userErrors: [{ message: 'Invalid credentials' }],
        token: null,
      };
    }

    return {
      userErrors: [{ message: '' }],
      token: JWT.sign({ userId: user.id }, JWT_SIGNATURE, {
        expiresIn: 3600000,
      }),
    };
  },
};
