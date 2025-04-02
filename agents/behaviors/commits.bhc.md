# Commit Protocol Card

When committing code, follow the `!bfa` protocol:

## Precommit Phase (`!bfa precommit`)

1. Delete the build directory if it exists
2. Create a fresh build directory
3. Format the code using `bff f`
4. Run tests with `bff test`
5. Add/remove all files from sapling using `sl add .`
6. Generate a diff file with all changes using `sl diff > build/diff.txt`

## Commit Phase (`!bfa commit`)

1. Configure the Sapling user with
   `sl config --user ui.username "Bff Bot <bot@contentfoundry.com>"`
2. Read the diff from `build/diff.txt` (generated in the precommit step)
3. STOP IMMEDIATELY if `build/diff.txt` doesn't exist and tell the user to run
   `!bfa precommit` first
4. Generate a commit message based on the diff with:
   - Clear, descriptive title
   - Summary section with bullet points of changes
   - Test Plan section describing verification steps
5. Store the generated message in `build/commit-message.txt`
6. Run `sl commit` with the generated message
7. Push the commit by running `sl pr submit`
   - Add the `--draft` flag if tests are failing or the user requests it
8. Clean up temporary files
9. Reset the Sapling user configuration to the original user

## Commit Message Structure

```
Descriptive title

## Summary
- Change 1: Brief explanation of first change
- Change 2: Brief explanation of second change

## Test Plan
- Verified X works as expected
- Ran Y test and confirmed Z outcome
```

## Common Mistakes to Avoid

- Implementing unrelated code changes not in the diff
- Assuming file contents without checking the diff
- Misinterpreting the diff context
- Implementing "todo" comments unless explicitly changed in the diff
