import type { Record } from './global';

/*
  Survey Interface
*/
export interface IResponseSurvey {
  id: string;
  user: {
    id: string;
    name: string;
    address: `0x${string}`;
  };
  name: string;
  slug: string;
  metadataCID: string;
  questionsCID: string;
  metadata: Record | null;
  questions: Array<IQuestion> | null;
  responses: Array<IResponse> | null;
}

/*
    Response Interface
*/
export interface IResponse {
  id: string;
  user: {
    id: string;
    name: string;
    address: `0x${string}`;
  };
  response: Record | null;
  responseCID: string;
}

/*
    Question Interface
*/
export interface IQuestion {
  question: string;
  type: string;
  required: boolean;
}

