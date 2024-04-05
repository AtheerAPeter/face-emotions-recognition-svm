import fs from "fs";
import Jimp from "jimp";
import csv from "csv-parser";
import path from "path";

async function convertToGrayscaleAndSaveToCSV(imageString: string) {
  try {
    const image = await Jimp.read(
      Buffer.from(
        imageString.replace(/^data:image\/(png|jpeg);base64,/, ""),
        "base64"
      )
    );

    image.greyscale();

    image.cover(
      28,
      28,
      Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE
    );

    const pixels: (string | number)[] = [];
    image.scan(
      0,
      0,
      image.bitmap.width,
      image.bitmap.height,
      (x: any, y: any, idx: string | number) => {
        const luminance = image.bitmap.data[idx as number];
        pixels.push(luminance);
      }
    );

    const columnLabels = [];
    for (let i = 1; i <= 784; i++) {
      columnLabels.push(`pixel${i}`);
    }

    columnLabels.push("id", "class");

    const idValue = 0;
    const classValue = 0;

    const csvRow = `${pixels.join(",")},${idValue},${classValue}`;

    const csv = `${columnLabels.join(",")}\n${csvRow}`;
    // save the csv as a stream to tmp
    if (!fs.existsSync("./tmp")) {
      fs.mkdirSync("./tmp");
    }

    fs.writeFileSync("./tmp/input.csv", csv, "utf8");
  } catch (error) {
    console.error(
      "Error occurred while converting image to grayscale and saving to CSV:",
      error
    );
  }
}

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

function readCSVAndCreateImage(csvFilePath: string) {
  try {
    const csvData = fs.readFileSync(csvFilePath, "utf8");
    const rows = csvData.trim().split("\n");
    const pixelValues = rows[1].split(",").map(Number);
    const image = new Jimp(28, 28);
    let pixelIndex = 0;
    for (let y = 0; y < 28; y++) {
      for (let x = 0; x < 28; x++) {
        const grayscaleValue = pixelValues[pixelIndex++];
        image.setPixelColor(
          Jimp.rgbaToInt(grayscaleValue, grayscaleValue, grayscaleValue, 255),
          x,
          y
        );
      }
    }
    image.write("generated_image.png", () => {});
  } catch (error) {
    console.error(
      "Error occurred while reading CSV and creating image:",
      error
    );
  }
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

export {
  convertToGrayscaleAndSaveToCSV,
  readCSV,
  readCSVAndCreateImage,
  saveImage,
};
