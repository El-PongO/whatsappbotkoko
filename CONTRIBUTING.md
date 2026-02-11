# Contributing to WhatsApp Bot Koko

Thank you for considering contributing to this project! This document provides guidelines for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/whatsappbotkoko.git`
3. Install dependencies: `npm install`
4. Make your changes
5. Test your changes locally
6. Submit a pull request

## Code Style

- Use consistent indentation (4 spaces)
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions focused and modular

## Feature Requests

When adding new features, please consider:

### Bot Commands
- Keep commands simple and intuitive
- Use Indonesian language for user-facing messages
- Add help text for new commands
- Document commands in README.md

### Data Management
- Always validate user input
- Handle errors gracefully
- Maintain backward compatibility with existing data structures
- Back up data files before modifications

### Security
- Never commit sensitive data (API keys, phone numbers, payment info)
- Sanitize user input
- Keep dependencies updated
- Follow security best practices

## Testing

Before submitting a PR:

1. Test the bot with real WhatsApp connection (if possible)
2. Verify all commands work as expected
3. Test admin tools functionality
4. Check for console errors
5. Verify data persistence works correctly

## Documentation

Update documentation when:
- Adding new features
- Changing existing behavior
- Adding new configuration options
- Modifying command syntax

Files to update:
- `README.md` - Main documentation
- `QUICKSTART.md` - Quick start guide
- Code comments - Inline documentation

## Pull Request Process

1. Update the README.md with details of changes (if applicable)
2. Update the version number in package.json following [SemVer](http://semver.org/)
3. The PR will be merged once reviewed and approved

## Reporting Bugs

When reporting bugs, include:
- Node.js version
- Operating system
- Steps to reproduce
- Expected behavior
- Actual behavior
- Error messages or logs

## Feature Ideas

Potential features to contribute:
- Web dashboard for admin
- Multi-language support
- Database integration (MongoDB, PostgreSQL)
- Payment gateway integration
- Image/file handling for complaints
- Broadcast messages to all tenants
- Automated payment reminders with escalation
- Tenant satisfaction surveys
- Maintenance request tracking
- Visitor management system

## Code of Conduct

- Be respectful and inclusive
- Accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to open an issue for any questions or concerns!
