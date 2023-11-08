# fast-embeddings

An ultra-fast CLI tool to pipe text into embeddings.

## Installation & Usage

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

A pre-built *nix-compatible binary is available at `bin/embed`.

Example usage:

```bash
# Generate embeddings for the first 100k lines of data.txt and output results to output.ndjson.
cat data.txt | head -n100000 | ./bin/embed > output.ndjson
```
## Benchmarks

This tool is able to generate 100k `text-embedding-ada-002` embeddings in under 2 minutes with <100MB RAM usage and <20% CPU usage.
