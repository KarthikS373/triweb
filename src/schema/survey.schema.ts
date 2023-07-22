import { z } from 'zod';

import { questionSchema } from './question.schema';

/*
    Schema Metadata
*/
const SURVEY_TITLE_MIN_SIZE = 10;
const SURVEY_TITLE_MAX_SIZE = 100;
const SURVEY_DESCRIPTION_MIN_SIZE = 10;
const SURVEY_DESCRIPTION_MAX_SIZE = 10000;

/*
    Survey Schema
*/
export const surveySchema = z.object({
  title: z.string().min(SURVEY_TITLE_MIN_SIZE).max(SURVEY_TITLE_MAX_SIZE),
  description: z.string().min(SURVEY_DESCRIPTION_MIN_SIZE).max(SURVEY_DESCRIPTION_MAX_SIZE),
  questions: z.array(questionSchema),
  metadata: z.record(z.string()),
});

export const updateSurveySchema = z.object({
  id: z.string(),
  title: z.string().min(SURVEY_TITLE_MIN_SIZE).max(SURVEY_TITLE_MAX_SIZE).optional(),
  description: z.string().min(SURVEY_DESCRIPTION_MIN_SIZE).max(SURVEY_DESCRIPTION_MAX_SIZE).optional(),
  metadata: z.record(z.string()).optional(),
});
