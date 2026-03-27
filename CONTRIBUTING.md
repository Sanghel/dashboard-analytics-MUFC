# Contributing

## Creating Issues

Use the appropriate template:

- **Feature:** New functionality
- **Bug:** Something broken
- **Task:** General development work

All issues are auto-assigned. Add appropriate phase label (phase-1 through phase-7).

## Branch Naming

- `feature/issue-{number}-{short-description}`
- `fix/issue-{number}-{short-description}`

## Development Workflow

1. Create/claim issue
2. Create branch from `develop`
3. Implement + write tests
4. Verify: `npm run lint && npm run test && npm run build`
5. Create PR targeting `develop`
6. Pass code review
7. Squash merge

## Code Standards

- TypeScript strict mode
- ESLint + Prettier enforced via husky
- All new code must have tests
- Maintain >80% coverage
