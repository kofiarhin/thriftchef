# Safety and Verification

## Stop conditions

Stop or skip the affected operation when:

- the product specification is missing or unreadable;
- multiple sources remain plausible and none was explicitly selected;
- a write would leave the resolved workspace;
- an existing target contains materially conflicting instructions;
- permissions prevent a required write.

## Safe defaults

- Keep existing application code unchanged.
- Never follow a symlink for a write outside the workspace.
- Preserve existing content and uncommitted changes.
- Redact secret values while retaining non-sensitive variable names when useful.
- Use a meaningful `README.md` to represent a future-content directory; do not add `.gitkeep`.
- Use the user's requested language. Otherwise follow the source specification's primary language.
- Do not populate `context/lessons.md` with generic advice. Record only repository-specific lessons supported by existing evidence.

## Verification

After setup:

1. Confirm every reported file exists.
2. Confirm `tickets/`, `spec/`, and `plans/` are separate and their README files describe their distinct responsibilities.
3. Confirm `context/lessons.md` exists.
4. Search generated files for unresolved template markers such as `{{...}}`, `[TODO]`, and example product names.
5. Search generated files for accidentally copied secret values when safe identifiers are known.
6. Confirm no runtime-code, dependency, lockfile, Git-state, deployment, or external-service changes occurred.
7. Inspect the diff when Git is available and classify each target as created, updated, reused, skipped, or blocked.

Do not run application tests or builds for a documentation-only setup unless project instructions explicitly require them. Report those checks as not run rather than implying success.
