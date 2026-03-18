# Test Scripts

This directory contains test scripts for investigating and validating specific behaviors.

## Available Tests

### PPTX Export & Screenshot Tests

| Script                         | Purpose                                       | Usage                                             |
| ------------------------------ | --------------------------------------------- | ------------------------------------------------- |
| `test-screenshot.mjs`          | Basic Playwright screenshot test (standalone) | `node scripts/tests/test-screenshot.mjs`          |
| `test-env-fix.mjs`             | Test NODE_ENV cleanup for Playwright          | `node scripts/tests/test-env-fix.mjs`             |
| `test-service-port.mjs`        | Test screenshot from specific Slidev port     | `node scripts/tests/test-service-port.mjs`        |
| `test-headless-comparison.mjs` | Compare 4 Playwright headless modes           | `node scripts/tests/test-headless-comparison.mjs` |
| `test-theme-comparison.mjs`    | Test screenshot behavior across Slidev themes | `node scripts/tests/test-theme-comparison.mjs`    |

## Context

These scripts were created during the investigation of PPTX export background image loading issues (Sessions 1-4, March 2026).

See:

- [ADR-010: Revert child_process Screenshot Approach](../../docs/adr/010-revert-child-process-screenshot-approach.md)
- [Investigation Report](../../docs/investigation/pptx-background-loading-issue.md)

## Expected Results

**Success Criteria** (for background image loading):

- Screenshot file size: **~844 KB** (with Unsplash background)
- Failure indicator: **~97 KB** (white background)

All standalone test scripts should produce **844 KB** screenshots. If running via service, expect **97 KB** due to execution context issues.

## Output

Test scripts create screenshots in `test-outputs/` directory (git-ignored).
