import {useEffect} from "react";
import {Actions, useRackDispatch} from "../../../contexts/RackContext";

function Oscillator() {
  const dispatch = useRackDispatch();
  useEffect(() => {
    // create audio node
    // update module in 
    dispatch({ actionType: Actions.AddModule, message: { module: '' } });
  }, []);
  return <>Hello Oscillator</>;
}

export default Oscillator;
