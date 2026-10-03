# Test Environments and Credentials

Select `qa` or `stage` with `TEST_ENV`. The default is `qa`; QA uses the public Nova Shop URL when `QA_BASE_URL` is not set. Stage requires `STAGE_BASE_URL`.

Passwords are read from process environment and are required. No password fallback is stored in TypeScript. Usernames default to the public demo account names, but can be overridden for either environment.

## Required Variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `TEST_ENV` | No | `qa` or `stage`; defaults to `qa` |
| `QA_BASE_URL` | No | QA base URL; defaults to `https://www.practiceqaautomation.com/shop` |
| `STAGE_BASE_URL` | For stage | Stage app base URL |
| `QA_STANDARD_PASSWORD` / `STAGE_STANDARD_PASSWORD` | Yes | Standard test account password for the selected environment |
| `QA_LOCKED_PASSWORD` / `STAGE_LOCKED_PASSWORD` | Yes | Locked-account test password for the selected environment |
| `QA_STANDARD_USERNAME` / `STAGE_STANDARD_USERNAME` | No | Override standard username; default is `demo_user` |
| `QA_LOCKED_USERNAME` / `STAGE_LOCKED_USERNAME` | No | Override locked username; default is `locked_user` |

Set values in the shell or CI secret store before running tests. Do not commit passwords or place them in test specs, configuration files, or command arguments saved in shell history.

Example environment selection:

```bash
export TEST_ENV=qa
export QA_STANDARD_PASSWORD='<from-your-secret-store>'
export QA_LOCKED_PASSWORD='<from-your-secret-store>'
npm run test:qa
```

For staging, set `TEST_ENV=stage`, `STAGE_BASE_URL`, `STAGE_STANDARD_PASSWORD`, and `STAGE_LOCKED_PASSWORD` before running `npm run test:stage`. Use the matching environment-specific username variables when account names differ from the demo defaults.

The environment selection and credentials are resolved in [`../test-data/shopTestData.ts`](../test-data/shopTestData.ts), and initial navigation uses the selected base URL through [`../pages/shop/LoginPage.ts`](../pages/shop/LoginPage.ts).
