/**
 * Custom Redux hooks with TypeScript support.
 * Based on Jafra's Redux hook patterns.
 */

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '@/libs/core/state/store';

// Typed versions of useDispatch and useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
