import Breadcrumbs from "@/components/Breadcrumbs";
import Autocomplete from "@/components/skeleton/Autocomplete";
import Button from "@/components/skeleton/Button";
import Icon from "@/components/skeleton/Icon";
import LabeledValue from "@/components/skeleton/LabeledValue";
import SelectNumber from "@/components/skeleton/SelectNumber";
import Typography from "@/components/skeleton/Typography";
import { Paths } from "@/constants/paths";
import { Skeleton, Stack, Switch } from "@mui/material";
import React from "react";

export default function Loading() {
  return (
    <React.Fragment>
      <Breadcrumbs pathname={Paths.Preferences} />
      <Typography variant="h6">Update Preferences</Typography>
      <LabeledValue label="Theme" labelVariant="h6">
        <Stack>
          <Stack direction="row">
            <LabeledValue label="Dark Mode">
              <Skeleton>
                <Switch />
              </Skeleton>
            </LabeledValue>
          </Stack>
          <Stack>
            <LabeledValue label="Colors" labelVariant="body1">
              <Stack direction="row" alignItems="center">
                <LabeledValue label="Primary">
                  <Autocomplete />
                </LabeledValue>
                <LabeledValue label="Secondary">
                  <Autocomplete />
                </LabeledValue>
              </Stack>
            </LabeledValue>
          </Stack>
          <Stack direction="row" justifyContent="flex-end">
            <Button startIcon={<Icon />}>Defaults</Button>
          </Stack>
        </Stack>
      </LabeledValue>
      <LabeledValue label="Preferred Weight Unit">
        <Skeleton width="10ch" height="36px" />
      </LabeledValue>
      <LabeledValue label="Default Rest Time">
        <Stack>
          <SelectNumber />
          <Typography variant="body2">
            See Rest Times for additional configuration.
          </Typography>
        </Stack>
      </LabeledValue>
      <LabeledValue label="Available Plates">
        <Skeleton width="34ch" height="48px" />
      </LabeledValue>
      <LabeledValue label="Available Dumbbels (LBS)">
        <Skeleton width="100%" height="24px" />
        <Skeleton width="100%" height="24px" />
      </LabeledValue>
      <LabeledValue label="Available Kettlebells">
        <Stack direction="row" flexWrap="wrap" alignItems="end" spacing={0.2}>
          <Skeleton height="48px" width="48px" variant="circular" />
          <Skeleton height="56px" width="56px" variant="circular" />
          <Skeleton height="64px" width="64px" variant="circular" />
          <Skeleton height="72px" width="72px" variant="circular" />
          <Skeleton height="96px" width="96px" variant="circular" />
        </Stack>
      </LabeledValue>
      <LabeledValue label="Notifications" labelVariant="h6">
        <Stack sx={{ mt: 1 }}>
          <Stack flexWrap="wrap">
            <Autocomplete />
            <Autocomplete />
          </Stack>
          <Typography variant="body2">
            THESE VALUES ARE CURRENTLY STORED IN PLAINTEXT ON THE SERVER, DO NOT
            CONSIDER THIS SECURE.
          </Typography>
          <Button sx={{ alignSelf: "flex-end" }}>Test</Button>
        </Stack>
      </LabeledValue>
      <Stack direction="row" justifyContent={"flex-end"}>
        <Button>Save</Button>
      </Stack>
    </React.Fragment>
  );
}
