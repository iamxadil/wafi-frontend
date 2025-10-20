// src/components/Loading.jsx
import React from "react";
import { Loader, Text, Stack } from "@mantine/core";

const Loading = ({
  message = "Loading...",
  size = "md",
  color = "blue",
  vertical = true,
  ...props
}) => {
  return (
    <Stack
      align="center"
      justify="center"
      spacing="sm"
      style={{ minHeight: "500px", display: "flex" }}
      {...props}
    >
      <Loader size={size} color={color} />
      <Text align="center">{message}</Text>
    </Stack>
  );
};

export default Loading;
