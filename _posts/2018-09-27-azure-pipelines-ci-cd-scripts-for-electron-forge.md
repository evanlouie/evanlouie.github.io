---
layout: post
title: Azure Pipelines CI/CD Scripts for Electron Forge
date: 2018-09-27 14:49 -0700
---

Azure Pipelines gives you free access to Mac, Linux, and Windows VMs for all your CI/CD needs. This is incredibly useful if you want to automated the deployment/release of Electron applications (I personally use [Electron Forge](https://electronforge.io/)).

Assuming you `package.json` has a `scripts` entry which looks something like this:

```json
{
  "scripts": {
    "start": "electron-forge start",
    "package": "electron-forge package",
    "make": "electron-forge make",
    "publish": "electron-forge publish"
  }
}
```

You can spin up multiple build jobs for your GitHub projects -- one for each target build -- and link a variable group containing your `GITHUB_TOKEN`.

```yml
pool:
  vmImage: "Ubuntu 16.04"

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: "8.x"
    displayName: "Install Node.js"

  - script: |
      sudo apt-get install dpkg fakeroot -y
    displayName: "Install dpkg & fakeroot"

  - script: |
      yarn install
    displayName: "Yarn install"

  - script: |
      COMMITS="$(git log $(git describe --tags --abbrev=0)..HEAD --oneline | grep -iv merge)"
      echo $COMMITS
      if [[ $COMMITS ]]; then
          echo "Commits found since last tag; only running make to ensure build consistency."
          yarn run make
      else
          echo "No commits found since last tag; making and publishing to GitHub."
          GITHUB_TOKEN=$(GITHUB_TOKEN) yarn run publish
      fi
    displayName: "Make or Publish"
```

> You can replace `"Ubuntu 16.04"` with `"macOS-10.13"` for MacOS builds. Also for a Mac build, you dont need the "Install dpkg & fakeroot" script.

This script will run `make` on general commits and `publish` on releases. Releases being determined as when there are zero commits since the last tag.

When your ready to actually cut a release, go ahead and do as your normally would by either doing a `yarn publish` or cutting it manually on GitHub. One gotcha that took me a long time to figure out was that the most recent tag wont be visible to Azure until the release on GitHub is actually published. Which it won't be if you do a `yarn publish` as it will create a draft release. But once it is released (ie; not draft), the job will fire.

So general workflow:

- Make changes
- Commit
- Azure runs `make` path and ensures it is in a compilable state
- `yarn publish` (note: make sure to increment our tag number)
- `git push` (the previous `yarn publish` will also add a version bump commit; its this commit that will trigger the Azure Pipelines 'publish' workflow, ie. the `else` branch of our `if` script)
- Azure Pipelines automatically detect the publishing of the release and run the build script with the `publish` path
  - Azure builds and pushes the artifact to the GitHub release
- Confirm release on GitHub and click publish
