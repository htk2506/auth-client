'use client'

import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";

const validationSchema = yup.object({
  username: yup
    .string()
    .required("Username is required"),
  password: yup
    .string()
    .required("Password is required"),
});

export default function LoginPage({ }: Readonly<{}>) {
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // TODO: Trigger call to login
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <Box className="flex h-full flex-col items-center justify-center gap-2">
      <Container maxWidth="sm" className="shadow-md/25 p-5 rounded-lg">
        <Typography variant="h1" className="text-2xl">
          Login
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="username"
            name="username"
            label="Username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />
          <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <Button
            color="primary"
            variant="contained"
            type="submit"
          >
            Login
          </Button>
        </form>
      </Container>
    </Box>
  );
}