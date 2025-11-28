import React from "react";
import { TextField, type TextFieldProps } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

/** カスタム TextField のプロパティ */
type CustomTextFieldProps = {
  className?: string;
  field?: any[];
  name: string;
} & TextFieldProps;

/** カスタム TextField コンポーネント */
export const CustomTextField = ({
  className,
  name,
  ...props
}: CustomTextFieldProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, formState: { errors, isValid } }) => (
        <TextField
          className={className}
          error={!!errors[name]}
          fullWidth
          helperText={errors[name]?.message as string}
          id={name}
          variant="standard"
          {...props}
          {...field}
          {...control.register(name)}
        />
      )}
      rules={{
        required: { value: !!props.required, message: "入力してください" },
      }}
    />
  );
};
