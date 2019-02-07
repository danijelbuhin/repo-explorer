import { useState } from 'react';

export default function useApiState(initialState) {
  const [apiState, setApiState] = useState(initialState);
  return { apiState, setApiState };
}
