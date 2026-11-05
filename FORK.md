# Harness compatibility

## Harness 0.2.2-rc.1

Version `0.6.30-dsh.20261104.2` uses the native batch executor and model-step tool admission. Claude routes exclude `mcp_probe` while retaining other MCP tools and the panel's direct probe action. The assembly filter remains for earlier compatible Harness versions. Client tests use matching React and React DOM versions.

## Harness 0.2.2-alpha.2

Version `0.6.29-dsh.20261028.1` admits the Harness 0.2.2-alpha.2 and matching Cordis package cohort. Existing account authorization, data roots and plugin configuration are retained. Runtime acceptance is recorded separately from source and artifact checks.

The runtime engine declaration includes Harness 0.2.2-alpha.2. Peer ranges name the supported prerelease lines explicitly so npm does not simplify a wildcard union and drop prerelease admission. Earlier local October 28 .1 artifacts were not uploaded and are superseded.
