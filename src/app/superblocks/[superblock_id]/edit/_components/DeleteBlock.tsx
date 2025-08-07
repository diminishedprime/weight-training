"use client";

import { deleteBlock as serverDeleteBlock } from "@/app/superblocks/[superblock_id]/edit/_components/actions";
import { GetPerformSuperblockBlock } from "@/common-types";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useCallback, useState } from "react";

interface DeleteBlockProps {
  userId: string;
  block: GetPerformSuperblockBlock;
  superblockId: string;
}

const DeleteBlock: React.FC<DeleteBlockProps> = (props) => {
  const api = useDeleteBlockAPI(props);
  return (
    <React.Fragment>
      <Button
        variant="outlined"
        color="error"
        onClick={api.handleOpen}
        startIcon={<DeleteIcon />}
      >
        Delete
      </Button>
      <Dialog open={api.open} onClose={api.handleClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={api.handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <Typography component="span" color="secondary">
              {props.block.name}
            </Typography>
            ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={api.handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={api.handleConfirmDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default DeleteBlock;

const useDeleteBlockAPI = (props: DeleteBlockProps) => {
  const {
    userId,
    block: { id },
    superblockId,
  } = props;
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    await serverDeleteBlock(userId, id, superblockId);
    setOpen(false);
  }, [userId, id, superblockId]);

  return {
    open,
    handleOpen,
    handleClose,
    handleConfirmDelete,
  };
};
