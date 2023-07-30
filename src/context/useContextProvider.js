import React, { useContext } from "react";
import { ConfigContext } from "./config";

export default function useContextProvider() {
  return useContext(ConfigContext);
}
