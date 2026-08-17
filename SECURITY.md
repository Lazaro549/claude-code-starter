# Security Policy

## Supported Versions

Security updates are provided for the latest release of this project.

| Version | Supported |
| ------- | --------- |
| 1.x     | ✅ Yes     |
| < 1.0   | ❌ No      |

## Reporting a Vulnerability

If you discover a security vulnerability, please do not open a public GitHub issue.

Instead, report it privately through GitHub's Security Advisories:

1. Go to the repository's **Security** tab.
2. Select **Report a vulnerability**.
3. Provide a clear description of the vulnerability.
4. Include reproduction steps or a proof of concept when possible.
5. Explain the potential impact.

Please allow reasonable time for the vulnerability to be investigated and addressed before publicly disclosing it.

## What to Include

A useful security report should contain:

- Affected version or commit.
- Description of the vulnerability.
- Steps to reproduce.
- Expected behavior.
- Actual behavior.
- Potential security impact.
- Suggested mitigation, if known.

## Scope

This policy covers security issues affecting:

- The TaskFlow CLI.
- Source code in this repository.
- GitHub Actions workflows.
- Claude Code configuration included in the repository.
- Dependencies used by the project.

## Out of Scope

The following are generally outside the scope of this policy:

- Issues requiring physical access to a user's machine.
- Vulnerabilities in third-party services.
- Social engineering attacks.
- Denial-of-service attacks against third-party infrastructure.
- Issues in unsupported versions.

## Security Best Practices

When contributing to this project:

- Never commit API keys, tokens, passwords, or other secrets.
- Do not include personal credentials in test fixtures.
- Keep dependencies up to date.
- Review GitHub Actions changes carefully.
- Avoid executing untrusted input through shell commands.
- Use least-privilege permissions for automation.

Thank you for helping keep this project secure.
