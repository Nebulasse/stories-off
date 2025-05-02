export type User = {
  id: string;
  email: string;
  created_at: string;
};

export type Style = 'bold' | 'romantic' | 'random';

export type Response = {
  id: string;
  text: string;
  style: Style;
  created_at: string;
};

export type Message = {
  id: string;
  user_id: string;
  text: string;
  style: Style;
  responses: Response[];
  created_at: string;
}; 