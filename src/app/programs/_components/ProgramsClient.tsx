"use client";
import Programs from "@/app/programs/_components/Programs";
import { RNNProgram } from "@/common-types";
import Pagination from "@/components/Pagination";
import { PATHS } from "@/constants";
import { Stack } from "@mui/material";

interface ProgramsClientProps {
  currentPageNum: number;
  pageCount: number;
  programs: RNNProgram[];
}

const ProgramsClient: React.FC<ProgramsClientProps> = (props) => {
  return (
    <Stack spacing={1} flex={1} justifyContent="space-between">
      <Stack spacing={1}>
        <Pagination
          page={props.currentPageNum}
          count={props.pageCount}
          hrefFor={(pageNum) => PATHS.PaginatedPrograms(pageNum)}
        />
        <Programs programs={props.programs} />
      </Stack>
      <Pagination
        page={props.currentPageNum}
        count={props.pageCount}
        hrefFor={(pageNum) => PATHS.PaginatedPrograms(pageNum)}
      />
    </Stack>
  );
};

export default ProgramsClient;
