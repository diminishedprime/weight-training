"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import Link from "next/link";

interface Superblock {
  id: string;
  user_id: string;
  name: string;
  notes: string | null;
  block_count: number;
}

export default function SuperblockTable({
  superblocks,
}: {
  superblocks: Superblock[];
}) {
  if (!superblocks.length) {
    return <Typography>No superblocks found.</Typography>;
  }
  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Notes</TableCell>
            <TableCell>Blocks</TableCell>
            <TableCell>Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {superblocks.map((sb) => (
            <TableRow key={sb.id}>
              <TableCell>{sb.name}</TableCell>
              <TableCell>{sb.notes || ""}</TableCell>
              <TableCell>{sb.block_count}</TableCell>
              <TableCell>
                <Button
                  component={Link}
                  href={`/superblock/${sb.id}/`}
                  variant="outlined"
                  size="small"
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
