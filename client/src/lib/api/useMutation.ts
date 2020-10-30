import { useReducer } from "react";
import { server } from "./server";

interface State<TData> {
  data: TData | null;
  loading: boolean;
  error: boolean;
}

type Action<TData> =
  | { type: "FETCH" }
  | { type: "FETCH_SUCCESS"; payload: TData }
  | { type: "FETCH_ERROR" };

type MutationTuple<TData, TVariables> = [
  (variable?: TVariables | undefined) => Promise<void>,
  State<TData>
];

//A reducer() function is a function that receives the current state and an action that would return the new state.
const reducer = <TData>() => (
  state: State<TData>,
  action: Action<TData>
): State<TData> => {
  switch (action.type) {
    case "FETCH":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { data: action.payload, loading: false, error: false };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: true };
    default:
      throw new Error();
  }
};

//Our useMutation Hook will behave differently since we won’t want a mutation to run the moment a component mounts by default.
//Our useMutation Hook will simply receive the mutation query document to be made.

//TData is to represent the shape of data that can be returned from the mutation while TVariables is to represent
//the shape of variables the mutation is to accept.

//The term query here is used to reference the GraphQL request that is to be made

//In useMutation however, we’re not using a useEffect Hook since we want the component to determine
//when a request should be made. We also destruct the values as an array instead of an object.
export const useMutation = <TData = any, TVariables = any>(
  query: string
): MutationTuple<TData, TVariables> => {
  const fetchReducer = reducer<TData>();

  const [state, dispatch] = useReducer(fetchReducer, {
    data: null,
    loading: false,
    error: false,
  });

  const fetch = async (variables?: TVariables) => {
    try {
      dispatch({ type: "FETCH" });

      const { data, errors } = await server.fetch<TData, TVariables>({
        query,
        variables,
      });

      if (errors && errors.length) {
        throw new Error(errors[0].message);
      }

      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch {
      dispatch({ type: "FETCH_ERROR" });
    }
  };

  return [fetch, state];
};
