"use client";

import Block from "@/app/superblocks/[superblock_id]/perform/_components/Block";
import { GetPerformSuperblockResult, UserPreferences } from "@/common-types";
import DisplayCompletionStatus from "@/components/display/DisplayCompletionStatus";
import DisplayDuration from "@/components/display/DisplayDuration";
import DisplayStopwatch from "@/components/display/DisplayStopwatch";
import LabeledValue from "@/components/LabeledValue";
import Link from "@/components/Link";
import TODO from "@/components/TODO";
import { Paths } from "@/constants";
import { usePersistentString } from "@/hooks";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, Stack, Switch, Typography } from "@mui/material";
import { useMemo, useState } from "react";

interface PerformClientProps {
  userId: string;
  initialSuperblock: GetPerformSuperblockResult;
  preferences: UserPreferences;
  path: string;
}

const PerformClient: React.FC<PerformClientProps> = (props) => {
  const api = usePerformClientAPI(props);
  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1} alignItems="center" useFlexGap>
        <Stack direction="row" spacing={1} alignItems="center" useFlexGap>
          <DisplayCompletionStatus
            completionStatus={api.superblock.completion_status}
          />
          <Typography
            variant="h5"
            sx={{ display: "flex", alignItems: "center" }}
          >
            {api.superblock.name}
          </Typography>
          <IconButton
            color="warning"
            component={Link}
            href={Paths.Superblocks_SuperblockId_Edit(
              props.initialSuperblock.id,
            )}
          >
            <EditIcon />
          </IconButton>
        </Stack>
        <Stack flex={1} />
        {api.canNotify && (
          <LabeledValue label="Notify" alignItems={"center"}>
            <Switch
              checked={api.notify}
              onChange={(_) => api.setNotify((o) => !o)}
            />
          </LabeledValue>
        )}
      </Stack>
      {api.superblock.completion_status === "in_progress" &&
        api.superblock.started_at && (
          <LabeledValue label="Time Since start" alignItems="center">
            <DisplayStopwatch start={new Date(api.superblock.started_at)} />
          </LabeledValue>
        )}
      {api.superblock.completion_status === "completed" &&
        api.superblock.started_at &&
        api.superblock.completed_at && (
          <LabeledValue label="Total Duration" alignItems="center">
            <DisplayDuration
              from={new Date(api.superblock.started_at)}
              to={new Date(api.superblock.completed_at)}
              highResolution
            />
          </LabeledValue>
        )}
      <TODO>
        See if I can make the screen "scrollTo" when the active block changes.
      </TODO>
      <TODO>Add in ability to skip entire blocks within a superblock.</TODO>
      {api.superblock.blocks.map((block) => (
        <Block
          key={block.id}
          superblock={api.superblock}
          setSuperblock={api.setSuperblock}
          userId={props.userId}
          block={block}
          initialSuperblock={props.initialSuperblock}
          preferences={props.preferences}
          path={props.path}
          open={api.selectedBlockId === block.id}
          setOpen={() =>
            api.setSelectedBlockId((old) => (old === block.id ? "" : block.id))
          }
          notify={api.notify}
        />
      ))}
      <TODO>Add in a "add block" form thingy here.</TODO>
    </Stack>
  );
};

export default PerformClient;

const usePerformClientAPI = (props: PerformClientProps) => {
  const {
    preferences: { pushover_api_token, pushover_user_key },
  } = props;

  const [superblock, setSuperblock] = useState(props.initialSuperblock);
  const [selectedBlockId, setSelectedBlockId] = usePersistentString(
    props.initialSuperblock.blocks[0]?.id ?? "",
    props.path,
    "selectedBlockId",
  );
  const [notify, setNotify] = useState(false);

  const canNotify = useMemo(() => {
    return !!(pushover_api_token && pushover_user_key);
  }, [pushover_api_token, pushover_user_key]);

  return {
    canNotify,
    notify,
    setNotify,
    superblock,
    setSuperblock,
    selectedBlockId,
    setSelectedBlockId,
  };
};
