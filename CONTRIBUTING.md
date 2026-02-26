# Contributing to AISliDev

Thank you for your interest in contributing to AISliDev! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior by opening an issue.

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Environment details** (OS, Node.js version, etc.)
- **Screenshots** if applicable

Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md).

### 💡 Suggesting Features

Feature suggestions are welcome! Please:

- Check if the feature has been suggested before
- Provide clear use cases
- Explain why this feature would benefit AISliDev users

Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md).

### 📝 Improving Documentation

Documentation improvements are always appreciated:

- Fix typos or clarify unclear sections
- Add examples or use cases
- Update outdated information
- Translate documentation

## Development Setup

### Prerequisites

- Node.js 20+
- npm or pnpm
- Git

### Setup Steps

```bash
# 1. Fork and clone the repository
git clone https://github.com/your-username/aislidev.git
cd aislidev

# 2. Install dependencies
npm install

# 3. Create a feature branch
git checkout -b feature/your-feature-name

# 4. Start development server
npm run dev

# 5. Make your changes and test
npm run build
npm run lint
```

## Commit Guidelines

This project follows **[Conventional Commits](https://www.conventionalcommits.org/)** with **Angular convention**.

### Commit Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Commit Types

**Types that trigger version bumps**:

- `feat`: New feature → MINOR bump (0.x.0)
- `fix`: Bug fix → PATCH bump (0.0.x)
- `feat!` or `fix!`: Breaking change → MAJOR bump (x.0.0) in 1.0.0+, MINOR in 0.x.x

**Types that do NOT trigger version bumps**:

- `docs`: Documentation only
- `style`: Code style (formatting, whitespace)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Tests
- `build`: Build system changes
- `ci`: CI/CD configuration
- `chore`: Other maintenance

### Examples

```bash
feat(editor): add real-time collaboration support
fix(preview): resolve Slidev rendering issue in Safari
docs: update installation guide
refactor(api): simplify authentication logic
```

### Breaking Changes

Add `!` after type/scope OR include `BREAKING CHANGE:` in footer:

```bash
feat!: redesign presentation API

BREAKING CHANGE: The createPresentation function signature has changed.
Old: createPresentation(title, content)
New: createPresentation({ title, content, theme })
```

## Pull Request Process

### Before Submitting

1. **Read relevant ADRs**: Check `docs/adr/` for architecture decisions
2. **Update documentation**: Keep README, CHANGELOG, and guides in sync
3. **Add tests**: All new features need tests
4. **Run checks**: Ensure linting and build pass
5. **Update CHANGELOG**: Add entry under `[Unreleased]`

### PR Guidelines

1. **Create from feature branch**

   ```bash
   git checkout -b feature/your-feature
   ```

2. **Keep PRs focused**: One feature/fix per PR

3. **Write clear PR description**:
   - What changed and why
   - Link related issues
   - Screenshots if UI changes
   - Testing instructions

4. **Use PR template**: Follow [`.github/pull_request_template.md`](.github/pull_request_template.md)

5. **Respond to feedback**: Address review comments promptly

### PR Title Format

Follow Angular convention:

```
feat(scope): brief description
fix(scope): brief description
docs(scope): brief description
```

### PR Review Process

1. Maintainer reviews code and design
2. CI checks must pass
3. At least one approval required
4. Maintainer merges when ready

## Project Structure

```
aislidev/
├── src/
│   ├── server/         # Fastify backend
│   ├── components/     # Vue components
│   └── assets/         # Static assets
├── docs/
│   ├── adr/           # Architecture Decision Records
│   └── guides/        # Development guides
├── storage/           # Presentation storage
└── .template/         # Scaffolding infrastructure
```

## Development Guidelines

### Code Style

- Follow existing code style
- Use TypeScript for type safety
- Write meaningful variable names
- Add comments for complex logic
- Keep functions focused and small

### Testing

- Write tests for new features
- Update tests when changing behavior
- Ensure all tests pass before PR

### Documentation

- Update README if adding features
- Add ADR for significant architecture changes
- Keep inline comments clear and current

## Questions?

If you have questions:

- Check [AGENTS.md](./AGENTS.md) for project conventions
- Read [Architecture Decision Records](./docs/adr/)
- Open an [issue](https://github.com/matheme-justyn/aislidev/issues)

---

**Thank you for contributing to AISliDev!** 🚀
