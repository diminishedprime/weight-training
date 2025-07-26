import ExerciseBlockClient from "@/app/exercise-block/_components/ExerciseBlockTable";
import { requireLoggedInUser, supabaseRPC } from "@/serverUtil";
import { notFoundIfNull } from "@/util";

interface PageExerciseBlockProps {
  pageNum: number;
}

export default async function PageExerciseBlock(props: PageExerciseBlockProps) {
  const { userId } = await requireLoggedInUser("/exercise-block");

  const { page_count: pageCount, blocks } = await supabaseRPC(
    "get_exercise_blocks",
    {
      p_user_id: userId,
      p_page: props.pageNum,
    },
  );
  notFoundIfNull(blocks);
  notFoundIfNull(pageCount);

  return (
    <ExerciseBlockClient
      blocks={blocks}
      currentPageNum={props.pageNum}
      pageCount={pageCount}
    />
  );
}
