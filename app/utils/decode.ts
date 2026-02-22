import { decode } from "html-entities";

export const decodeText = (value: string) => decode(value);
