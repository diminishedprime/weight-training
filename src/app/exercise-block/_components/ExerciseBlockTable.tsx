"use client";

import ExerciseBlockRow from "@/app/exercise-block/_components/ExerciseBlockRow";
import { ExerciseBlocks } from "@/common-types";
import Pagination from "@/components/Pagination";
import { pathForPaginatedExerciseBlocksPage } from "@/constants";
import { Stack, Typography } from "@mui/material";

interface ExerciseBlockClientProps {
  blocks: NonNullable<ExerciseBlocks>;
  pageCount: number;
  currentPageNum: number;
}

const useExerciseBlockClientAPI = (_props: ExerciseBlockClientProps) => {
  // TODO
};

const ExerciseBlockClient: React.FC<ExerciseBlockClientProps> = (props) => {
  const _api = useExerciseBlockClientAPI(props);

  if (props.blocks.length === 0) {
    return (
      <Stack>
        <Typography variant="body1" color="textSecondary">
          No exercise blocks found.
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={1}>
      <Pagination
        page={props.currentPageNum}
        count={props.pageCount}
        hrefFor={(pageNum) => pathForPaginatedExerciseBlocksPage(pageNum)}
      />
      {props.blocks.map((block) => (
        <ExerciseBlockRow key={block.id} block={block} />
      ))}
      <Pagination
        page={props.currentPageNum}
        count={props.pageCount}
        hrefFor={(pageNum) => pathForPaginatedExerciseBlocksPage(pageNum)}
      />
    </Stack>
  );
};

export default ExerciseBlockClient;
