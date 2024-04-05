import Axios from "axios";
import { PredictApi } from "./predict.api";

const DEVELOP_URL = "api/";
const client = Axios.create();

client.defaults.baseURL = DEVELOP_URL;

const httpclient = {
  predictApi: PredictApi(client),
};

export { httpclient, DEVELOP_URL, client };
