'use client'

import { Box, Button, Link, TextField, Typography } from "@mui/material";
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
    <Box className="grid grid-cols-1 gap-2 place-items-center">
      <Box className="mx-2 sm:w-sm p-5 rounded-lg grid grid-cols-1 gap-2" sx={{ boxShadow: 1 }}>
        <form onSubmit={formik.handleSubmit}>
          <Typography variant="h1" className="text-2xl mb-4">
            Login
          </Typography>
          <TextField
            fullWidth
            id="username"
            name="username"
            label="Username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username || " "}
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
            helperText={formik.touched.password && formik.errors.password || " "}
          />
          <Button
            color="primary"
            variant="contained"
            type="submit"
            className="w-full"
          >
            Login
          </Button>
          <Box className="mt-5 gap-2 flex flex-col sm:flex-row sm:justify-between">
            {/* TODO: Fix link */}
            <Link href="/">
              Forgot password?
            </Link>
            {/* TODO: Fix link */}
            <Link href="/">
              Create account
            </Link>
          </Box>
        </form>
      </Box>
    </Box>
  );
}