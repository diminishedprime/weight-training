import ExerciseBlockPage from "@/app/exercise-block/_page";
import Breadcrumbs from "@/components/Breadcrumbs";
import React, { Suspense } from "react";

interface SuspenseWrapperProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SuspenseWrapper(props: SuspenseWrapperProps) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  return (
    <React.Fragment>
      <Breadcrumbs
        pathname="/exercise-block"
        labels={{ "/exercise-block": "Exercise Block" }}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <ExerciseBlockPage page={page} />
      </Suspense>
    </React.Fragment>
  );
}
