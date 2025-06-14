module.exports = {
  branches: ["master", { name: "dev", prerelease: true }],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md",
      },
    ],
    [
      "@semantic-release/exec",
      {
        prepareCmd:
          "yarn install --frozen-lockfile && yarn build && node ./scripts/update-readme-version.js ${nextRelease.version}",
      },
    ],
    ["@semantic-release/npm"],
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md", "dist/**", "README.md", "package.json"],
        message:
          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
    ["@semantic-release/github"],
  ],
};
