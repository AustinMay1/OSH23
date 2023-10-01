import express from "express";
import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import { OAuthApp, createNodeMiddleware } from "@octokit/oauth-app";
import { Octokit } from "octokit";

dotenv.config();

const CLIENT_ID = process.env["CLIENT_ID"];
const CLIENT_SECRET = process.env["CLIENT_SECRET"];
const github = new OAuthApp({
  clientType: "oauth-app",
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
});
const app = express();

app.use(bodyParser.json());
app.use(createNodeMiddleware(github));

app.get("/getToken", async (req, res) => {
  const data = await github.createToken({
    code: req.query.code,
  });
  console.log(data);
  res.json(data.authentication.token);
});

app.get("/user", async (req, res) => {
    const octokit = new Octokit({ auth: req.get("Authorization") })
    const { data } = await octokit.rest.users.getAuthenticated()
    res.json(data);

});

app.get("/repos", async (req, res) => {
    const octokit = new Octokit({ auth: req.get("Authorization") })
    try {
    const { data } = await octokit.request("GET /users/{username}/repos", {
        username: "AustinMay1",
        headers: {
            accept: "application/vnd.github+json",
            'X-GitHub-Api-Version': '2022-11-28',
        },
        per_page: 100,
    })

    let forkedRepos = [];

    for(const repo of data) {
        if(repo.fork) {
            forkedRepos.push(repo);
        }
    }
    
    res.json(data)
} catch (e) {
    console.error(e)
}

})

app.get("/contribs", async (req, res) => {
    const octokit = new Octokit({ auth: req.get("Authorization") })
    const { data } = await octokit.request("GET /repos/{owner}/{repo}/forks", {
        owner: "AustinMay1",

    })
})

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
