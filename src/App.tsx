import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Container,
  Input,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { CustomTextField } from "./components/custom-text-field";
import "./App.css";
import parseFromCsv from "./lib/parse-from-csv";
import parseToCsv from "./lib/parse-to-csv";

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

type SampleObject = {
  column1: string;
  column2: number;
  column3: Date;
};

const columnParser = (columns: string[]): SampleObject => {
  return {
    column1: columns[0],
    column2: parseInt(columns[1]),
    column3: new Date(columns[2]),
  };
};

const propertyParser = (obj: SampleObject): string[] => [
  obj.column1,
  obj.column2.toString(),
  format(obj.column3, "yyyy-MM-dd"),
];

type FormSchema = z.infer<typeof formSchema>;

function App() {
  const [downloadUrl, setDownloadUrl] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState("");
  const [fileContents, setFileContents] = useState("");

  const form = useForm<FormSchema>({
    defaultValues: {
      encoding: "utf8",
    },
    mode: "onBlur",
    resolver: zodResolver(formSchema),
  });

  const onDownloadClick = () => {
    if (!fileContents) {
      setErrorMessage("オブジェクト内容を表示させてください。");
      return;
    }

    setErrorMessage("");

    try {
      const obj = JSON.parse(fileContents);

      const csv = parseToCsv(obj, propertyParser, {
        addHeader: true,
        eol: "lf",
      });

      setDownloadUrl(
        `data:text/plain;charset=utf-8,${encodeURIComponent(csv)}`
      );
    } catch (e) {
      setErrorMessage((e as Error).message);
    }
  };

  const onSubmit = async (data: FormSchema) => {
    const reader = new FileReader();

    reader.onerror = () => {
      setErrorMessage("読み込み失敗");
    };

    reader.onload = (ev) => {
      setErrorMessage("");

      const contents = ev.target?.result as string;
      let parsed: string;

      if (!contents) {
        parsed = "";
      } else {
        try {
          parsed = JSON.stringify(
            parseFromCsv(contents, columnParser, { skipHeader: true }),
            null,
            4
          );
        } catch (e) {
          parsed = "";
          setErrorMessage((e as Error)?.message);
        }
      }

      setFileContents(parsed);
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
            onSubmit={form.handleSubmit(onSubmit)}
            width={"100%"}
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
            <TextField fullWidth multiline rows={20} value={fileContents} />
            <Box display="flex" flexDirection="row">
              <Button
                color="primary"
                disabled={!form.formState.isValid}
                sx={{ margin: "1.5rem" }}
                type="submit"
                variant="contained"
              >
                送信
              </Button>
              <Link
                download="typescript-csv.csv"
                href={downloadUrl}
                onClick={onDownloadClick}
                sx={{ margin: "1.5rem" }}
              >
                ダウンロード
              </Link>
            </Box>
          </Box>
        </FormProvider>
      </Container>
    </>
  );
}

export default App;
