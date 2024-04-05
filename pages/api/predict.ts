import {
  convertToGrayscaleAndSaveToCSV,
  readCSV,
  readCSVAndCreateImage,
  saveImage,
} from "@/utils/helpers";
import type { NextApiRequest, NextApiResponse } from "next";
import { spawnSync } from "child_process";
import fs from "fs";

type Data = {
  prediction?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await saveImage(req.body.image, "input.jpg");
  await spawnSync("python3", ["predict.py"]);
  const prediction = await readCSV("./tmp/output.csv");
  res.status(200).json({ prediction });
}
