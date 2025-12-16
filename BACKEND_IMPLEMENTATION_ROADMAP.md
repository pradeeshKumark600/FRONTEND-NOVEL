# 🎯 COMPLETE BACKEND IMPLEMENTATION ROADMAP
## Tamil Novels Platform - NestJS Backend

**Last Updated:** December 16, 2025
**Target Base URL:** `http://localhost:5000/api`
**Database:** PostgreSQL with Prisma ORM
**Framework:** NestJS with TypeScript

---

## 📦 PHASE 0: PROJECT INITIALIZATION

### Step 1: Install NestJS CLI & Create Project

```bash
# Install NestJS CLI globally
npm install -g @nestjs/cli

# Create new project
nest new tamil-novels-backend

# Navigate to project
cd tamil-novels-backend

# Install required dependencies
npm install @nestjs/passport passport passport-jwt @nestjs/jwt bcrypt class-validator class-transformer
npm install @prisma/client
npm install --save-dev prisma @types/passport-jwt @types/bcrypt @types/multer

# Install additional packages
npm install helmet cors dotenv multer @nestjs/platform-express
npm install @nestjs/config @nestjs/swagger swagger-ui-express
```

### Step 2: Initialize Prisma

```bash
# Initialize Prisma with PostgreSQL
npx prisma init --datasource-provider postgresql
```

This creates:
- `prisma/schema.prisma` - Database schema
- `.env` - Environment variables

### Step 3: Configure Environment Variables

**File:** `.env`

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/tamil_novels?schema=public"

# Server
PORT=5000
NODE_ENV=development

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
JWT_EXPIRATION=1h
JWT_REFRESH_EXPIRATION=7d

# CORS
FRONTEND_URL=http://localhost:5173

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

### Step 4: Create Prisma Schema

**File:** `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// User Model
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  lastLogin DateTime?

  readingProgress ReadingProgress[]

  @@map("users")
}

enum Role {
  USER
  EDITOR
  ADMIN
}

// Novel Model
model Novel {
  id            String       @id @default(uuid())
  title         String
  authorName    String       @map("author_name")
  categories    String[]
  novelSummary  String       @map("novel_summary") @db.Text
  coverImage    String?      @map("cover_image")
  status        NovelStatus  @default(DRAFT)
  totalChapters Int          @default(0) @map("total_chapters")
  views         Int          @default(0)
  likes         Int          @default(0)
  bookmarks     Int          @default(0)
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  chapters        Chapter[]
  readingProgress ReadingProgress[]

  @@map("novels")
}

enum NovelStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

// Chapter Model
model Chapter {
  id            String        @id @default(uuid())
  novelId       String        @map("novel_id")
  chapterNumber Int           @map("chapter_number")
  name          String
  title         String
  chapterType   ChapterType   @default(REGULAR) @map("chapter_type")
  thumbnail     String?
  content       String        @db.Text
  status        ChapterStatus @default(DRAFT)
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  novel Novel @relation(fields: [novelId], references: [id], onDelete: Cascade)

  @@unique([novelId, chapterNumber])
  @@map("chapters")
}

enum ChapterType {
  REGULAR
  PROLOGUE
  EPILOGUE
  BONUS
}

enum ChapterStatus {
  DRAFT
  PUBLISHED
  SCHEDULED
}

// Reading Progress Model
model ReadingProgress {
  id          String    @id @default(uuid())
  userId      String    @map("user_id")
  novelId     String    @map("novel_id")
  novelTitle  String    @map("novel_title")
  coverImage  String?   @map("cover_image")
  author      String
  lastChapter Int       @map("last_chapter")
  isCompleted Boolean   @default(false) @map("is_completed")
  startedAt   DateTime  @default(now()) @map("started_at")
  completedAt DateTime? @map("completed_at")
  updatedAt   DateTime  @updatedAt

  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  novel Novel @relation(fields: [novelId], references: [id], onDelete: Cascade)

  @@unique([userId, novelId])
  @@map("reading_progress")
}

// Notification Model
model Notification {
  id        String           @id @default(uuid())
  title     String
  message   String           @db.Text
  type      NotificationType @default(INFO)
  read      Boolean          @default(false)
  createdAt DateTime         @default(now())

  @@map("notifications")
}

enum NotificationType {
  INFO
  SUCCESS
  WARNING
  ERROR
}
```

### Step 5: Run Migrations

```bash
# Generate Prisma client
npx prisma generate

# Create and run migration
npx prisma migrate dev --name init

# Open Prisma Studio to view database
npx prisma studio
```

---

## 🏗️ PHASE 1: PROJECT STRUCTURE SETUP

### Step 1: Create Module Structure

```bash
# Generate modules
nest g module auth
nest g module user
nest g module novel
nest g module chapter
nest g module reading-progress
nest g module admin
nest g module notification
nest g module upload

# Generate controllers
nest g controller auth --no-spec
nest g controller user --no-spec
nest g controller novel --no-spec
nest g controller chapter --no-spec
nest g controller reading-progress --no-spec
nest g controller admin --no-spec
nest g controller notification --no-spec
nest g controller upload --no-spec

# Generate services
nest g service auth --no-spec
nest g service user --no-spec
nest g service novel --no-spec
nest g service chapter --no-spec
nest g service reading-progress --no-spec
nest g service admin --no-spec
nest g service notification --no-spec
nest g service upload --no-spec

# Create common folder structure
mkdir -p src/common/guards
mkdir -p src/common/decorators
mkdir -p src/common/filters
mkdir -p src/common/interceptors
mkdir -p src/config
mkdir -p uploads
```

### Step 2: Project Structure

```
tamil-novels-backend/
├── src/
│   ├── auth/
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   ├── signup.dto.ts
│   │   │   └── refresh-token.dto.ts
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts
│   │   │   └── jwt-refresh.strategy.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── user/
│   │   ├── dto/
│   │   │   └── update-user.dto.ts
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   └── user.module.ts
│   ├── novel/
│   │   ├── dto/
│   │   │   ├── create-novel.dto.ts
│   │   │   └── update-novel.dto.ts
│   │   ├── novel.controller.ts
│   │   ├── novel.service.ts
│   │   └── novel.module.ts
│   ├── chapter/
│   │   ├── dto/
│   │   │   ├── create-chapter.dto.ts
│   │   │   └── update-chapter.dto.ts
│   │   ├── chapter.controller.ts
│   │   ├── chapter.service.ts
│   │   └── chapter.module.ts
│   ├── reading-progress/
│   │   ├── dto/
│   │   │   └── update-progress.dto.ts
│   │   ├── reading-progress.controller.ts
│   │   ├── reading-progress.service.ts
│   │   └── reading-progress.module.ts
│   ├── admin/
│   │   ├── dto/
│   │   ├── admin.controller.ts
│   │   ├── admin.service.ts
│   │   └── admin.module.ts
│   ├── notification/
│   │   ├── dto/
│   │   ├── notification.controller.ts
│   │   ├── notification.service.ts
│   │   └── notification.module.ts
│   ├── upload/
│   │   ├── upload.controller.ts
│   │   ├── upload.service.ts
│   │   └── upload.module.ts
│   ├── common/
│   │   ├── guards/
│   │   │   └── roles.guard.ts
│   │   ├── decorators/
│   │   │   ├── roles.decorator.ts
│   │   │   └── current-user.decorator.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   └── interceptors/
│   │       └── transform.interceptor.ts
│   ├── config/
│   │   └── constants.ts
│   ├── prisma/
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── uploads/
├── .env
├── .env.example
└── package.json
```

---

## 🔐 PHASE 2: AUTHENTICATION MODULE (CRITICAL)

### Step 1: Create Prisma Service

**File:** `src/prisma/prisma.service.ts`

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: any) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
```

**File:** `src/prisma/prisma.module.ts`

```typescript
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

### Step 2: Create Auth DTOs

**File:** `src/auth/dto/signup.dto.ts`

```typescript
import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
```

**File:** `src/auth/dto/login.dto.ts`

```typescript
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
```

**File:** `src/auth/dto/refresh-token.dto.ts`

```typescript
import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
```

### Step 3: Create JWT Strategies

**File:** `src/auth/strategies/jwt.strategy.ts`

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
```

**File:** `src/auth/strategies/jwt-refresh.strategy.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
```

### Step 4: Create Auth Guards

**File:** `src/auth/guards/jwt-auth.guard.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

### Step 5: Create Auth Service

**File:** `src/auth/auth.service.ts`

```typescript
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: signupDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(signupDto.password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: signupDto.email,
        password: hashedPassword,
        name: signupDto.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      success: true,
      data: {
        ...tokens,
        user,
      },
    };
  }

  async login(loginDto: LoginDto) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      success: true,
      data: {
        ...tokens,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    };
  }

  async refreshToken(userId: string, email: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      success: true,
      token: tokens.token,
    };
  }

  async verifyToken(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      success: true,
      user,
    };
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const [token, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRATION || '1h',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
      }),
    ]);

    return {
      token,
      refreshToken,
    };
  }
}
```

### Step 6: Create Auth Controller

**File:** `src/auth/auth.controller.ts`

```typescript
import { Controller, Post, Body, Get, UseGuards, Request, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt-refresh'))
  async refreshToken(@Request() req, @Body() body: RefreshTokenDto) {
    return this.authService.refreshToken(req.user.userId, req.user.email);
  }

  @Get('verify')
  @UseGuards(JwtAuthGuard)
  async verify(@Request() req) {
    return this.authService.verifyToken(req.user.id);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async logout() {
    // In a real app, you might want to blacklist the token
    return { success: true, message: 'Logged out successfully' };
  }
}
```

### Step 7: Configure Auth Module

**File:** `src/auth/auth.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

---

## 👤 PHASE 3: USER MODULE

### Step 1: Create User DTOs

**File:** `src/user/dto/update-user.dto.ts`

```typescript
import { IsString, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;
}
```

### Step 2: Create User Service

**File:** `src/user/user.service.ts`

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      data: user,
    };
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserDto) {
    const updateData: any = {};

    if (updateUserDto.name) {
      updateData.name = updateUserDto.name;
    }

    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true,
      },
    });

    return {
      success: true,
      data: user,
    };
  }
}
```

### Step 3: Create User Controller

**File:** `src/user/user.controller.ts`

```typescript
import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    return this.userService.getProfile(req.user.id);
  }

  @Put('profile')
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateProfile(req.user.id, updateUserDto);
  }
}
```

**File:** `src/user/user.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
```

---

## 📚 PHASE 4: NOVEL MODULE (Public APIs)

### Step 1: Create Novel DTOs

**File:** `src/novel/dto/create-novel.dto.ts`

```typescript
import { IsString, IsArray, IsEnum, IsOptional } from 'class-validator';

enum NovelStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export class CreateNovelDto {
  @IsString()
  title: string;

  @IsString()
  authorName: string;

  @IsArray()
  @IsString({ each: true })
  categories: string[];

  @IsString()
  novelSummary: string;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsEnum(NovelStatus)
  @IsOptional()
  status?: NovelStatus;
}
```

**File:** `src/novel/dto/update-novel.dto.ts`

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateNovelDto } from './create-novel.dto';

export class UpdateNovelDto extends PartialType(CreateNovelDto) {}
```

### Step 2: Create Novel Service

**File:** `src/novel/novel.service.ts`

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NovelService {
  constructor(private prisma: PrismaService) {}

  async getAllPublished(filters?: { genre?: string; author?: string }) {
    const where: any = {
      status: 'PUBLISHED',
    };

    if (filters?.genre) {
      where.categories = {
        has: filters.genre,
      };
    }

    if (filters?.author) {
      where.authorName = {
        contains: filters.author,
        mode: 'insensitive',
      };
    }

    const novels = await this.prisma.novel.findMany({
      where,
      select: {
        id: true,
        title: true,
        authorName: true,
        categories: true,
        coverImage: true,
        totalChapters: true,
        views: true,
        likes: true,
        bookmarks: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      novels,
    };
  }

  async getById(id: string) {
    const novel = await this.prisma.novel.findUnique({
      where: { id },
      include: {
        _count: {
          select: { chapters: true },
        },
      },
    });

    if (!novel) {
      throw new NotFoundException('Novel not found');
    }

    // Increment views
    await this.prisma.novel.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return {
      success: true,
      novel,
    };
  }

  async getChapters(novelId: string) {
    const chapters = await this.prisma.chapter.findMany({
      where: {
        novelId,
        status: 'PUBLISHED',
      },
      select: {
        id: true,
        chapterNumber: true,
        name: true,
        title: true,
        chapterType: true,
        thumbnail: true,
        createdAt: true,
      },
      orderBy: {
        chapterNumber: 'asc',
      },
    });

    return {
      success: true,
      chapters,
    };
  }

  async search(query: string, genre?: string) {
    const where: any = {
      status: 'PUBLISHED',
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { authorName: { contains: query, mode: 'insensitive' } },
        { novelSummary: { contains: query, mode: 'insensitive' } },
      ],
    };

    if (genre) {
      where.categories = { has: genre };
    }

    const novels = await this.prisma.novel.findMany({
      where,
      select: {
        id: true,
        title: true,
        authorName: true,
        categories: true,
        coverImage: true,
        totalChapters: true,
        views: true,
      },
    });

    return {
      success: true,
      novels,
    };
  }
}
```

### Step 3: Create Novel Controller

**File:** `src/novel/novel.controller.ts`

```typescript
import { Controller, Get, Param, Query } from '@nestjs/common';
import { NovelService } from './novel.service';

@Controller('novels')
export class NovelController {
  constructor(private readonly novelService: NovelService) {}

  @Get()
  async getAllPublished(@Query('genre') genre?: string, @Query('author') author?: string) {
    return this.novelService.getAllPublished({ genre, author });
  }

  @Get('search')
  async search(@Query('query') query: string, @Query('genre') genre?: string) {
    return this.novelService.search(query, genre);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.novelService.getById(id);
  }

  @Get(':id/chapters')
  async getChapters(@Param('id') id: string) {
    return this.novelService.getChapters(id);
  }
}
```

**File:** `src/novel/novel.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { NovelService } from './novel.service';
import { NovelController } from './novel.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NovelController],
  providers: [NovelService],
})
export class NovelModule {}
```

---

**This is Part 1 of the roadmap. Continue to next section?**

Total sections:
- ✅ Phase 0-4 (Complete above)
- ⏳ Phase 5: Chapter Module
- ⏳ Phase 6: Reading Progress Module
- ⏳ Phase 7: Admin Module (CRITICAL)
- ⏳ Phase 8: File Upload
- ⏳ Phase 9: Security & Guards
- ⏳ Phase 10: Seed Data
- ⏳ Phase 11: Testing & Deployment

**Character limit reached. Shall I create separate files for remaining phases?**
