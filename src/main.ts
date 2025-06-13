import * as core from "@actions/core";
import { Octokit } from "@octokit/rest";
import { loadManifest } from "./manifest";

export async function run(): Promise<void> {
  try {
    const githubToken = core.getInput("github_token");
    const [owner, repo] = core.getInput("repo").split("/");
    const manifest = core.getInput("manifest");
    const prune = core.getInput("prune") === "true";
    const gitea = core.getInput("gitea") === "true";

    // Load labels from manifest
    const labels = loadManifest(manifest);
    const wantedLabels = new Map(labels.map((l) => [l.name, l]));

    // Create client - compatible with Gitea!
    const octokit = new Octokit({
      auth: githubToken,
      baseUrl: process.env.GITHUB_API_URL || "https://api.github.com",
    });

    // Get the current labels
    const allLabels = await octokit.paginate(
      octokit.rest.issues.listLabelsForRepo,
      {
        owner,
        repo,
      },
    );
    const currentLabels = new Map(allLabels.map((l) => [l.name, l]));

    // Delete labels that should not exist if prune is enabled
    if (prune) {
      await Promise.all(
        allLabels.map(async (l) => {
          if (wantedLabels.get(l.name)) return;
          if (gitea) {
            const giteaRemoveLabelPath = `/repos/${owner}/${repo}/labels/${l.id}`;
            await octokit.request({
              method: "DELETE",
              url: giteaRemoveLabelPath,
            });
          } else {
            await octokit.rest.issues.deleteLabel({
              owner,
              repo,
              name: l.name,
            });
          }

          core.info(`Correctly deleted "${l.name}" label`);
        }),
      );
    }

    // Create or update tracked labels
    await Promise.all(
      labels.map(async (l) => {
        const existingLabel = currentLabels.get(l.name);
        // If the label does not exist, create it
        // Otherwise, if it is out-of-date, update it
        if (!existingLabel) {
          await octokit.rest.issues.createLabel({
            owner,
            repo,
            ...l,
          });
          core.info(`Correctly added "${l.name}" label!`);
        } else if (
          existingLabel.color != l.color ||
          existingLabel.description != l.description
        ) {
          await octokit.rest.issues.updateLabel({
            owner,
            repo,
            ...l,
          });
          core.info(`Correctly updated "${l.name}" description and/or color!`);
        } else {
          core.info(`Skipping update of "${l.name}", already up-to-date!`);
        }
      }),
    );
  } catch (error: any) {
    core.error(`Failed: ${error}`);
    throw new Error(`Failed: ${error}`);
  }
}
