import React from "react";
import { Input, type InputProps } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

/** カスタム Input のプロパティ */
type CustomInputProps = {
  field?: any[];
  name: string;
} & InputProps;

/** カスタム Input コンポーネント */
export const CustomInput = ({ name, ...props }: CustomInputProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, formState: { errors, isValid } }) => (
        <Input
          error={!!errors[name]}
          fullWidth
          id={name}
          {...field}
          {...props}
          {...control.register(name)}
        />
      )}
    />
  );
};
