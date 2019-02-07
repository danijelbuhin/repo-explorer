import { useState } from 'react';

export default function useApiState(initialState = { isLoading: false, hasError: false }) {
  const [apiState, setApiState] = useState(initialState);
  return [apiState, setApiState];
}
