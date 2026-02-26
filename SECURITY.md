# Security Policy

## 🔒 Reporting Security Vulnerabilities

The security of AISliDev is a priority. If you discover a security vulnerability, please report it responsibly.

### How to Report

**Do NOT create a public issue for security vulnerabilities.**

Please report security issues by:

1. **Email**: Send details to the maintainer (check repository for contact)
2. **Private Issue**: Use GitHub's private vulnerability reporting (if enabled)
3. **GitHub Security Advisory**: https://github.com/matheme-justyn/aislidev/security/advisories/new

### What to Include

When reporting a security vulnerability, please provide:

- **Description**: Clear description of the vulnerability
- **Location**: Affected file(s), line(s), and component(s)
- **Impact**: Potential impact if exploited
- **Reproduction**: Detailed steps to reproduce
- **Suggested Fix**: If you have recommendations
- **Environment**: Version, OS, Node.js version

**Example Report**:

```
Title: [SECURITY] XSS vulnerability in presentation preview

Description: User-provided Markdown content is rendered without
sanitization in the preview component, allowing XSS attacks.

Location: src/components/SlidevPreview.vue, line 45

Impact: Malicious users could inject JavaScript that executes in
other users' browsers when viewing shared presentations.

Reproduction:
1. Create presentation with content: <script>alert('XSS')</script>
2. Preview the presentation
3. Alert box appears

Suggested Fix: Sanitize Markdown input using DOMPurify before
rendering in the preview iframe.

Environment: AISliDev v0.1.0, Node.js 20.x, macOS
```

## 🛡️ Security Scope

### In Scope

Security issues in these areas will be addressed:

- **Presentation storage**: Unauthorized access to stored presentations
- **File upload**: Malicious file upload vulnerabilities
- **XSS vulnerabilities**: Cross-site scripting in UI components
- **Code injection**: Template injection, eval() usage
- **Authentication**: If/when authentication is implemented
- **Dependency vulnerabilities**: Known CVEs in dependencies
- **Path traversal**: Unauthorized file system access
- **Slidev integration**: Security issues in Slidev process management

### Out of Scope

The following are generally not considered security vulnerabilities:

- **Social engineering attacks**
- **Physical access to server**
- **Denial of Service** (unless trivially exploitable)
- **Issues in user-created presentations** (users are responsible for their content)
- **Third-party service vulnerabilities** (Slidev, npm packages)
- **Self-XSS** (requires user to execute malicious code themselves)

## ⚠️ Known Considerations

### Current Architecture

AISliDev v0.1.0 is in **Pre-Release** with the following security considerations:

#### 1. Local/Single-User Tool

- Designed for local development use
- No authentication/authorization implemented yet
- Not recommended for multi-tenant deployment

#### 2. Slidev Process Management

- Spawns child processes for Slidev preview
- Processes have access to file system
- Port range: 13030-13040

#### 3. File Storage

- Presentations stored in `storage/presentations/`
- No encryption at rest currently
- File permissions rely on OS-level security

#### 4. Dependencies

- Regularly updated via Dependabot
- See `package.json` for full dependency list
- Report vulnerabilities in dependencies

## 🔄 Security Response Process

1. **Report Received**: We'll acknowledge within 48 hours
2. **Investigation**: We'll investigate and confirm the issue
3. **Fix Development**: Develop and test the fix
4. **Disclosure**: Coordinate disclosure timeline with reporter
5. **Release**: Release patched version with security advisory
6. **Credit**: Credit reporter (if desired) in CHANGELOG and advisory

### Response Timeline

- **Critical**: Fix within 7 days
- **High**: Fix within 30 days
- **Medium**: Fix within 90 days
- **Low**: Fix in next regular release

## 📦 Security Updates

Security fixes are released as:

- **Patch versions** for fixes: `0.1.0` → `0.1.1`
- **Minor versions** for breaking security changes in 0.x.x
- Tagged with `security` label in releases
- Documented in CHANGELOG.md with `[SECURITY]` prefix

### Staying Updated

- Watch releases: https://github.com/matheme-justyn/aislidev/releases
- Enable GitHub notifications for security advisories
- Check CHANGELOG.md regularly

## 🔐 Security Best Practices

If you're deploying AISliDev:

### For Local Use

- ✅ Keep Node.js and dependencies updated
- ✅ Run behind firewall (don't expose to internet)
- ✅ Use environment variables for sensitive config
- ✅ Regularly backup presentations

### For Production (Not Recommended Yet)

⚠️ AISliDev v0.1.0 is NOT production-ready for multi-user deployment.

If you must deploy in production:

- ⚠️ Implement authentication and authorization
- ⚠️ Use HTTPS with valid certificates
- ⚠️ Isolate Slidev processes in containers
- ⚠️ Implement rate limiting
- ⚠️ Enable audit logging
- ⚠️ Regular security audits

## 📚 Security Resources

- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Fastify Security](https://www.fastify.io/docs/latest/Guides/Security/)
- [Slidev Security Considerations](https://sli.dev/guide/security.html)

## 📞 Security Contact

- **Repository**: https://github.com/matheme-justyn/aislidev
- **Issues**: https://github.com/matheme-justyn/aislidev/issues
- **Security Advisories**: https://github.com/matheme-justyn/aislidev/security/advisories

## 🙏 Hall of Fame

We appreciate security researchers who responsibly disclose vulnerabilities:

<!-- Security researchers will be listed here -->

---

**Thank you for helping keep AISliDev secure!** 🔒
