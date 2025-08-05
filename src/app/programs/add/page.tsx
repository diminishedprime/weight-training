import PageProgramsAdd from "@/app/programs/add/_components/_page_ProgramsAdd";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Paths } from "@/constants";
import { Suspense } from "react";

export default async function ProgramsSuspenseWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Breadcrumbs pathname={Paths.Programs_Add} />
      <PageProgramsAdd />
    </Suspense>
  );
}
