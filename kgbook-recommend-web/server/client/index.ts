import { Aladin } from "aladin-client";

export const aladinClient = new Aladin({
  ttbKey: process.env.TTB_KEY ?? "ttbkimhyejung121541001",
});
