"use client";
import Programs from "@/app/programs/_components/Programs";
import { WendlerProgramOverviews } from "@/common-types";
import Link from "@/components/Link";
import Pagination from "@/components/Pagination";
import { Paths, SearchParam, WithSearchParams } from "@/constants";
import { Button } from "@mui/material";
import React, { useCallback } from "react";

interface ProgramsClientProps {
  currentPageNum: number;
  pageCount: number;
  programOverviews: WendlerProgramOverviews;
}

const ProgramsClient: React.FC<ProgramsClientProps> = (props) => {
  const hrefFor = useCallback((pageNum: number) => {
    return WithSearchParams(Paths.Programs, [
      SearchParam.PageNum,
      pageNum.toString(),
    ]);
  }, []);

  return (
    <React.Fragment>
      <Button
        component={Link}
        href={Paths.Programs_Add}
        sx={{ alignSelf: "center" }}
        variant="contained"
      >
        New Program
      </Button>
      <Pagination
        page={props.currentPageNum}
        count={props.pageCount}
        hrefFor={hrefFor}
      />
      <Programs programOverviews={props.programOverviews} />
      <Pagination
        page={props.currentPageNum}
        count={props.pageCount}
        hrefFor={hrefFor}
      />
    </React.Fragment>
  );
};

export default ProgramsClient;
