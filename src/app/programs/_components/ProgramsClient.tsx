"use client";
import Programs from "@/app/programs/_components/Programs";
import { ProgramOverviews } from "@/common-types";
import Link from "@/components/Link";
import Pagination from "@/components/Pagination";
import { PATHS } from "@/constants";
import { Button, Stack } from "@mui/material";

interface ProgramsClientProps {
  currentPageNum: number;
  pageCount: number;
  programOverviews: ProgramOverviews;
}

const ProgramsClient: React.FC<ProgramsClientProps> = (props) => {
  return (
    <Stack spacing={1} flex={1} justifyContent="space-between">
      <Button
        component={Link}
        href={PATHS.Programs_Add}
        sx={{ alignSelf: "center" }}
        variant="contained"
      >
        Add Program
      </Button>
      <Stack spacing={1}>
        <Pagination
          page={props.currentPageNum}
          count={props.pageCount}
          hrefFor={(pageNum) => PATHS.PaginatedPrograms(pageNum)}
        />
        <Programs programOverviews={props.programOverviews} />
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
