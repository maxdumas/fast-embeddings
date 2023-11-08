import { Readable } from "node:stream";

import { map, zip } from "lodash/fp";
import OpenAI from "openai";
import { batch, compose, flatMap, parallelMap } from "stromjs";

import { split } from "./split.ts";

const openai = new OpenAI();

const processingStream = compose(
  [
    Readable.fromWeb(Bun.stdin.stream()),
    split(),
    batch(250),
    parallelMap(async (batch: string[]) => {
      const embeddingResult = await openai.embeddings.create(
        {
          model: "text-embedding-ada-002",
          input: batch,
        },
        { maxRetries: 20 }
      );
      const embeddings = embeddingResult.data;

      if (embeddings.length !== batch.length) {
        throw new Error("Not all inputs in the batch produced an embedding!");
      }

      return zip(
        batch,
        map((e) => e.embedding, embeddings)
      );
    }, 50),
    flatMap(
      map(([input, embedding]) => JSON.stringify({ input, embedding }) + "\n")
    ),
  ],
  (err) => {
    console.error(err.stack);
    process.exit(1);
  }
);

processingStream.pipe(process.stdout);
