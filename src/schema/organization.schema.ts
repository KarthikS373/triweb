import { z } from 'zod';

/*
    Organization Metadata
*/

/*
    Survey Schema
*/
export const organizationSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  logo: z.string().optional(),
});
