"use client";
import Programs from "@/app/programs/_components/Programs";
import { WendlerProgramOverviews } from "@/common-types";
import Link from "@/components/Link";
import Pagination from "@/components/Pagination";
import { PATHS } from "@/constants";
import { Button, Stack } from "@mui/material";

interface ProgramsClientProps {
  currentPageNum: number;
  pageCount: number;
  programOverviews: WendlerProgramOverviews;
}

const ProgramsClient: React.FC<ProgramsClientProps> = (props) => {
  return (
    <Stack spacing={1} flex={1} justifyContent="space-between">
      <Stack spacing={1}>
        <Button
          component={Link}
          href={PATHS.Programs_Add}
          sx={{ alignSelf: "center" }}
          variant="contained"
        >
          New Program
        </Button>
        {props.pageCount > 1 && (
          <Pagination
            page={props.currentPageNum}
            count={props.pageCount}
            hrefFor={(pageNum) => PATHS.PaginatedPrograms(pageNum)}
          />
        )}
        <Programs programOverviews={props.programOverviews} />
      </Stack>
      {props.pageCount > 1 && (
        <Pagination
          page={props.currentPageNum}
          count={props.pageCount}
          hrefFor={(pageNum) => PATHS.PaginatedPrograms(pageNum)}
        />
      )}
    </Stack>
  );
};

export default ProgramsClient;
