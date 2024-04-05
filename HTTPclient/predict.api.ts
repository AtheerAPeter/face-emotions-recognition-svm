import { IPredictResponse } from "@/interfaces/IPredict";
import { Axios } from "axios";

export const PredictApi = (request: Axios) => ({
  predict: async (image: string) => {
    const response = await request.post<IPredictResponse>("predict", { image });
    return response.data.prediction;
  },
});
