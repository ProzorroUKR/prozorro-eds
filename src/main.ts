import "@@/public/libs/eusign.js";
import { Eds } from "./services/Eds";

const eds = new Eds();

if (typeof window !== "undefined") {
  (window as any).eds = eds;
}

export { eds };
