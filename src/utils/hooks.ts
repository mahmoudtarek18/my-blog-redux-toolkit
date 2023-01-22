import { ApplicationDispatch, ApplicationState } from "../store";
import { useDispatch } from "react-redux";
import { TypedUseSelectorHook, useSelector } from "react-redux/es/exports";

export const useAppDispatch: () => ApplicationDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<ApplicationState> =
  useSelector;
