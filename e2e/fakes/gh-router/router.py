#!/usr/bin/env python3
"""A fake GitHub CLI for the Splash end-to-end tests (stdlib only, Python 3.8+).

Splash runs `gh api ...` (src/github.rs, src/github_actions.rs) and
`gh pr view ...` (src/git_info.rs). This answers exactly those calls from a
scenario and never touches the network:

* Every call is appended to $SPLASH_E2E_DIR/gh/calls.jsonl as
  {"argv": [...], "stdin": "...", "cwd": "..."}.
* The scenario is $SPLASH_E2E_DIR/gh/scenario.json when the test wrote one
  (support/github.ts), else scenarios/triage.json next to this file.
* Anything this does not know exits 1 with "HTTP 404" on stderr, like gh for an
  unknown endpoint.

Scenario format (see scenarios/triage.json):

  login, now                 the signed-in user; "now" stamps created issues
  repository_page_size       pages `user/repos` for --paginate --slurp
  page_size                  GraphQL page size (default: the query's `first:`)
  next_number                number of the next created issue
  repositories[]             full_name, private, archived, has_issues, pushed_at,
                             issues[], pulls[], branches[] (GraphQL data, shaped per
                             query), events[] (REST, verbatim), actions{workflows[],
                             runs[] (REST, verbatim), jobs{"<run>/<attempt>": [...]},
                             logs{"<job>": text | {"error"} | {"generate"}}}
  search_decoys[]            results outside the searched repositories, always
                             returned, which Splash must drop
  failures[], delays[]       {"match": regex, "error": text} / {"match", "seconds"}
                             applied to a request's key

A request's key is its REST endpoint ("repos/e2e/demo/events?per_page=30&page=1"),
or for GraphQL "graphql <issues|pullRequests|refs> <owner>/<name>",
"graphql comments <owner>/<name>#<number>" or "graphql search <q>".
"""

import base64
import fcntl
import json
import os
import re
import subprocess
import sys
import tempfile
import time
from datetime import datetime
from urllib.parse import parse_qs, urlsplit

HERE = os.path.dirname(os.path.realpath(__file__))
DEFAULT_SCENARIO = os.path.join(HERE, "scenarios", "triage.json")

HELP = """Make an authenticated HTTP request to the GitHub API and print the response.

USAGE
  gh api <endpoint> [flags]

FLAGS
      --allow-escape-sequences   Allow terminal escape sequences in the response
      --hostname string          The GitHub hostname for the request (default "github.com")
      --input file               The file to use as body for the HTTP request (use "-" to read from standard input)
      --paginate                 Make additional HTTP requests to fetch all pages of results
      --slurp                    Use with "--paginate" to return an array of all pages of either JSON arrays or objects
"""


class GhError(Exception):
    """A failed call: the message goes to stderr and gh exits 1."""


def not_found():
    return GhError("gh: Not Found (HTTP 404)")


# Control files ---------------------------------------------------------------


def control_dir():
    path = os.path.join(os.environ["SPLASH_E2E_DIR"], "gh")
    try:
        # Never recreate the folder of a test that is over.
        os.mkdir(path)
    except FileExistsError:
        pass
    return path


def log_call(entry):
    with open(os.path.join(control_dir(), "calls.jsonl"), "a", encoding="utf-8") as f:
        fcntl.flock(f, fcntl.LOCK_EX)
        f.write(json.dumps(entry) + "\n")


def scenario_path():
    return os.path.join(control_dir(), "scenario.json")


def load_scenario():
    path = scenario_path()
    with open(path if os.path.exists(path) else DEFAULT_SCENARIO, encoding="utf-8") as f:
        return json.load(f)


def save_scenario(scenario):
    """Replace the test's scenario atomically: other calls may be reading it."""
    fd, tmp = tempfile.mkstemp(dir=control_dir(), suffix=".tmp")
    with os.fdopen(fd, "w", encoding="utf-8") as f:
        json.dump(scenario, f, indent=2)
    os.replace(tmp, scenario_path())


def apply_rules(scenario, key):
    for rule in scenario.get("delays", []):
        if re.search(rule["match"], key):
            time.sleep(rule["seconds"])
    for rule in scenario.get("failures", []):
        if re.search(rule["match"], key):
            raise GhError(rule["error"])


# Scenario data -----------------------------------------------------------------


def repository(scenario, full_name):
    for repo in scenario["repositories"]:
        if repo["full_name"].lower() == full_name.lower():
            return repo
    return None


def require_repository(scenario, full_name):
    repo = repository(scenario, full_name)
    if repo is None:
        raise not_found()
    return repo


def web(repo, *path):
    return "/".join(["https://github.com", repo["full_name"]] + [str(p) for p in path])


def by_updated(items):
    return sorted(items, key=lambda i: i["updated"], reverse=True)


def people(names, field="login"):
    return {"nodes": [{field: n} for n in names]}


def issue_node(repo, issue):
    return {
        "id": "I_%s_%d" % (repo["full_name"], issue["number"]),
        "number": issue["number"],
        "title": issue["title"],
        "body": issue.get("body", ""),
        "url": web(repo, "issues", issue["number"]),
        "state": issue["state"],
        "updatedAt": issue["updated"],
        "author": {"login": issue["author"]},
        "assignees": people(issue.get("assignees", [])),
        "labels": people(issue.get("labels", []), "name"),
    }


def pull_node(repo, pull):
    node = issue_node(repo, pull)
    node.update(
        {
            "id": "PR_%s_%d" % (repo["full_name"], pull["number"]),
            "url": web(repo, "pull", pull["number"]),
            "isDraft": pull.get("draft", False),
            "headRefName": pull["branch"],
            "reviewDecision": pull.get("review"),
            "reviewRequests": {"nodes": [{"requestedReviewer": {"login": r}} for r in pull.get("reviewers", [])]},
            "commits": {"nodes": [{"commit": {"statusCheckRollup": {"state": pull["checks"]} if pull.get("checks") else None}}]},
        }
    )
    return node


def ref_node(repo, branch):
    return {
        "id": "REF_%s_%s" % (repo["full_name"], branch["name"]),
        "name": branch["name"],
        "target": {
            "committedDate": branch["committed"],
            "message": branch["message"],
            "url": web(repo, "commit", branch.get("sha", "0" * 40)),
            "author": {"name": branch["author"], "user": {"login": branch["author"]}},
        },
    }


def encode_cursor(offset):
    return base64.b64encode(("cursor:%d" % offset).encode()).decode()


def decode_cursor(cursor):
    try:
        return int(base64.b64decode(cursor).decode().split(":", 1)[1])
    except Exception:
        raise GhError("gh: GraphQL: `%s` does not appear to be a valid cursor. (after)" % cursor)


def connection(scenario, nodes, query, field, cursor):
    first = re.search(re.escape(field) + r"\([^)]*first:(\d+)", query)
    size = scenario.get("page_size") or int(first.group(1))
    start = decode_cursor(cursor) if cursor else 0
    page = nodes[start : start + size]
    end = start + len(page)
    return {
        "nodes": page,
        "pageInfo": {"hasNextPage": end < len(nodes), "endCursor": encode_cursor(end) if page else None},
    }


# gh api ------------------------------------------------------------------------


def api(args, stdin, scenario):
    if args == ["--help"]:
        return HELP
    flags = {"--hostname": None, "--input": None}
    switches = set()
    endpoint = None
    i = 0
    while i < len(args):
        arg = args[i]
        if arg in flags:
            if i + 1 >= len(args):
                raise GhError("flag needs an argument: %s" % arg)
            flags[arg] = args[i + 1]
            i += 2
            continue
        if arg in ("--paginate", "--slurp", "--allow-escape-sequences"):
            switches.add(arg)
        elif arg.startswith("-"):
            raise GhError("unknown flag: %s" % arg)
        elif endpoint is None:
            endpoint = arg
        else:
            raise GhError("accepts 1 arg(s), received 2")
        i += 1
    if endpoint is None:
        raise GhError("accepts 1 arg(s), received 0")
    if flags["--hostname"] != "github.com":
        raise GhError("e2e fake gh: only --hostname github.com is served, got %s" % flags["--hostname"])
    if "--slurp" in switches and "--paginate" not in switches:
        raise GhError("`--paginate` required when passing `--slurp`")
    body = None
    if flags["--input"] is not None:
        if flags["--input"] != "-":
            raise GhError("e2e fake gh: --input must be -")
        body = json.loads(stdin)
    if endpoint == "graphql":
        if body is None:
            raise GhError("e2e fake gh: graphql needs --input -")
        return graphql(scenario, body)
    apply_rules(scenario, endpoint)
    return rest(scenario, endpoint, body, switches)


def rest(scenario, endpoint, body, switches):
    url = urlsplit(endpoint)
    path, query = url.path, parse_qs(url.query, keep_blank_values=True)
    param = lambda name, default=None: query.get(name, [default])[0]  # noqa: E731

    if path == "user" and body is None:
        return {"login": scenario["login"], "id": 583231, "type": "User"}
    if path == "user/repos" and body is None:
        repos = [repo_json(r) for r in sorted(scenario["repositories"], key=lambda r: r["pushed_at"], reverse=True)]
        size = scenario.get("repository_page_size") or int(param("per_page", "30"))
        pages = [repos[i : i + size] for i in range(0, len(repos), size)] or [[]]
        return pages if "--slurp" in switches else pages[0]

    m = re.fullmatch(r"repos/([\w.-]+/[\w.-]+)/(.+)", path)
    if not m:
        raise not_found()
    repo = require_repository(scenario, m.group(1))
    rest_path = m.group(2)

    if rest_path == "events" and body is None:
        per_page, page = int(param("per_page", "30")), int(param("page", "1"))
        return repo.get("events", [])[(page - 1) * per_page : page * per_page]
    if rest_path == "issues" and body is not None:
        return create_issue(scenario, repo, body)
    if body is not None:
        raise not_found()

    actions = repo.get("actions", {})
    m = re.fullmatch(r"actions/runs|actions/workflows/(\d+)/runs", rest_path)
    if m:
        runs = [r for r in actions.get("runs", []) if run_matches(r, query, m.group(1))]
        runs.sort(key=lambda r: r["created_at"], reverse=True)
        per_page, page = int(param("per_page", "30")), int(param("page", "1"))
        return {"total_count": len(runs), "workflow_runs": runs[(page - 1) * per_page : page * per_page]}
    if rest_path == "actions/workflows":
        per_page, page = int(param("per_page", "30")), int(param("page", "1"))
        workflows = actions.get("workflows", [])
        return {"total_count": len(workflows), "workflows": workflows[(page - 1) * per_page : page * per_page]}
    m = re.fullmatch(r"actions/runs/(\d+)/attempts/(\d+)/jobs", rest_path)
    if m:
        jobs = actions.get("jobs", {}).get("%s/%s" % (m.group(1), m.group(2)))
        if jobs is None:
            raise not_found()
        return {"total_count": len(jobs), "jobs": jobs}
    m = re.fullmatch(r"actions/jobs/(\d+)/logs", rest_path)
    if m:
        return job_log(actions, m.group(1), "--allow-escape-sequences" in switches)
    raise not_found()


def repo_json(repo):
    owner = repo["full_name"].split("/")[0]
    return {
        "full_name": repo["full_name"],
        "name": repo["full_name"].split("/")[1],
        "owner": {"login": owner},
        "private": repo.get("private", False),
        "archived": repo.get("archived", False),
        "has_issues": repo.get("has_issues", True),
        "pushed_at": repo["pushed_at"],
        "html_url": web(repo),
    }


def create_issue(scenario, repo, body):
    if set(body) - {"title", "body"} or not str(body.get("title", "")).strip():
        raise GhError("gh: Validation Failed (HTTP 422)")
    if not repo.get("has_issues", True):
        raise GhError("gh: Issues are disabled for this repo (HTTP 410)")
    number = scenario.get("next_number", 1)
    issue = {
        "number": number,
        "title": body["title"],
        "body": body.get("body", ""),
        "state": "OPEN",
        "updated": scenario["now"],
        "author": scenario["login"],
    }
    scenario["next_number"] = number + 1
    repo.setdefault("issues", []).insert(0, issue)
    save_scenario(scenario)
    return {
        "node_id": "I_%s_%d" % (repo["full_name"], number),
        "number": number,
        "title": issue["title"],
        "body": issue["body"],
        "html_url": web(repo, "issues", number),
        "state": "open",
        "created_at": scenario["now"],
        "updated_at": scenario["now"],
        "user": {"login": scenario["login"]},
    }


def run_matches(run, query, workflow):
    if workflow and str(run["workflow_id"]) != workflow:
        return False
    status = query.get("status", [""])[0]
    if status and status not in (run["status"], run.get("conclusion")):
        return False
    for name, field in (("branch", "head_branch"), ("event", "event")):
        value = query.get(name, [""])[0]
        if value and run[field] != value:
            return False
    created = query.get("created", [""])[0]
    if created:
        m = re.fullmatch(r">=(\S+)", created)
        if not m:
            raise GhError("e2e fake gh: unsupported created filter %s" % created)
        if timestamp(run["created_at"]) < timestamp(m.group(1)):
            return False
    return True


def timestamp(value):
    return datetime.fromisoformat(value.replace("Z", "+00:00")).timestamp()


def job_log(actions, job, escapes_allowed):
    log = actions.get("logs", {}).get(job)
    if log is None:
        raise not_found()
    if isinstance(log, dict) and "error" in log:
        raise GhError(log["error"])
    if isinstance(log, dict):
        line, size = log["generate"]["line"], log["generate"]["bytes"]
        log = (line * (size // len(line) + 1))[:size]
    if "\x1b" in log and not escapes_allowed:
        raise GhError("gh: the response contains terminal escape sequences; use --allow-escape-sequences to print them")
    return log


# GraphQL -----------------------------------------------------------------------


def graphql(scenario, body):
    query, variables = body["query"], body.get("variables") or {}
    if "search(type:ISSUE" in query:
        apply_rules(scenario, "graphql search %s" % variables["q"])
        return {"data": {"search": search(scenario, query, variables)}}
    full_name = "%s/%s" % (variables.get("owner"), variables.get("name"))
    m = re.search(r"\b(issue|pullRequest)\(number:\$number\) \{ comments\(last:", query)
    if m:
        apply_rules(scenario, "graphql comments %s#%s" % (full_name, variables["number"]))
        return {"data": {"repository": {m.group(1): comments(scenario, full_name, m.group(1), variables["number"])}}}
    m = re.search(r"repository\(owner:\$owner,name:\$name\) \{ (issues|pullRequests|refs)\(", query)
    if not m:
        raise GhError("e2e fake gh: unsupported GraphQL query (HTTP 404)")
    field = m.group(1)
    apply_rules(scenario, "graphql %s %s" % (field, full_name))
    repo = repository(scenario, full_name)
    if repo is None:
        raise GhError("gh: GraphQL: Could not resolve to a Repository with the name '%s'. (repository)" % full_name)
    if field == "issues":
        nodes = [issue_node(repo, i) for i in by_updated(repo.get("issues", []))]
    elif field == "pullRequests":
        nodes = [pull_node(repo, p) for p in by_updated(repo.get("pulls", []))]
    else:
        nodes = [ref_node(repo, b) for b in sorted(repo.get("branches", []), key=lambda b: b["name"])]
    return {"data": {"repository": {field: connection(scenario, nodes, query, field, variables.get("cursor"))}}}


def comments(scenario, full_name, field, number):
    repo = repository(scenario, full_name)
    if repo is None:
        raise GhError("gh: GraphQL: Could not resolve to a Repository with the name '%s'. (repository)" % full_name)
    items = repo.get("issues" if field == "issue" else "pulls", [])
    item = next((i for i in items if i["number"] == number), None)
    if item is None:
        raise GhError("gh: GraphQL: Could not resolve to an issue or pull request with the number of %d. (repository.%s)" % (number, field))
    return {
        "comments": {
            "nodes": [
                {
                    "author": {"login": c["author"]},
                    "body": c["body"],
                    "url": "%s#issuecomment-%d" % (web(repo, "issues" if field == "issue" else "pull", number), 1000 + n),
                    "createdAt": c["created"],
                }
                for n, c in enumerate(item.get("comments", []))
            ],
            "pageInfo": {"hasPreviousPage": False},
        }
    }


TOKEN = re.compile(r'(?:([a-z][a-z-]*):)?("(?:[^"\\]|\\.)*"|\S+)')


def unquote(value):
    if value.startswith('"') and value.endswith('"') and len(value) >= 2:
        return re.sub(r"\\(.)", r"\1", value[1:-1])
    return value


def search(scenario, query, variables):
    """GitHub's issue search over the scenario, for the qualifiers Splash sends."""
    login = scenario["login"].lower()
    me = lambda value: login if value.lower() == "@me" else value.lower()  # noqa: E731
    repos, kind, tests = [], None, []
    for key, raw in TOKEN.findall(variables["q"]):
        value = unquote(raw)
        if key == "repo":
            repos.append(value)
        elif key == "is" and value in ("issue", "pr"):
            kind = value
        elif key == "is" and value in ("open", "closed"):
            tests.append(lambda i, v=value: (i["state"] == "OPEN") == (v == "open"))
        elif key == "sort" and value == "updated-desc":
            pass
        elif key in ("author", "assignee", "label"):
            field = {"author": None, "assignee": "assignees", "label": "labels"}[key]
            tests.append(
                lambda i, f=field, v=me(value) if key != "label" else value.lower(): (
                    i["author"].lower() == v if f is None else v in [x.lower() for x in i.get(f, [])]
                )
            )
        elif key == "review" and value in ("approved", "changes_requested", "required"):
            decision = {"approved": "APPROVED", "changes_requested": "CHANGES_REQUESTED", "required": "REVIEW_REQUIRED"}[value]
            tests.append(lambda i, d=decision: i.get("review") == d)
        elif key == "review-requested":
            tests.append(lambda i, v=me(value): v in [r.lower() for r in i.get("reviewers", [])])
        elif not key:
            tests.append(lambda i, v=value.lower(): v in ("%s %s" % (i["title"], i.get("body", ""))).lower())
        else:
            raise GhError("e2e fake gh: unsupported search qualifier %s:%s" % (key, raw))
    if kind is None or not repos:
        raise GhError("e2e fake gh: search needs repo: and is:issue or is:pr")
    expected = "... on Issue {" if kind == "issue" else "... on PullRequest {"
    if expected not in query:
        raise GhError("e2e fake gh: search for is:%s without %s" % (kind, expected))
    found = []
    for name in repos:
        repo = repository(scenario, name)
        if repo is None:
            continue
        for item in repo.get("issues" if kind == "issue" else "pulls", []):
            if all(test(item) for test in tests):
                node = (issue_node if kind == "issue" else pull_node)(repo, item)
                node["repository"] = {"nameWithOwner": repo["full_name"]}
                found.append(node)
    found.sort(key=lambda n: n["updatedAt"], reverse=True)
    result = connection(scenario, found, query, "search", variables.get("cursor"))
    for decoy in scenario.get("search_decoys", []):
        if decoy["kind"] == kind:
            other = {"full_name": decoy["repository"]}
            node = (issue_node if kind == "issue" else pull_node)(other, decoy)
            node["repository"] = {"nameWithOwner": decoy["repository"]}
            result["nodes"].append(node)
    return result


# gh pr view --------------------------------------------------------------------


def pr_view(args, scenario):
    """`gh pr view <branch> --json <fields>` in a checkout of a scenario repository."""
    if len(args) != 3 or args[1] != "--json":
        raise GhError("e2e fake gh: expected pr view <branch> --json <fields>")
    branch, fields = args[0], args[2].split(",")
    origin = subprocess.run(["git", "config", "--get", "remote.origin.url"], capture_output=True, text=True).stdout.strip()
    m = re.search(r"github\.com[:/]([\w.-]+/[\w.-]+?)(?:\.git)?/?$", origin)
    repo = repository(scenario, m.group(1)) if m else None
    if repo is None:
        raise GhError("none of the git remotes configured for this repository point to a known GitHub host.")
    pulls = [p for p in by_updated(repo.get("pulls", [])) if p["branch"] == branch]
    if not pulls:
        raise GhError('no pull requests found for branch "%s"' % branch)
    pull = pulls[0]
    state = {"OPEN": "OPEN", "CLOSED": "CLOSED", "MERGED": "MERGED"}[pull["state"]]
    known = {"number": pull["number"], "url": web(repo, "pull", pull["number"]), "state": state, "title": pull["title"], "headRefName": branch}
    unknown = [f for f in fields if f not in known]
    if unknown:
        raise GhError('Unknown JSON field: "%s"' % unknown[0])
    return {f: known[f] for f in fields}


# Main --------------------------------------------------------------------------


def main(argv):
    stdin = sys.stdin.read() if "--input" in argv else ""
    log_call({"argv": argv, "stdin": stdin, "cwd": os.getcwd()})
    try:
        scenario = load_scenario()
        if argv[:1] == ["api"]:
            out = api(argv[1:], stdin, scenario)
        elif argv[:2] == ["pr", "view"]:
            out = pr_view(argv[2:], scenario)
        else:
            raise GhError('e2e fake gh: unknown command "%s" (HTTP 404)' % " ".join(argv))
    except GhError as e:
        sys.stderr.write("%s\n" % e)
        return 1
    sys.stdout.write(out if isinstance(out, str) else json.dumps(out))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
