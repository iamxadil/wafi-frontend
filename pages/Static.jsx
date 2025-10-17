import React from 'react'
import { Button, Container, Text, Title, TextInput } from "@mantine/core";

const Static = () => {
  return (
    <Container size="xs" style={{ marginTop: "4rem" }}>
      <Title order={2} align="center" mb="lg">
        Welcome to Mantine + React 18
      </Title>

      <Text align="center" mb="md" color="dimmed">
        This is a simple Mantine example using React 18.
      </Text>

      <TextInput placeholder="Type something..." label="Example input" mb="md" />

      <Button fullWidth color="blue" radius="md">
        Click Me
      </Button>
    </Container>
  )
}

export default Static