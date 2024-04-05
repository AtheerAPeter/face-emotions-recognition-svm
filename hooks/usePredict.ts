import { httpclient } from "@/HTTPclient";
import { useMutation } from "react-query";

const usePredict = () => {
  const predictMutation = useMutation(httpclient.predictApi.predict);
  return { predictMutation };
};

export default usePredict;
