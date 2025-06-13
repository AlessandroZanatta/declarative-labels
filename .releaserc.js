module.exports = {
  branches: ["master"],
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
        prepareCmd: "yarn install --frozen-lockfile && yarn build",
      },
    ],
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md", "dist/**"],
        message:
          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
    [
      "@semantic-release/github",
      {
        assets: [{ path: "dist/**", label: "Distribution Files" }],
      },
    ],
  ],
};
