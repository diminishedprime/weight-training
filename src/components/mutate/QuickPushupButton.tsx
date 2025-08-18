"use client";

import { LOADING_SX, Paths } from "@/constants";
import { useRPCMutation } from "@/hooks";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface Props {
  userId: string;
}

const QuickPushupButton: React.FC<Props> = (props) => {
  const api = useQuickPushupApi(props);
  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={api.addPushupsSuperblock}
      sx={{ ...LOADING_SX(api.isMutating) }}
    >
      Quick Pushups (5x5)
    </Button>
  );
};

export default QuickPushupButton;

const useQuickPushupApi = (props: Props) => {
  const { userId } = props;
  const router = useRouter();
  const { trigger: quickSuperblockServer, isMutating } = useRPCMutation(
    "quick_superblock",
    useCallback((e) => `Error calling quick_superblock, ${e}`, []),
  );

  const addPushupsSuperblock = useCallback(async () => {
    const superblockId = await quickSuperblockServer({
      p_block_name: "Pushups",
      p_equipment_type: "bodyweight",
      p_exercise_type: "bodyweight_pushup",
      p_reps: 5,
      p_sets: 5,
      p_superblock_name: "Quick Pushups",
      p_target_weight: 0,
      p_user_id: userId,
      p_weight_unit: "pounds",
    });
    router.push(Paths.Superblocks_SuperblockId_Perform(superblockId));
  }, [userId, quickSuperblockServer, router]);

  return { isMutating, addPushupsSuperblock };
};
