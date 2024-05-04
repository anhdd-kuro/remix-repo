import z from "zod";

export const envSchema = z.object({
  SCOPES: z.string(),
  TRAILER_SET_DEFINITION_ID: z.string(),
  MOVIE_DEFINITION_ID: z.string(),
  SPECIAL_PROGRAM_DEFINITION_ID: z.string(),
  VITE_API_PROXY_URL: z.string(),
});

const envServer = envSchema.safeParse({
  SCOPES: process.env.SCOPES,
  TRAILER_SET_DEFINITION_ID: process.env.TRAILER_SET_DEFINITION_ID,
  MOVIE_DEFINITION_ID: process.env.MOVIE_DEFINITION_ID,
  SPECIAL_PROGRAM_DEFINITION_ID: process.env.SPECIAL_PROGRAM_DEFINITION_ID,
  VITE_API_PROXY_URL: process.env.VITE_API_PROXY_URL,
});

if (!envServer.success) {
  console.error(envServer.error.issues);
  throw new Error("There is an error with the server environment variables");
  process.exit(1);
}

export const envServerSchema = envServer.data;

type EnvSchemaType = z.infer<typeof envSchema>;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvSchemaType {}
  }
}
