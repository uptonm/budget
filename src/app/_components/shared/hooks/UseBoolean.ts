import { useCallback, useState } from "react";

type UseBooleanArgs = {
  defaultValue: boolean;
};

type UseBooleanPayload = {
  value: boolean;
  setTrue: () => void;
  setFalse: () => void;
  setValue: (value: boolean) => void;
  toggle: () => void;
};

export const useBoolean = ({
  defaultValue,
}: UseBooleanArgs): UseBooleanPayload => {
  const [value, setValue] = useState<boolean>(defaultValue ?? false);

  const setTrue = useCallback(() => setValue(true), []);

  const setFalse = useCallback(() => setValue(false), []);

  const toggle = useCallback(() => setValue((prev) => !prev), []);

  return {
    value,
    setTrue,
    setFalse,
    setValue,
    toggle,
  };
};
