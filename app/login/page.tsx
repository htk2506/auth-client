'use client'
import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import * as yup from "yup";

const validationSchema = yup.object({
  username: yup
    .string()
    .required("Username is required"),
  password: yup
    .string()
    .required("Password is required"),
});

export function LoginForm({ }: Readonly<{}>) {

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = (searchParams.get("callback_url")?.startsWith("/") ? searchParams.get("callback_url") : "/") ?? "/";

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // TODO: Trigger call to login
      alert(JSON.stringify(values, null, 2));

      // Send user back to where they came from
      router.push(callbackUrl);
    },
  });

  return (
    <Box className="flex flex-col items-center">
      <Box className="w-9/10 sm:w-sm p-5 rounded-lg" sx={{ boxShadow: 1 }}>
        <form onSubmit={formik.handleSubmit}>
          <Box className="flex flex-col gap-2">

            <Typography variant="h1" className="text-2xl mb-2">
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
              fullWidth
              color="primary"
              variant="contained"
              type="submit"
            >
              Login
            </Button>

            <Box className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-between">

              {/* TODO: Fix link */}
              <Link href="/">
                Forgot password?
              </Link>

              {/* TODO: Fix link */}
              <Link href="/">
                Create account
              </Link>
            </Box>

          </Box>
        </form>
      </Box>
    </Box>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Box>Loading...</Box>}>
      <LoginForm />
    </Suspense>
  );
}