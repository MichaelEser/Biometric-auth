// All biometric HTTP calls via the shared Axios instance
import type { AxiosRequestConfig } from "axios";
import api from "../lib/axios";
import type { VerifyResponse } from "../types";

export function enrollFace(imageB64: string, config?: AxiosRequestConfig) {
  return api.post("/biometric/enroll", { image_b64: imageB64 }, config);
}

export function verifyFace(imageB64: string, config?: AxiosRequestConfig) {
  return api.post<VerifyResponse>("/biometric/verify", { image_b64: imageB64 }, config);
}
