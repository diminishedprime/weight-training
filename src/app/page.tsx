import Link from "next/link";
import { Button } from "@mui/material";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function Home() {
  return (
    <>
      <Breadcrumbs pathname="/" />
      <Button
        component={Link}
        href="/exercise"
        variant="contained"
        color="primary"
        sx={{ m: 1 }}
      >
        Exercises
      </Button>
    </>
  );
}
