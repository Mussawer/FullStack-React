import { useEffect, useCallback, useReducer } from "react";
import { server } from "./server";

//The State interface will contain the data object that will be returned from our API call. 
//The shape of data will be from a type variable the interface will accept and be passed from the useQuery Hook function.
//The shape of data will only be what the TData type variable is after our API call has been made complete. 
interface State<TData> {
  data: TData | null;
  loading: boolean;
  error: boolean;
}

type Action<TData> =
  | { type: "FETCH" }
  | { type: "FETCH_SUCCESS"; payload: TData }
  | { type: "FETCH_ERROR" };

interface QueryResult<TData> extends State<TData> {
  refetch: () => void;
}

// A reducer() function is a function that receives the current state and an action that would return the new state.
//The action parameter of the reducer function is to be an object that might contain a payload value we can use to 
//update the state with. action is to usually contain a type property describing what kind of action is being made.
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

export const useQuery = <TData = any>(query: string): QueryResult<TData> => {
  //The data property within state is currently unknown because we haven’t passed a value for the TData type variable the reducer() 
  //function expects. Here’s where we can do something interesting that can help us achieve this. Instead of passing the reducer() 
  //function directly to the useReducer Hook, we can pass in a function that returns the expected reducer() function . This will help 
  //us pass along the TData type variable from the useQuery Hook to the reducer() function.
  const fetchReducer = reducer<TData>();

  //The useReducer Hook returns two values in a tuple - the state object itself and a dispatch function used to trigger an action.
  //The useReducer Hook takes a minimum of two arguments - the first being the reducer() function itself and the second being the 
  //initial state. We’ll pass in the reducer() function we’ve created and declare the initial state object like we’ve done with the 
  //useState Hook
  const [state, dispatch] = useReducer(fetchReducer, {
    data: null,
    loading: false,
    error: false,
  });

  //The useCallback Hook returns a memoized version of the callback being passed in. 
  //Memoization is a technique geared towards improving performance by storing the results of function calls 
  //and returning the cached result when the same inquiry for the function is made again.


  //We’re not sure how the fetchApi() function will behave as the component gets updated and we only want fetchApi() 
  //to run on initial mount, so we instead use the useCallback Hook to memoise our callback function to never change unless 
  //the query parameter changes,
  const fetch = useCallback(() => {
    //The fetchApi() function will be responsible for making the API request by running the server.fetch() function. 
    //As we run server.fetch() , we’ll pass in the query payload it expects and a type variable of the data that is to be returned.
    const fetchApi = async () => {
      try {
        dispatch({ type: "FETCH" });

        const { data, errors } = await server.fetch<TData>({ query });

        if (errors && errors.length) {
          throw new Error(errors[0].message);
        }

        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch {
        dispatch({ type: "FETCH_ERROR" });
      }
    };

    fetchApi();
  }, [query]);

  //We’ve used the useEffect Hook to attempt to run our server.fetch() function when a component mounts for the first time.
  useEffect(() => {
    fetch();
  }, [fetch]);

  //The fetchApi() function in our useQuery Hook is the function we’ll want to run again if we 
  //needed to refetch query information and update state.
  return { ...state, refetch: fetch };
};
