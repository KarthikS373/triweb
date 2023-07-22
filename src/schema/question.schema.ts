import { z } from 'zod';

/*
    Question Metadata
*/
const MIN_QUESTION_SIZE = 10;
const MAX_QUESTION_SIZE = 1000;

/* 
    Question Schema
*/
const questionType = z.enum(['text', 'radio', 'checkbox']);

export const questionSchema = z.object({
  question: z.string().min(MIN_QUESTION_SIZE).max(MAX_QUESTION_SIZE),
  type: questionType,
  options: z.array(z.string().min(1)).optional(),
  required: z.boolean().optional(),
});
