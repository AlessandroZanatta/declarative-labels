# Declarative labels action

A simple GitHub action to manage repository labels. Gitea compatible!

You can define your labels in a separate YAML file, such as:

```yaml
---
- name: bug
  description: Something broke :(
  color: "e11d21"
- name: documentation
  description: Improvements to the wiki!
  color: "0052cc"
```

> [!NOTE]  
> Ensure you are wrapping the color field in quotes to ensure they are interpreted as a **string**!
> Otherwise, [bad things may happen!](https://ruudvanasseldonk.com/2023/01/11/the-yaml-document-from-hell)

Example usage:

```yaml
---
name: Example

on:
  pull_request:

jobs:
  steps:
    - uses: alessandrozanatta/declarative-labels@v1.0.0
      with:
        manifest: .github/labels.yaml
        gitea: true # <-- set this to true if running on Gitea!
        github_token: "${{ secrets.GITHUB_TOKEN }}"
        prune: true # <-- CAUTION: this will delete all the labels not defined in your manifest!
```
