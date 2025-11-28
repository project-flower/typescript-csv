import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Container,
  Input,
  TextField,
  Typography,
} from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { CustomTextField } from "./components/custom-text-field";
import "./App.css";

/** フォーム スキーマ */
const formSchema = z.object({
  encoding: z.string().optional(),
  file: z.custom<FileList>(
    (file) => file instanceof FileList && file.length > 0,
    {
      message: "required.",
    }
  ),
});

type FormSchema = z.infer<typeof formSchema>;

function App() {
  const [errorMessage, setErrorMessage] = useState("");
  const [fileContents, setFileContents] = useState("");

  const form = useForm<FormSchema>({
    defaultValues: {
      encoding: "utf8",
    },
    mode: "onBlur",
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormSchema) => {
    const reader = new FileReader();

    reader.onerror = () => {
      setErrorMessage("読み込み失敗");
    };

    reader.onload = (ev) => {
      setErrorMessage("");
      setFileContents((ev.target?.result as string) || "");
    };

    reader.readAsText(data.file[0], data.encoding);
  };

  return (
    <>
      <Container>
        <FormProvider {...form}>
          <Box
            alignItems="center"
            component="form"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            margin="5em"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <Typography className="m-1" variant={"h5"}>
              入力してください
            </Typography>
            <CustomTextField label="エンコード" name="encoding" />
            <Input
              fullWidth
              inputProps={{ accept: ".csv" }}
              type="file"
              {...form.register("file")}
            />
            <Typography>{errorMessage}</Typography>
            <TextField fullWidth multiline rows={10} value={fileContents} />
            <Button
              color="primary"
              disabled={!form.formState.isValid}
              sx={{ margin: "1.5rem 0" }}
              type="submit"
              variant="contained"
            >
              送信
            </Button>
          </Box>
        </FormProvider>
      </Container>
    </>
  );
}

export default App;
