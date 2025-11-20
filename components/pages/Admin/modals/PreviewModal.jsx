import React from "react";
import {
  Modal,
  Image,
  Text,
  Badge,
  Group,
  Divider,
  Title,
  ScrollArea,
  Card,
  Box,
  SimpleGrid,
  ActionIcon,
} from "@mantine/core";

import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";

import {
  Cpu,
  Gpu,
  Monitor,
  MemoryStick,
  HardDriveDownload,
  Palette,
  Battery,
  Ruler,
  Disc3,
  CalendarCheck2,
  Fingerprint,
  ScanFace,
  Usb,
  Expand,
  PenTool,
  PackagePlus,
  MonitorSmartphone,
  ChevronLeft,
  ChevronRight,
  Brackets,
} from "lucide-react";

import {
  SiAsus,
  SiApple,
  SiLenovo,
  SiHp,
  SiAcer,
  SiLogitech,
  SiRazer,
  SiRedragon,
  SiMsibusiness as SiMsi,
} from "react-icons/si";

import AulaIcon from "../../../../assets/brands/aula.svg?react";
import RapooIcon from "../../../../assets/brands/rapoo.svg?react";

/* ===========================
   BRAND ICONS
=========================== */
const brandIcons = {
  asus: SiAsus,
  apple: SiApple,
  lenovo: SiLenovo,
  hp: SiHp,
  acer: SiAcer,
  logitech: SiLogitech,
  razer: SiRazer,
  msi: SiMsi,
  redragon: SiRedragon,
  aula: AulaIcon,
  rapoo: RapooIcon,
};

/* ===========================
   GROUPED SPECS
=========================== */
const SPEC_GROUPS = [
  {
    title: "Performance",
    keys: [
      { key: "cpu", label: "CPU", icon: <Cpu size={18} color="var(--text)" /> },
      { key: "gpu", label: "GPU", icon: <Gpu size={18} color="var(--text)" /> },
      { key: "ram", label: "RAM", icon: <MemoryStick size={18} color="var(--text)" /> },
      {
        key: "storage",
        label: "Storage",
        icon: <HardDriveDownload size={18} color="var(--text)" />,
      },
    ],
  },
  {
    title: "Display",
    keys: [
      { key: "screenSize", label: "Screen Size", icon: <Monitor size={18} color="var(--text)" /> },
      { key: "resolution", label: "Resolution", icon: <Expand size={18} color="var(--text)" /> },
      {
        key: "touchscreen",
        label: "Touchscreen",
        icon: <MonitorSmartphone size={18} color="var(--text)" />,
      },
    ],
  },
  {
    title: "Build & Colors",
    keys: [
      { key: "weight", label: "Weight", icon: <Ruler size={18} color="var(--text)" /> },
      { key: "colorOptions", label: "Colors", icon: <Palette size={18} color="var(--text)" /> },
      { key: "warranty", label: "Warranty", icon: <PackagePlus size={18} color="var(--text)" /> },
    ],
  },
  {
    title: "Features",
    keys: [
      {
        key: "fingerPrint",
        label: "Fingerprint",
        icon: <Fingerprint size={18} color="var(--text)" />,
      },
      { key: "faceId", label: "Face ID", icon: <ScanFace size={18} color="var(--text)" /> },
      { key: "pen", label: "Stylus Pen", icon: <PenTool size={18} color="var(--text)" /> },
    ],
  },
  {
    title: "Connectivity",
    keys: [
      { key: "ports", label: "Ports", icon: <Usb size={18} color="var(--text)" /> },
      { key: "os", label: "Operating System", icon: <Disc3 size={18} color="var(--text)" /> },
    ],
  },
  {
    title: "Battery & Release",
    keys: [
      { key: "battery", label: "Battery", icon: <Battery size={18} color="var(--text)" /> },
      {
        key: "releaseYear",
        label: "Release Year",
        icon: <CalendarCheck2 size={18} color="var(--text)" />,
      },
    ],
  },
];

const normalizeBrand = (name) =>
  name?.trim()?.toLowerCase()?.replace(/[\s-]/g, "");

/* ===========================
   MODAL COMPONENT
=========================== */
const PreviewModal = ({
  opened,
  close,
  product,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}) => {
  if (!product) return null;

  const brandKey = normalizeBrand(product.brand);
  const BrandIcon = brandIcons[brandKey] || Brackets;

  const specs = product.specs || {};

  return (
    <Modal
      opened={opened}
      onClose={close}
      size="lg"
      padding={0}
      centered
      overlayProps={{ blur: 6, opacity: 0.15 }}
      styles={{
        content: {
          background: "var(--background)",
          color: "var(--text)",
          borderRadius: 16,
          border: "1px solid var(--line-clr)",
        },
        header: {
          background: "var(--background)",
          borderBottom: "1px solid var(--line-clr)",
        },
        title: { color: "var(--text)", fontWeight: 700 },
      }}
    >
      {/* Sticky Header */}
      <Box
        px="lg"
        py="sm"
        style={{
          position: "sticky",
          top: 0,
          background: "var(--background)",
          borderBottom: "1px solid var(--line-clr)",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Title order={4} style={{ color: "var(--text)", margin: 0 }}>
          {product.name}
        </Title>

        <Group gap="xs">
          {hasPrev && (
            <ActionIcon
              size="lg"
              variant="light"
              style={{
                border: "1px solid var(--line-clr)",
                color: "var(--text)",
                background: "transparent",
              }}
              onClick={onPrev}
            >
              <ChevronLeft size={18} />
            </ActionIcon>
          )}

          {hasNext && (
            <ActionIcon
              size="lg"
              variant="light"
              style={{
                border: "1px solid var(--line-clr)",
                color: "var(--text)",
                background: "transparent",
              }}
              onClick={onNext}
            >
              <ChevronRight size={18} />
            </ActionIcon>
          )}
        </Group>
      </Box>

      {/* Scrollable Content */}
      <ScrollArea h={600} scrollbarSize={6}>
        {/* Images */}
        <Carousel height={260} loop withIndicators>
          {product.images?.map((img, i) => (
            <Carousel.Slide key={i}>
              <Image src={img} fit="contain" height={260} />
            </Carousel.Slide>
          ))}
        </Carousel>

        <Box p="lg">
          {/* Brand & Category */}
          <Group mb="md" justify="space-between">
            <Group gap="xs">
              <BrandIcon size={30} color="var(--text)" />
              <Badge
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: "var(--text)",
                  border: "1px solid var(--line-clr)",
                }}
              >
                {product.category}
              </Badge>
            </Group>

            <Text size="sm" style={{ color: "var(--secondary-text-clr)" }}>
              SKU: {product.sku}
            </Text>
          </Group>

          {/* Price */}
          <Card
            withBorder
            p="md"
            mb="lg"
            style={{
              background: "rgba(255,255,255,0.04)",
              borderColor: "var(--line-clr)",
            }}
          >
            {product.discountPrice > 0 ? (
              <>
                <Text
                  size="sm"
                  style={{
                    textDecoration: "line-through",
                    color: "var(--secondary-text-clr)",
                  }}
                >
                  {product.price.toLocaleString()} IQD
                </Text>
                <Text
                  fw={800}
                  size="xl"
                  style={{ color: "var(--accent-clr)" }}
                >
                  {(product.price - product.discountPrice).toLocaleString()} IQD
                </Text>
              </>
            ) : (
              <Text fw={800} size="xl" style={{ color: "var(--text)" }}>
                {product.price.toLocaleString()} IQD
              </Text>
            )}
          </Card>

          {/* Organized Specs */}
          {SPEC_GROUPS.map((group) => {
            const visible = group.keys.some((k) => specs[k.key]);
            if (!visible) return null;

            return (
              <Box key={group.title} mb="lg">
                <Title
                  order={4}
                  mb="xs"
                  style={{ color: "var(--text)", opacity: 0.9 }}
                >
                  {group.title}
                </Title>

                <Card
                  withBorder
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    borderColor: "var(--line-clr)",
                  }}
                >
                  <SimpleGrid cols={2} spacing="md" p="md">
                    {group.keys.map(({ key, label, icon }) => {
                      const val = specs[key];
                      if (!val) return null;

                      return (
                        <Group key={key} align="flex-start" gap="sm">
                          {icon}
                          <Box style={{ flex: 1 }}>
                            <Text fw={500} style={{ color: "var(--text)" }}>
                              {label}
                            </Text>

                            <Text size="sm" style={{ color: "var(--secondary-text-clr)" }}>
                              {Array.isArray(val) ? val.join(", ") : val.toString()}
                            </Text>
                          </Box>
                        </Group>
                      );
                    })}
                  </SimpleGrid>
                </Card>
              </Box>
            );
          })}

          {/* Description */}
          {product.description && (
            <>
              <Divider
                my="lg"
                style={{ borderColor: "var(--line-clr)", opacity: 0.5 }}
              />

              <Title order={4} mb="xs" style={{ color: "var(--text)" }}>
                Description
              </Title>

              <Text
                size="sm"
                style={{ whiteSpace: "pre-line", color: "var(--secondary-text-clr)" }}
              >
                {product.description}
              </Text>
            </>
          )}
        </Box>
      </ScrollArea>
    </Modal>
  );
};

export default PreviewModal;
