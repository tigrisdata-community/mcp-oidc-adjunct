variable "GITHUB_SHA" { default = "devel" }

group "default" {
  targets = [
    "adjunct",
  ]
}

target "adjunct" {
  context = "."
  dockerfile = "./Dockerfile"
  platforms = [
    "linux/amd64",
    "linux/arm64",
  ]
  pull = true
  tags = [
    "ghcr.io/tigrisdata-community/mcp-oauth-adjunct:latest",
    "ghcr.io/tigrisdata-community/mcp-oauth-adjunct:${GITHUB_SHA}"
  ]
}
