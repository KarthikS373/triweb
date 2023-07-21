import { z } from 'zod';

/*
    Response Metadata
*/
const MIN_RESPONSE_SIZE = 5;
const MAX_RESPONSE_SIZE = 100_000;

/* 
    Question Schema
*/
export const responseSchema = z.object({
  question: z.string(),
  response: z.string().min(MIN_RESPONSE_SIZE).max(MAX_RESPONSE_SIZE),
});

export const addResponseSchema = z.object({
  survey: z.string(),
  response: z.array(responseSchema),
});
