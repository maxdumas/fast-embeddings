# fast-embeddings

An ultra-fast CLI tool to pipe text into embeddings.

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
