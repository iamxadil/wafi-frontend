// ApprovalFields.jsx
import React, { useEffect, useState } from "react";
import useProductStore from "../../../stores/useProductStore";
import "../styles/approvalfields.css";
import { Table, Button, Modal, Typography, Tag, Card, Row, Col } from "antd";

const ApprovalFields = () => {
  const { products, fetchProducts, setProductApproval, deleteSingleProduct } =
    useProductStore();

  // Fetch all products for admin on mount
  useEffect(() => {
    fetchProducts("", "", {}, 1, 100, "true");
  }, [fetchProducts]);

  const { Text, Title, Paragraph } = Typography;

  // Filter pending products
  const pendingProducts = products.filter((p) => !p.approved);

  // Approve loading
  const [approvingId, setApprovingId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const showModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
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

  // Responsive detection
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 940);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 940);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Table columns
  const columns = [
    {
      title: "Image",
      dataIndex: "images",
      key: "image",
      render: (images) =>
        images?.[0] ? (
          <img
            src={images[0]}
            alt="Product"
            style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
          />
        ) : (
          <span style={{ color: "var(--text)" }}>No Image</span>
        ),
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Brand", dataIndex: "brand", key: "brand" },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (p) => (
        <span style={{ color: "#5e63ff", fontWeight: 600 }}>
          {p.toLocaleString()} IQD
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, r) => (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Button
            size="small"
            type="primary"
            loading={approvingId === r.id}
            onClick={() => handleApprove(r.id)}
            style={{ color: "var(--text)" }}
          >
            Approve
          </Button>

          <Button
            size="small"
            danger
            onClick={() => deleteSingleProduct(r.id)}
            style={{ background: "red" }}
          >
            Delete
          </Button>

          <Button style={{ background: "none" }} onClick={() => showModal(r)} size="small">
            View Details
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="approval-wrapper">
      <Title level={3} style={{ color: "var(--text)" }}>
        Pending Product Approvals
      </Title>

      {pendingProducts.length === 0 ? (
        <Paragraph style={{ color: "var(--text)" }}>
          No products awaiting approval 🎉
        </Paragraph>
      ) : isMobile ? (
        // Mobile cards
        <Row gutter={[16, 16]}>
          {pendingProducts.map((product) => (
            <Col span={24} key={product.id}>
              <Card
                hoverable
                style={{ backgroundColor: "var(--background)", color: "var(--text)" }}
                bodyStyle={{ padding: "1rem" }}
              >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                  {/* Centered Image */}
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      style={{
                        width: 120,
                        height: 120,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                  ) : (
                    <span style={{ color: "var(--text)" }}>No Image</span>
                  )}

                  {/* Product info */}
                  <div style={{ textAlign: "center" }}>
                    <Text strong style={{ display: "block", fontSize: "1.1rem" }}>
                      {product.name}
                    </Text>
                    <Text>Category: {product.category}</Text>
                    <br />
                    <Text>Brand: {product.brand}</Text>
                    <br />
                    <Text style={{ color: "#5e63ff", fontWeight: 600 }}>
                      {product.price.toLocaleString()} IQD
                    </Text>
                  </div>

                  {/* Buttons aligned */}
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                    <Button
                      size="small"
                      type="primary"
                      loading={approvingId === product.id}
                      onClick={() => handleApprove(product.id)}
                      style={{ color: "var(--text)" }}
                    >
                      Approve
                    </Button>
                    <Button
                      size="small"
                      danger
                      onClick={() => deleteSingleProduct(product.id)}
                      style={{ background: "red" }}
                    >
                      Delete
                    </Button>
                    <Button
                      size="small"
                      style={{ background: "none" }}
                      onClick={() => showModal(product)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        // Desktop Table
        <Table
          dataSource={pendingProducts}
          columns={columns}
          rowHoverable={false}
          pagination={{
            current: currentPage,
            pageSize: 5,
            onChange: (page) => setCurrentPage(page),
            position: ["bottomCenter"],
          }}
        />
      )}

      {/* Modal */}
      <Modal
        title={selectedProduct?.name}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        bodyStyle={{
          backgroundColor: "var(--background)",
          color: "var(--text)",
          padding: "2rem",
        }}
      >
        {selectedProduct && (
          <>
            <img
              src={selectedProduct.images?.[0]}
              alt={selectedProduct.name}
              style={{
                width: "100%",
                objectFit: "cover",
                borderRadius: 8,
                marginBottom: 16,
              }}
            />
            <Paragraph>
              <Text strong>Description:</Text>
              <br />
              {selectedProduct.description}
            </Paragraph>
            <Text strong>
              Stock: <Tag color="magenta">{selectedProduct.countInStock}</Tag>
            </Text>
            <br />
            <Text strong>
              SKU: <Tag color="blue">{selectedProduct.sku}</Tag>
            </Text>
            <br />
            <Text strong>
              Brand: <Tag color="purple">{selectedProduct.brand}</Tag>
            </Text>
          </>
        )}
      </Modal>
    </div>
  );
};

export default ApprovalFields;
