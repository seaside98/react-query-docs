# React Query Intro

React (TanStack) Query helps integrate asynchronous network requests into a React frontend. 

It has a lot of features, but the main things I use it for are:

* Handling loading/error states in the UI
* Refreshing network requests to keep the current view up to date
* Retrying network requests on failure
* Caching network responses for the current page session
* Automatic requests based on user actions, for example loading the next page when they click a button.

I have used the React Query cache to fully replace Redux/Rematch in my somewhat simple React apps, but they can also work together.

## Quickstart

Once at the top level of the app, you wrap the app with a `QueryClientProvider`, which enables the other hooks to work.
See `App.tsx`.

# useQuery

The `useQuery` hook is for fetching (not modifying data), typically GET requests. 

## Handling loading/error states

The most common pattern for loading and error states can be found in `Basic.tsx`. I use something like this every single
time I need to make a network request.

```tsx
export const Basic = () => {
  const { isLoading, isError, data } = useQuery({
    queryKey: ['basic'],
    queryFn: async () => {
      const response = await mockNetworkRequest();
      return response;
    },
  });

  return (
    <div>
      {isLoading ? (
        <span>Loading.......</span>
      ) : isError ? (
        <span>Error loading page</span>
      ) : (
        <div>{data?.message}</div>
      )}
    </div>
  );
};
```

We can use `isLoading` and `isError` to determine what state the request is in. 

`data` will be populated with whatever the `queryFn` returns.

The `queryKey` is a key into the React Query cache, and should be different for each separate query. More on this later!

## Refreshing network requests to keep the current view up to date

If you only read one part of the documentation it should be this! https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults

React Query's defaults include reloading logic that might cause bugs if you aren't aware of them. 
Queries will always be refetched when:

* The user focusses the page in their browser after leaving the current window or tab (`refetchOnWindowFocus`)
* The user's network reconnects (`refetchOnReconnect`)
* A new `useQuery` is mounted (`refetchOnMount`)

To disable these, you have to explicitly add the properties as false:

```tsx
const { isLoading, isError, data } = useQuery({
  queryKey: ['basic'],
  queryFn: async () => {
    const response = await mockNetworkRequest();
    return response;
  },
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
});
```

Alternatively, you can modify the `staleTime` to make refetches happen less often.

## Retrying network requests on failure

See `BasicError.tsx` for an example, and open the console when running the app. 
React query automatically retries failed requests 3 more times with exponential backoff before showing an error to the user.

## Caching network responses for the current page session

Requests that share the same `queryKey` will share the same data cache, so you should not reuse `queryKey`s in your app unless the data
is identical.  

## Automatic requests based on user actions

See `UserInput.tsx` for an example of responding to user input. Variables can be passed to the `queryKey` to trigger new network requests as the user
interacts with the page. In this example, a new request will be made when the user changes the page.

```tsx
const [page, setPage] = useState(0);
const { isLoading, isError, data } = useQuery({
  queryKey: ['userInput', page], // <-- The important bit!
  queryFn: async () => {
    const response = await mockPageNetworkRequest(page);
    return response;
  },
});
```

## Disabling a query

The `enabled` key can be set to false to disable a query, for example when some user input is required before the query should fetch.
The following example will send a new request each time `input` changes, but only when `input` has a value.

```tsx
const [input, setInput] = useState('');
const { isLoading, isError, data } = useQuery({
  queryKey: ['queryOnlyOnInput', input],
  queryFn: async () => {
    const response = await mockNetworkRequest(input);
    return response;
  },
  enabled: input !== '',
});
```

## Beware of overwriting user input!

I would say this is definitely the trickiest part of React Query.

In general, you should be wary of changing state in the `queryFn`. This example looks like it would work fine,
populating `input` with an initial value from a network request, then allowing the user to edit. But if the user
leaves the page and comes back, the default `refetchOnWindowFocus` will cause a refetch and overwrite the user input.

```tsx
const [input, setInput] = useState('');
const { isLoading, isError } = useQuery({
  queryKey: ['initialValueFetch'],
  queryFn: async () => {
    const response = await mockNetworkRequest();
    setInput(response.value);
    return response;
  },
});

return <input onChange={(e) => setInput(e.target.value)} value={input} />
```

To fix this, we could add an additional state that disables the query once the user makes a change. I prefer this to disabling
`refetchOnWindowFocus` etc, because it allows the values to be updated with the default refetch logic before the user starts making changes.

```tsx
const [input, setInput] = useState('');
const [dirty, setDirty] = useState(false);
const { isLoading, isError } = useQuery({
  queryKey: ['initialValueFetch'],
  queryFn: async () => {
    const response = await mockNetworkRequest();
    setInput(response.value);   
    return response;
  },
  enabled: !dirty
});

return (
  <input
    onChange={(e) => {
      setInput(e.target.value);
      setDirty(true);
    }}
    value={input}
  />
);
```

# useMutation

The `useMutation` hook is used for submitting modified data (for example DELETE/POST/PUT), where requests are trigger by user
actions instead of automatically. This type of query does not retry on default. See `mutationBasic.tsx` for an example.

```tsx
const { isPending, isError, mutate } = useMutation({
  mutationFn: async () => {
    await mockNetworkRequest();

    // I typically put the `onSuccess` logic here
    doSomeSuccess();
  },
});

return <button onClick={() => mutate()}>Submit</button>
```

# useQueryClient

The `useQueryClient` hook can be used to invalidate a cached query and force a refetch. `invalidateQueries` invalidates all keys 
that start with the prefix, allowing you to bulk invalidate if you structure your keys well.

```tsx
const queryClient = useQueryClient();

// later...
const someFn = () => {
  // For example, this would invalidate the key ['configList', 'page-1']
  queryClient.invalidateQueries({ queryKey: ['configList'] }); 
}
```