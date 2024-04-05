import React, { useCallback, useState, useRef } from "react";
import Webcam from "react-webcam";
import { Spinner } from "@chakra-ui/react";
import usePredict from "@/hooks/usePredict";
import { emotions } from "@/constants/predictionsMapper";

export default function Home() {
  const webcamRef = useRef<Webcam>(null);
  const [prediction, setPrediction] = useState<string | undefined>();
  const { predictMutation } = usePredict();

  const capture = useCallback(async () => {
    const image = webcamRef.current?.getScreenshot({
      width: 48,
      height: 48,
    });
    if (image) {
      const prediction = await predictMutation.mutateAsync(image!);
      setPrediction(prediction);
    }
  }, []);

  return (
    <div className="h-screen relative flex items-end justify-center">
      <div className="absolute h-full w-full inset-0 -z-20">
        <Webcam
          screenshotQuality={1}
          mirrored
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="h-full w-full"
          videoConstraints={{
            facingMode: "user",
            height: 48,
            width: 48,
          }}
        />
      </div>
      <div className="bg-white shadow-lg rounded-full m-5 p-5 w-full flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {prediction && emotions[Number(prediction)].name}{" "}
          {prediction && emotions[Number(prediction)].emoji}
        </h1>
        <button
          className="bg-black text-white rounded-full h-12 w-44 flex items-center justify-center gap-4 font-bold"
          onClick={() => capture()}
        >
          {predictMutation.isLoading && <Spinner />} Predict
        </button>
      </div>
    </div>
  );
}
