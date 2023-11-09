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
  endDate: z.string(),
  description: z.string().min(SURVEY_DESCRIPTION_MIN_SIZE).max(SURVEY_DESCRIPTION_MAX_SIZE),
  organization: z.string().optional(),
  questions: z.array(questionSchema),
  metadata: z.record(z.string()),
});

export const updateSurveySchema = z.object({
  id: z.string(),
  title: z.string().min(SURVEY_TITLE_MIN_SIZE).max(SURVEY_TITLE_MAX_SIZE).optional(),
  description: z.string().min(SURVEY_DESCRIPTION_MIN_SIZE).max(SURVEY_DESCRIPTION_MAX_SIZE).optional(),
  metadata: z.record(z.string()).optional(),
});

export const getAllSurveySchema = z.object({
  metadata: z.enum(['true', 'false']).optional(),
  questions: z.enum(['true', 'false']).optional(),
  responses: z.enum(['true', 'false']).optional(),
});

export const getSurveyByIdSchema = z.object({
  responses: z.enum(['true', 'false']).optional(),
});

export const deleteSurveySchema = z.object({
  id: z.string(),
});

export const getSurveysByOrganizationSchema = z.object({
  organization: z.string(),
  metadata: z.enum(['true', 'false']).optional(),
  questions: z.enum(['true', 'false']).optional(),
  responses: z.enum(['true', 'false']).optional(),
});
