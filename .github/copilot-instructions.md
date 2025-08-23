# MovieClub Development Instructions

Always reference these instructions first and fallback to additional search or bash commands only when you encounter unexpected information that does not match the info here.

MovieClub is a Next.js 15.3.0 TypeScript web application for hosting remote movie clubs. Users can maintain shortlists of movie candidates, raffle movies of the week, and maintain tierlists of watched movies. The app integrates with Discord authentication, The MovieDB (TMDB) API for movie data, and optionally with Radarr for automated downloading.

## Working Effectively

### Initial Setup and Dependencies

- Install pnpm globally: `npm install -g pnpm`
- Install all dependencies: `pnpm install --frozen-lockfile` -- takes 45 seconds. NEVER CANCEL.
- Create `.env` file from `.env.sample` template with required API keys and database connection

### Development Environment

- Start development server: `pnpm dev` -- starts in 1.3 seconds using Turbopack
- Access application at: http://localhost:3000
- Uses PostgreSQL database with Prisma ORM (not MongoDB despite old README reference)

### Build and Production

- **IMPORTANT**: Production builds require internet access for Google Fonts and Prisma binaries
- Build command: `pnpm build` -- may fail in restricted network environments
- For deployment environments without restrictions, builds typically take 2-3 minutes. NEVER CANCEL. Set timeout to 5+ minutes.

### Code Quality and Formatting

- Run linter: `pnpm lint` -- takes 4.5 seconds. NEVER CANCEL.
- Check code formatting: `pnpm prettier --check .` -- takes 4.8 seconds
- Fix formatting: `pnpm prettier --write .` -- takes 4.7 seconds
- Find unused code/dependencies: `pnpm knip` -- takes 2.4 seconds (exit code 1 is normal)

### Database Management

- Generate Prisma client: `pnpm prisma generate`
- Apply database migrations: `pnpm prisma db push`
- View database in browser: `pnpm prisma studio`

## Required Environment Variables

Copy `.env.sample` to `.env` and configure:

```bash
# Core API integrations
NEXT_PUBLIC_MOVIEDB_KEY=        # TMDB API Key
NEXT_PUBLIC_TMDB_TOKEN=         # TMDB Read Access Token
DISCORD_CLIENT_ID=              # Discord App Client ID
DISCORD_CLIENT_SECRET=          # Discord App Secret
DISCORD_AUTH=                   # Discord OAuth redirect URL

# Database
DATABASE_URL=                   # PostgreSQL connection string
TEST_URL=                       # Test database connection string
NEXTAUTH_SECRET=                # Secret for authentication

# Real-time features (Pusher)
app_id=                         # Pusher App ID
NEXT_PUBLIC_PUSHER_KEY=         # Pusher Key
NEXT_PUBLIC_PUSHER_CLUSTER=     # Pusher Cluster
secret=                         # Pusher Secret

# Optional: Radarr integration
RADARR_URL=                     # Radarr instance URL
RADARR_API_KEY=                 # Radarr API key
RADARR_ROOT_FOLDER=             # Movies root folder
RADARR_QUALITY_PROFILE_ID=      # Quality profile ID
RADARR_MONITORED=               # Monitor movies flag
```

## Validation

### Manual Testing Scenarios

After making changes, always test core user workflows:

1. **Development Server Health Check**:

   - Start server: `pnpm dev` -- ready in ~1.3 seconds
   - Verify server responds: `curl -I http://localhost:3000`
   - Expected: 500 error without database, 200 with proper setup
   - Check logs for Prisma initialization and font loading warnings

2. **Authentication Flow**:

   - Navigate to http://localhost:3000
   - Click login and authenticate with Discord
   - Verify user profile loads correctly

3. **Movie Search and Management**:

   - Use search functionality to find movies via TMDB integration
   - Add movies to personal shortlist
   - Test movie details and external links

4. **Raffle System**:

   - Ensure multiple users have shortlists ready
   - Test raffle drawing functionality
   - Verify winner selection and movie of the week assignment

5. **Tierlist Management**:
   - Create new tierlists
   - Drag and drop movies between tiers
   - Test filtering and sorting functionality

### Expected Error States in Development

- **Network Restrictions**: Google Fonts failures result in fallback fonts (normal)
- **Database Missing**: 500 errors on pages requiring authentication (expected)
- **Prisma Not Generated**: "@prisma/client did not initialize" errors (run `pnpm prisma generate`)

### Always Run Before Committing

- `pnpm lint` -- ensures code quality standards
- `pnpm prettier --write .` -- fixes code formatting
- `pnpm knip` -- identifies unused code (informational, failures OK)

## Common Tasks

### Script Utilities

The repository includes many utility scripts for data management:

```bash
# Generate test data for development
pnpm generate-test-data

# Create tierlists for users
pnpm generate-tierlists

# Backup database
pnpm backup

# Migrate data between databases
pnpm migrateData
```

### Key File Locations

- **API Routes**: `app/api/` - REST endpoints for all functionality
- **Page Components**: `app/(home)/` and `app/(landing)/` - main UI pages
- **Reusable Components**: `components/` - organized by feature area
- **Business Logic**: `lib/` - database queries, utilities, and hooks
- **Database Schema**: `prisma/schema.prisma` - Prisma database definitions
- **Type Definitions**: `types/` - TypeScript type definitions

### Database Schema Overview

- **Users**: Authentication and profile data via Discord
- **Movies**: TMDB movie data with local enhancements
- **Shortlists**: User movie candidates for raffles
- **Tierlists**: User rankings of watched movies
- **Raffles**: Historical raffle results and participation

## Network Limitations and Workarounds

**KNOWN ISSUE**: In restricted network environments:

- Production builds may fail accessing fonts.googleapis.com
- Prisma generate may fail accessing binaries.prisma.sh
- Use `pnpm install --ignore-scripts` if needed
- Development server works normally despite these restrictions

## Architecture Notes

- **Frontend**: React 19 with Next.js App Router
- **Styling**: Tailwind CSS with custom components
- **State Management**: Zustand stores for client state
- **Data Fetching**: TanStack Query for server state
- **Authentication**: Custom implementation with Discord OAuth
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: Pusher for live updates during raffles

Always validate that authentication flows work correctly after any changes to auth-related code. The application relies heavily on user sessions for all functionality.
