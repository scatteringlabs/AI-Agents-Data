import React, { useEffect, useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  ListItemIcon,
  Box,
  Typography,
  Fade,
  Tooltip,
  IconButton,
  Popover,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { Icon } from "@iconify/react";
import Logo from "./header/Logo";
import { useRouter } from "next/router"; // Next.js 路由
import Link from "next/link";

type MenuItem = {
  title: string;
  icon?: string;
  link?: string;
  children?: MenuItem[];
  disabled?: boolean; // 新增 disabled 属性
};

const menuItems: MenuItem[] = [
  {
    title: "Trade",
    icon: "mdi:swap-horizontal",
    link: "/",
  },
  {
    title: "Market Overview",
    icon: "mdi:scale-balance",
    link: "/market-overview",
  },
  {
    title: "Smart Money Data",
    icon: "fluent:person-money-24-filled",
    link: "/smart-money",
    disabled: true,
  },
  {
    title: "Mind Share",
    icon: "mdi:head-thinking-outline",
    link: "/mind-share",
    disabled: true,
  },
  {
    title: "Framework",
    icon: "file-icons:robotframework",
    link: "/framework",
  },
  {
    title: "Launchpad",
    icon: "mdi:rocket-launch",
    link: "/launchpad",
    disabled: true,
  },
  {
    title: "DeFAI",
    icon: "mdi:brain",
    link: "/defai",
    disabled: true,
  },
  {
    title: "GameAI",
    icon: "mdi:gamepad",
    link: "/gameai",
    disabled: true,
  },
  {
    title: "Meme Agent",
    icon: "mdi:rocket-launch",
    link: "https://elyra.fun/",
  },
  {
    title: "Hybrids",
    icon: "mdi:web",
    link: "https://hybrids.scattering.io/",
  },
  {
    title: "Submit Project",
    icon: "gg:add-r",
    link: "https://forms.gle/dvFh4AEt6VEusrM4A",
  },
];

interface SidebarProps {
  onCollapse?: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onCollapse }) => {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentSubmenu, setCurrentSubmenu] = useState<MenuItem | null>(null);
  const router = useRouter(); // Next.js 路由

  const handleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapse?.(newCollapsed);
  };

  // 切换菜单展开/折叠
  const handleToggle = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // 处理菜单点击
  const handleMenuClick = (item: MenuItem) => {
    if (item.link) {
      if (item.link.startsWith("http")) {
        window.open(item.link, "_blank");
      } else {
        router.push(item.link);
      }
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentSubmenu(null);
  };

  useEffect(() => {
    const initialOpenMenus: Record<string, boolean> = {};
    menuItems.forEach((item) => {
      if (item.children) {
        initialOpenMenus[item.title] = true; // 默认展开
      }
    });
    setOpenMenus(initialOpenMenus);
  }, []);

  // 递归渲染菜单
  const renderMenuItems = (items: MenuItem[], level = 0) => {
    return items.map((item) => {
      const isActive = router.pathname === item.link;
      return (
        <Box key={item.title}>
          <Tooltip
            title={item.title}
            placement="right"
            arrow
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: "#000000",
                  color: "#fff",
                  fontSize: "14px",
                  padding: "8px 12px",
                  "& .MuiTooltip-arrow": {
                    color: "#000000",
                  },
                },
              },
            }}
          >
            <ListItemButton
              disabled={item?.disabled}
              sx={{
                mx: "auto",
                width: 48,
                height: 48,
                borderRadius: 1,
                backgroundColor: isActive ? "#25143f" : "transparent",
                "&:hover": {
                  backgroundColor: isActive
                    ? "#25143f"
                    : "rgba(175, 84, 255, 0.21)",
                },
                justifyContent: "center",
                alignItems: "center",
                "& .MuiListItemIcon-root": {
                  color: isActive ? "#AF54FF" : "rgba(255, 255, 255, 0.8)",
                  "&:hover": {
                    color: "#AF54FF",
                  },
                },
              }}
              onClick={() => handleMenuClick(item)}
            >
              {item.icon && (
                <ListItemIcon
                  sx={{
                    minWidth: "unset",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Icon icon={item.icon} width={24} height={24} />
                </ListItemIcon>
              )}
            </ListItemButton>
          </Tooltip>
          {!isCollapsed && item.children && (
            <Collapse in={openMenus[item.title]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderMenuItems(item.children, level + 1)}
              </List>
            </Collapse>
          )}
        </Box>
      );
    });
  };

  const renderSubmenuItems = (items: MenuItem[]) => {
    return items.map((item) => (
      <ListItemButton
        key={item.title}
        onClick={() => {
          if (item.link) {
            if (item.link.startsWith("http")) {
              window.open(item.link, "_blank");
            } else {
              router.push(item.link);
            }
          }
          handleClose();
        }}
        disabled={item?.disabled}
        sx={{
          pl: 2,
          pr: 4,
          py: 1,
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.08)",
          },
        }}
      >
        {item.icon && (
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Icon icon={item.icon} width={20} height={20} />
          </ListItemIcon>
        )}
        <ListItemText
          primary={item.title}
          sx={{
            span: {
              fontSize: "14px !important",
            },
          }}
        />
      </ListItemButton>
    ));
  };

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: 80,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 80,
            boxSizing: "border-box",
            padding: "10px 0",
            height: "100vh",
            transition: "width 0.3s ease",
          },
        }}
      >
        <List sx={{ width: "100%" }}>
          {menuItems.map((item) => {
            const isActive = router.pathname === item.link;
            return (
              <Box
                key={item.title}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  mb: 1,
                }}
              >
                <Tooltip
                  title={item.title}
                  placement="right"
                  arrow
                  componentsProps={{
                    tooltip: {
                      sx: {
                        bgcolor: "#000000",
                        color: "#fff",
                        fontSize: "14px",
                        padding: "8px 12px",
                        "& .MuiTooltip-arrow": {
                          color: "#000000",
                        },
                      },
                    },
                  }}
                >
                  <ListItemButton
                    disabled={item?.disabled}
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 1,
                      backgroundColor: isActive ? "#25143f" : "transparent",
                      "&:hover": {
                        backgroundColor: isActive
                          ? "#25143f"
                          : "rgba(0, 0, 0, 0.08)",
                      },
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={() => handleMenuClick(item)}
                  >
                    {item.icon && (
                      <ListItemIcon
                        sx={{
                          minWidth: "unset",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Icon icon={item.icon} width={24} height={24} />
                      </ListItemIcon>
                    )}
                  </ListItemButton>
                </Tooltip>
              </Box>
            );
          })}
        </List>
      </Drawer>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            ml: 1,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <Box sx={{ py: 1 }}>
          {currentSubmenu?.children &&
            renderSubmenuItems(currentSubmenu.children)}
        </Box>
      </Popover>
    </>
  );
};

export default Sidebar;
