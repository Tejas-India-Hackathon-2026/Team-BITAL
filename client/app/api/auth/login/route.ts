import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";
import { signToken } from "@/lib/jwt";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid email or password format.",
        },
        {
          status: 400,
        }
      );
    }

    const {
      email,
      password,
    } = result.data;

    const requestedRole = body.role;
    const adminPassword = body.adminPassword;

    /* =====================================================
       USER
    ===================================================== */

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid email or password.",
        },
        {
          status: 401,
        }
      );
    }

    /* =====================================================
       ACCOUNT STATUS
    ===================================================== */

    if (!user.isActive) {
      return NextResponse.json(
        {
          error:
            "Account is deactivated. Please contact support.",
        },
        {
          status: 403,
        }
      );
    }

    /* =====================================================
       ROLE CHECK
    ===================================================== */

    if (
      requestedRole &&
      requestedRole !== user.role
    ) {
      return NextResponse.json(
        {
          error:
            "Selected access level does not match this account.",
        },
        {
          status: 403,
        }
      );
    }

    /* =====================================================
       NORMAL PASSWORD
    ===================================================== */

    const isPasswordValid =
      await bcrypt.compare(
        password,
        user.passwordHash
      );

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          error: "Invalid email or password.",
        },
        {
          status: 401,
        }
      );
    }

    /* =====================================================
       ADMIN SECURITY PASSWORD
    ===================================================== */

    if (user.role === "ADMIN") {
      const configuredAdminPassword =
        process.env.ADMIN_LOGIN_PASSWORD;

      if (!configuredAdminPassword) {
        console.error(
          "ADMIN_LOGIN_PASSWORD is missing."
        );

        return NextResponse.json(
          {
            error:
              "Administrator authentication is not configured.",
          },
          {
            status: 500,
          }
        );
      }

      if (
        !adminPassword ||
        adminPassword !== configuredAdminPassword
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid administrator security password.",
          },
          {
            status: 403,
          }
        );
      }
    }

    /* =====================================================
       JWT
    ===================================================== */

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    /* =====================================================
       RESPONSE
    ===================================================== */

    const response = NextResponse.json(
      {
        message: "Login successful",

        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          ward: user.ward,
          phone: user.phone,
          isActive: user.isActive,
          createdAt:
            user.createdAt.toISOString(),
          updatedAt:
            user.updatedAt.toISOString(),
        },
      },
      {
        status: 200,
      }
    );

    /* =====================================================
       AUTH COOKIE
    ===================================================== */

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure:
        process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}