// Just like how the data of a request is to be typed, it can be helpful if we’re able to type define
// the expected variables of a request since every request may expect different variables. Because of this,
// we’ll make the Body interface a generic that accepts a TVariables type with which will be the type of the variables field.
interface Body<TVariables> {
  query: string;
  variables?: TVariables;
}

export const server = {
  //function can accept a type variable denoted by TData.
  fetch: async <TData = any, TVariables = any>(body: Body<TVariables>) => {
    //We’ll assign the results of the window fetch() method to a constant variable we’ll call res (i.e. response).
    //Window fetch() is a promise .

    //The first argument of the window fetch() method is a required argument that is the reference to the path of the
    // resource we want to fetch. In our instance, the path or endpoint of our API is http://localhost when our
    // server is running. If we were to directly use the http://localhost in our fetch() method, our client Webpack
    // server ( http://localhost:3000 ) will attempt to load a resource from a different origin ( http://localhost ).
    // This will essentially be performing Cross-Origin Resource Sharing and for security reasons, browsers may reject the
    // ability for our client to make the request to the server. To avoid this, we can have our Webpack Server proxy requests
    // intended for our API Server.

    //When our server.fetch() function gets called, we’ll expect an object to contain the GraphQL document.
    //We’ll label the GraphQL document as query regardless if a GraphQL query or mutation is being invoked.
    const res = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    //In our instance, we’ll type assert the returned statement as Promise<{ data: TData }> .
    //Type assertions are a TypeScript capability where one can override the types that TypeScript either infers or analyzes.
    return res.json() as Promise<{ data: TData; errors: Error[] }>;
  },
};
