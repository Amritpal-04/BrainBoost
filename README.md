# BrainBoost --- Team README

> **Project:** BrainBoost | **Type:** Backend Engineering + full-stack web application | **Team:** 3–4 members

## 1. Project overview

BrainBoost is a child-friendly practice website for mental mathematics,
logical thinking, pattern recognition and calculation fluency. A student
chooses a category and difficulty, answers questions, receives feedback
and reviews saved progress.

**Core journey:** Register/login → choose a practice mode → complete
questions → receive results → view progress.

### Problem and solution

Children need approachable ways to practise calculation and reasoning.
Worksheets and basic quizzes may not offer immediate feedback or clear
progress. BrainBoost combines short interactive practice, useful
feedback and topic-wise progress.

### Proposed USP

> One focused platform combining mental maths, logical reasoning and
> calculation-speed practice, with clear feedback and topic-wise
> progress tracking.

This is our intended focus, not a claim that competitors lack similar
features.

## 2. Features and scope

### Must-have (first release)

-   Student registration and login
-   Role-based access: `STUDENT`, `ADMIN`
-   Student dashboard
-   Mathematics, logical-thinking and fast-calculation modes
-   Easy, medium and hard difficulty
-   Quiz question delivery and answer submission
-   Server-side score calculation
-   Results and saved attempt history
-   Admin question and category management
-   Responsive mobile and desktop layouts

### Should-have (after core flow works)

-   Points and achievements
-   Topic-wise progress charts
-   Optional leaderboard using nicknames
-   Question explanations
-   Parent read-only progress view

### Stretch goals

-   Adaptive difficulty recommendations
-   More detailed parent analytics
-   Additional puzzle types
-   Installable PWA

**Scope rule:** A fully tested quiz flow is more valuable than many
incomplete features. Multiplayer, chat, payments and AI-generated
questions are out of scope for the first release.

## 3. Technology stack

  -----------------------------------------------------------------------
  Layer                   Technology              Responsibility
  ----------------------- ----------------------- -----------------------
  Frontend                React.js, JavaScript     Components, UI and frontend logic

  Styling                 Tailwind CSS            Responsive styling

  Backend                 Node.js, Express.js,    REST API and business
                          JavaScript              logic

  Database                PostgreSQL              Persistent data

  ORM                     Prisma                  Schema, migrations,
                                                  database access

  Password security       bcrypt                  Password hashing

  Authentication          Secure HTTP-only        Authenticated access
                          session cookie or       
                          carefully designed JWT  

  API testing             Postman                 Endpoint and error-case
                                                  testing

  Version control         Git + GitHub            Collaboration and
                                                  review

  Deployment              Vercel +                Hosting
                          Node-compatible host +  
                          managed PostgreSQL      
  -----------------------------------------------------------------------

Choose one authentication strategy before implementation. Never store
plain-text passwords. Avoid putting long-lived tokens in `localStorage`
by default.

## 4. Roles and permissions

### Student

Can register/login, view their dashboard, choose categories and
difficulty, take quizzes, and view their own results and progress.

Cannot manage questions, access admin reports or view another student's
private records.

### Admin

Can manage questions and categories, view user/platform statistics and
review leaderboard data. Admin APIs must enforce role authorization on
the server; hiding buttons in the frontend is not security.

### Parent (future)

A parent role may later provide read-only access to a linked child's
progress. Do not build this before the core release is stable.

## 5. Page ownership

Split the team into two feature groups. Each group owns frontend and
backend work for its modules, while both follow the same architecture,
database and API contracts.

### Team A --- Student experience

  Page/module         Requirements
  ------------------- -------------------------------------------------
  Login               Email/password, validation, helpful errors
  Register            Display name, email, password
  Student dashboard   Greeting, categories, recent activity, progress
  Mathematics         Topic and difficulty selection
  Logical thinking    Patterns, sequences, reasoning
  Fast calculation    Short timed or untimed rounds
  Quiz interface      Question, options, progress, optional timer
  Results             Score, accuracy, time and explanations
  My progress         Attempt history and topic performance
  Profile             Display name and basic settings

Backend ownership: authentication integration, question retrieval, quiz
sessions, answer submission, scoring, attempts and student dashboard
APIs.

### Team B --- Admin and content management

  -----------------------------------------------------------------------
  Page/module                         Requirements
  ----------------------------------- -----------------------------------
  Admin access                        Shared authentication; admin role
                                      required

  Admin dashboard                     Counts for users, questions and
                                      attempts

  Question list                       Search, filters, status and
                                      pagination

  Add question                        Prompt, choices, answer,
                                      explanation, category, difficulty

  Edit/deactivate question            Safe question maintenance

  Category management                 Create, edit and deactivate
                                      categories

  User management                     View accounts and permitted account
                                      actions

  Reports                             Aggregate usage and performance

  Leaderboard management              Review rankings and moderation
  -----------------------------------------------------------------------

Backend ownership: role authorization, question/category CRUD, user
management, analytics and leaderboard APIs.

### Shared responsibilities

Database schema/migrations, API contracts, shared UI components,
authentication, error formats, testing and release process. Do not
create separate databases or duplicate authentication systems.

## 6. UI/UX design status — to be decided by the team

**Important: Page designs have not been finalised yet.** The colours, typography, layouts, navigation, component style and overall visual theme are still open decisions. Do not treat any sample design, colour palette or layout from an early discussion as final.

Before building the final page interfaces, the team should:
1. Review the project requirements and intended child users.
2. Discuss and agree on a consistent visual direction for the student and admin areas.
3. Create wireframes for the key pages (login/register, student dashboard, quiz, result, admin dashboard and question management).
4. Review the wireframes together and collect feedback.
5. Agree on shared design tokens: colours, typography, spacing, borders, buttons, form fields and cards.
6. Create reusable components and document the approved decisions here.
7. Check the designs on mobile, tablet and desktop before implementation is considered complete.

### Design principles to consider
- Keep the student experience clear, friendly and easy for children to understand.
- Keep admin pages practical and efficient for managing questions and users.
- Make questions and answer choices the main focus of quiz screens.
- Use readable text, clear instructions and accessible colour contrast.
- Include loading, empty, success and error states.
- Avoid distracting animations, flashing effects and stressful timers.
- Ensure touch targets are comfortable on phones and controls are keyboard accessible.

### Design decisions log

| Decision | Status | Owner / notes |
|---|---|---|
| Overall visual theme | Pending | Decide as a team |
| Colour palette | Pending | Decide as a team |
| Typography | Pending | Decide as a team |
| Student navigation and layout | Pending | Wireframe and review |
| Admin navigation and layout | Pending | Wireframe and review |
| Shared component styles | Pending | Define after wireframes |
| Responsive behaviour | Pending | Agree and test across screen sizes |

Do not independently invent a different design for each page. Once the team approves the design direction, all pages should follow the same documented system.

## 7. Backend architecture

Suggested structure:

``` text
backend/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   ├── middleware/
│   │   ├── authenticate.ts
│   │   ├── authorizeRole.ts
│   │   └── errorHandler.ts
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── categories/
│   │   ├── questions/
│   │   ├── quiz/
│   │   ├── attempts/
│   │   ├── analytics/
│   │   └── admin/
│   └── utils/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── tests/
├── .env.example
└── package.json
```

Request flow: **Route → validation → authentication/authorization →
controller → service → Prisma/database → response.**

Keep business logic in services, not route files.

### Suggested database models

Start with: - `User` - `Category` - `Question` - `QuizAttempt` -
`UserAnswer` - `Achievement` and `UserAchievement` (later)

Agree on relationships, indexes and deletion behaviour before creating
migrations.

### Critical quiz security rule

The question API must not send the correct answer to the student. The
backend retains the answer key, validates submitted answers and
calculates the authoritative score. Never trust a score calculated only
in the browser.

## 8. API contract --- agree before parallel implementation

Use a consistent base path such as `/api/v1`.

### Authentication

  Method   Endpoint           Access
  -------- ------------------ ---------------
  POST     `/auth/register`   Public
  POST     `/auth/login`      Public
  POST     `/auth/logout`     Authenticated
  GET      `/auth/me`         Authenticated

### Student and quiz

  Method   Endpoint                    Access
  -------- --------------------------- ------------------------------
  GET      `/categories`               Authenticated
  GET      `/questions`                Authenticated; no answer key
  POST     `/quiz/start`               Student
  POST     `/quiz/:attemptId/answer`   Student; own attempt
  POST     `/quiz/:attemptId/submit`   Student; own attempt
  GET      `/attempts/me`              Student
  GET      `/dashboard/me`             Student

### Admin

  Method              Endpoint                  Access
  ------------------- ------------------------- --------
  GET                 `/admin/dashboard`        Admin
  GET                 `/admin/questions`        Admin
  POST                `/admin/questions`        Admin
  PATCH               `/admin/questions/:id`    Admin
  DELETE/deactivate   `/admin/questions/:id`    Admin
  POST                `/admin/categories`       Admin
  PATCH               `/admin/categories/:id`   Admin
  GET                 `/admin/users`            Admin
  GET                 `/admin/reports`          Admin

### Response conventions

Success:

``` json
{
  "success": true,
  "data": {},
  "message": "Request completed"
}
```

Error:

``` json
{
  "success": false,
  "message": "A readable error message",
  "code": "VALIDATION_ERROR"
}
```

Document pagination and filtering for list endpoints. Never return
password hashes, secrets or correct answers in student responses.

## 9. Git and team workflow

Use one shared repository with `frontend/` and `backend/`.

Suggested branches: - `main` --- stable release code - `develop` ---
integrated development - `feature/student-dashboard` -
`feature/quiz-engine` - `feature/admin-questions` - `feature/auth-api`

For every task: 1. Pick an issue from the project board. 2. Create a
feature branch from the agreed base. 3. Implement one focused feature.
4. Run linting, type checks and relevant tests. 5. Open a pull request
with screenshots or API test evidence. 6. Get another teammate to
review. 7. Merge after review and checks pass. 8. Test the merged
feature in the shared development environment.

Commit examples:

``` text
feat: add student dashboard
feat: create question management API
fix: prevent duplicate quiz submission
test: add quiz scoring tests
docs: update API documentation
refactor: move scoring logic into quiz service
```

Coordination rules: - Have a short daily or every-other-day check-in. -
Review progress and blockers weekly. - Keep tasks small (ideally 1--3
working days). - Agree on API contracts before parallel work. - Assign
one person to coordinate Prisma schema changes and migrations. - Never
commit `.env`, credentials or production secrets.

## 10. Testing checklist

### Authentication

-   [ ] Valid registration and login
-   [ ] Duplicate email rejected
-   [ ] Invalid inputs rejected
-   [ ] Password hashed
-   [ ] Logout invalidates session as designed
-   [ ] Student cannot access admin endpoints

### Quiz

-   [ ] Correct question count delivered
-   [ ] Correct answers are not exposed in question responses
-   [ ] Correct and incorrect answers handled
-   [ ] Score calculated by backend
-   [ ] Duplicate submissions do not award duplicate rewards
-   [ ] Timeout and incomplete attempts handled
-   [ ] User cannot access another user's attempt

### Admin

-   [ ] Admin can create and edit questions
-   [ ] Invalid question data rejected
-   [ ] Student cannot create or delete questions
-   [ ] Deactivated questions excluded from new quizzes

### UI and production

-   [ ] Mobile, tablet and desktop layouts work
-   [ ] Loading, empty and error states exist
-   [ ] Forms have labels and clear validation
-   [ ] Keyboard navigation works where practical
-   [ ] Environment variables configured
-   [ ] HTTPS enabled
-   [ ] Database migrations applied
-   [ ] Production smoke test completed
-   [ ] No secrets committed to Git

## 11. Privacy and responsible design

Because children may use this website: - Collect only information needed
to operate the service. - Prefer nicknames over public full names. -
Never expose children's email addresses or private performance
publicly. - Make leaderboard participation optional. - Restrict parent
views to explicitly linked accounts. - Protect admin access. - Provide a
clear privacy notice and obtain appropriate parent/guardian consent
before real-world use, as applicable. - Do not claim the site improves
intelligence or academic results without proper evaluation.

## 12. Definition of done

A feature is complete only when: - UI follows the shared design
system. - It is connected to the real backend (unless clearly marked
prototype). - Validation and error states work. - Permissions are
enforced on the server. - Relevant tests pass. - Code has been reviewed
and merged. - Mobile and desktop layouts work. - Relevant documentation
is updated.

## 13. Initial team checklist

-   [ ] Confirm project name and MVP scope.
-   [ ] Assign Team A and Team B page ownership.
-   [ ] Create GitHub repository and project board.
-   [ ] Agree on colours, typography, spacing and shared components.
-   [ ] Draw the database ER diagram.
-   [ ] Agree on API request/response formats.
-   [ ] Set up React.js, Express, JavaScript, PostgreSQL and Prisma.
-   [ ] Add `.env.example`; keep actual `.env` private.
-   [ ] Build and test `/api/v1/health`.
-   [ ] Start student authentication and admin question-management
    modules.

## 14. Competitor awareness and positioning

Existing platforms such as Khan Academy, Khan Academy Kids and Prodigy
already offer overlapping educational practice, maths activities,
progress features or game-based learning.

Position BrainBoost honestly around its focused combination: - Mental
maths and quick calculation rounds - Logical reasoning and pattern
puzzles - Clear speed-and-accuracy feedback - Topic-wise progress in a
simple child-friendly interface - An admin-managed question bank

Do not claim these features are entirely unique. Validate the product's
usability and value through feedback from children and parents.

## 15. Project success target

At project completion, the team should demonstrate: 1. A student can
register and log in. 2. The student can select a practice category and
difficulty. 3. The student can complete a quiz on mobile or desktop. 4.
The backend checks answers and calculates the score. 5. Results and
progress are saved in PostgreSQL. 6. An admin can manage the question
bank. 7. Protected routes enforce the correct roles. 8. The application
is deployed and the team can explain its architecture, database, APIs,
security and testing.

**Build a small, reliable learning product first. Add advanced features
only when the main student and admin workflows are stable.**

## Useful documentation

-   React: https://react.dev/learn
-   JavaScript: https://www.javascriptlang.org/docs/
-   Express: https://expressjs.com/
-   Prisma: https://www.prisma.io/docs
-   PostgreSQL: https://www.postgresql.org/docs/
-   Tailwind CSS: https://tailwindcss.com/docs
-   GitHub pull requests: https://docs.github.com/en/pull-requests

------------------------------------------------------------------------

**BrainBoost Team --- keep the experience simple, the backend secure,
and the code easy for every teammate to understand.**
