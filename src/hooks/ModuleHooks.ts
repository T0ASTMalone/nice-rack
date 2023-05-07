import { useMemo, useState } from "react";
import type { ParamOptions } from "../types/RackTypes";

export const useStep = (param: string | AudioParam) => {
  return useMemo(() => {
    if (typeof param === 'string') {
      return;
    }
    if (param.maxValue === 3.4028234663852886e+38) {
      console.log('[useStep] param.max ', param.maxValue);
    }
    return param.maxValue - param.minValue <= 100 ? 0.001 : 0.01;    
  }, [param]);
}

export const useParams = (paramMap?: Map<string, AudioParam>) => {
  const [paramValues, setParamValues] = useState(paramMap ? Object.fromEntries(paramMap) : null)

  const params = useMemo(() => {
    if (!paramValues) { 
      return [];
    }
    return Object.entries(paramValues);
  }, [paramMap]);

  return { values: paramValues, setValues: setParamValues, params };
}

export const useMinMax = (name: string, param: AudioParam | string, opt?: ParamOptions) => {
  return useMemo(() => {
    if (typeof param === 'string') {
      return { min: undefined, max: undefined };
    }
    return {
      min: opt?.min ?? param.minValue,
      max: opt?.max ?? param.maxValue,
    }
  }, [param, opt, name])
}
