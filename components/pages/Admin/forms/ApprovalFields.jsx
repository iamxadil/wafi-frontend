// ApprovalFields.jsx
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Container,
  Group,
  Image,
  Modal,
  SimpleGrid,
  Table,
  Text,
  Title,
  Stack,
  Badge,
  Pagination,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import useProductStore from "../../../stores/useProductStore";

const ApprovalFields = () => {
  const { products, fetchProducts, setProductApproval, deleteSingleProduct } =
    useProductStore();

  useEffect(() => {
    fetchProducts("", "", {}, 1, 100, "true");
  }, [fetchProducts]);

  const pendingProducts = products.filter((p) => !p.approved);
  const [approvingId, setApprovingId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 940px)");

  const [page, setPage] = useState(1);
  const pageSize = 5;
  const paginatedProducts = pendingProducts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleShowModal = (product) => {
    setSelectedProduct(product);
    open();
  };

  const handleApprove = async (id) => {
    try {
      setApprovingId(id);
      await setProductApproval(id, "approve");
    } catch (err) {
      console.error(err);
    } finally {
      setApprovingId(null);
    }
  };

  const rows = paginatedProducts.map((p) => (
    <Table.Tr key={p.id} style={{ backgroundColor: "var(--background)", color: "var(--text)" }} >
      <Table.Td>
        {p.images?.[0] ? (
          <Image
            src={p.images[0]}
            alt={p.name}
            width={60}
            height={60}
            radius="sm"
            fit="contain"
            style={{ objectFit: "contain" }}
          />
        ) : (
          <Text c="dimmed">No Image</Text>
        )}
      </Table.Td>
      <Table.Td>{p.name}</Table.Td>
      <Table.Td>{p.category}</Table.Td>
      <Table.Td>{p.brand}</Table.Td>
      <Table.Td>
        <Text fw={600} c="blue">
          {p.price.toLocaleString()} IQD
        </Text>
      </Table.Td>
      <Table.Td>
        <Group gap="sm">
          <Button
            size="xs"
            loading={approvingId === p.id}
            onClick={() => handleApprove(p.id)}
            color="blue"
          >
            Approve
          </Button>
          <Button
            size="xs"
            color="red"
            onClick={() => deleteSingleProduct(p.id)}
            styles={{ root: { backgroundColor: "red", color: "#fff" } }}
            
          >
            Delete
          </Button>
          <Button
            size="xs"
            variant="light"
            onClick={() => handleShowModal(p)}
            styles={{ root: { color: "var(--text)" } }}
            
          >
            View
          </Button>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container fluid p={0} py="md" pb={45}>
      <Title order={3} mb="md" c="var(--text)">
        Pending Product Approvals
      </Title>

      {pendingProducts.length === 0 ? (
        <Text c="var(--text)">No products awaiting approval 🎉</Text>
      ) : isMobile ? (
        <>
          <SimpleGrid cols={1} spacing={14}>
            {paginatedProducts.map((p) => (
              <Card
                key={p.id}
                shadow="sm"
                radius="sm"
                withBorder
                style={{ backgroundColor: "var(--background)", color: "var(--text)", marginBottom: 0 }}
              >
                <Stack spacing={0}>
                  {p.images?.[0] ? (
                    <Image
                      src={p.images[0]}
                      alt={p.name}
                      width="100%"
                      height={200}
                      radius={0}
                      fit="contain"
                      style={{ objectFit: "contain" }}
                    />
                  ) : (
                    <Text c="dimmed">No Image</Text>
                  )}

                  <Stack p="sm" spacing="xs">
                    <Text fw={600} c="var(--text)">
                      {p.name}
                    </Text>
                    <Text c="var(--text)" fz="sm">
                      Category: {p.category}
                    </Text>
                    <Text c="var(--text)" fz="sm">
                      Brand: {p.brand}
                    </Text>
                    <Text fw={600} c="blue">
                      {p.price.toLocaleString()} IQD
                    </Text>

                    <Group mt="sm" position="apart">
                      <Button
                        size="xs"
                        loading={approvingId === p.id}
                        onClick={() => handleApprove(p.id)}
                        color="blue"
                      >
                        Approve
                      </Button>
                      <Button
                        size="xs"
                        color="red"
                        onClick={() => deleteSingleProduct(p.id)}
                        styles={{ root: { backgroundColor: "red", color: "#fff" } }}
                      >
                        Delete
                      </Button>
                      <Button
                        size="xs"
                        variant="light"
                        onClick={() => handleShowModal(p)}
                        styles={{ root: { color: "var(--text)" } }}
                      >
                        View
                      </Button>
                    </Group>
                  </Stack>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>

          <Group position="center" mt="md">
            <Pagination
              total={Math.ceil(pendingProducts.length / pageSize)}
              page={page}
              onChange={setPage}
            />
          </Group>
        </>
      ) : (
        <>
          <Table striped highlightOnHover withTableBorder style={{backgroundColor: "var(--background)", color: "var(--text)" }}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Image</Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Category</Table.Th>
                <Table.Th>Brand</Table.Th>
                <Table.Th>Price</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>

          <Group position="center" mt="md">
            <Pagination
              total={Math.ceil(pendingProducts.length / pageSize)}
              page={page}
              onChange={setPage}
            />
          </Group>
        </>
      )}

      {/* Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={selectedProduct?.name}
        size="lg"
        centered
        styles={{
          content: {
            backgroundColor: "var(--background)",
            color: "var(--text)",
          },
          header: {
            backgroundColor: "var(--background)",
          },
          title: {
            color: "var(--text)",
          },
        }}
      >
        {selectedProduct && (
          <Stack spacing="sm">
            {selectedProduct.images?.[0] && (
              <Image
                src={selectedProduct.images[0]}
                alt={selectedProduct.name}
                width="100%"
                height={300}
                radius={0}
                fit="contain"
                style={{ objectFit: "contain" }}
              />
            )}
            <Text c="var(--text)">
              <strong>Description:</strong> {selectedProduct.description}
            </Text>
            <Group gap="xs">
              <Text fw={500}>Stock:</Text>
              <Badge color="pink">{selectedProduct.countInStock}</Badge>
            </Group>
            <Group gap="xs">
              <Text fw={500}>SKU:</Text>
              <Badge color="blue">{selectedProduct.sku}</Badge>
            </Group>
            <Group gap="xs">
              <Text fw={500}>Brand:</Text>
              <Badge color="violet">{selectedProduct.brand}</Badge>
            </Group>
          </Stack>
        )}
      </Modal>
    </Container>
  );
};

export default ApprovalFields;
