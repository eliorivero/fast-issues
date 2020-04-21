# Fast Issues

A GitHub app to speed up the creation of GitHub issues using plain text.


## Overview

This app allows to enter GitHub issues in plain text in a text box and will automatically create the issues on submission using the GitHub API.

The only required field is the title. It also supports assigning the issue to someone, setting a description (that can any length but no line breaks), and tagging it with labels. All these fields must be separated by a pipe character.

Assignation and labeling supports multiple assignees and labels if they're separated by a comma.

For example:

```
Issue title | assignee | Description of the issue. | enhancement, speed
```

## Install

To install this locally:

```
git clone git@github.com:eliorivero/fast-issues.git
cd fast-issues
npm install
```

If you want to create your own, this requires you to create a GitHub OAuth app, and to get the client id and client secret into a `.env` file in the app root. It should be like:

```
CLIENT_SECRET=12345abcde
CLIENT_ID=12345abcde
```

Other accepted vars that can be defined here are:

```
PORT=8080
```

## Scripts

There are some scripts included to build different environments:


| Command | Description |
|---------------|--------------------------------------------------|
|`npm run server`| Starts the server with Express debugging, restarting automatically when files change. |
|`npm run build`| Build final files in a `/public` repository. |


## Backend

- Node.js
- Express
- [Octokit REST](https://octokit.github.io/rest.js) to interact with the GitHub API
- `dotenv` to keep the configuration in the environment separated from the code.
- `nodemon` to restart the server when the files change.
- `axios` to handle data requests.

## Frontend

- React
