export interface Payload {
  sub: string;
  exp: number;
}

export interface Token {
  signature: string;
  payload: Payload;
}
