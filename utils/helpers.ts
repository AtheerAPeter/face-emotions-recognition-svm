import fs from "fs";
import csv from "csv-parser";
import path from "path";

function readCSV(filename: string): Promise<string | undefined> {
  return new Promise((resolve, reject) => {
    const results: string[] = [];
    fs.createReadStream(filename)
      .pipe(csv())
      .on("data", (data: any) => {
        results.push(data.predicted_class);
      })
      .on("end", () => {
        resolve(results[0]);
      })
      .on("error", (error: any) => {
        reject(error);
      });
  });
}

const saveImage = (base64Data: string, filename: any) => {
  const data = base64Data.replace(/^data:image\/\w+;base64,/, "");
  const filePath = path.join(process.cwd(), "tmp", filename);
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, "base64", (error) => {
      if (error) {
        reject(error);
      } else {
        resolve(`Image saved successfully as ${filename}`);
      }
    });
  });
};

export { readCSV, saveImage };
