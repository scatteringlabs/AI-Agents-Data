import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  ListItemIcon,
  Box,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Icon } from "@iconify/react";
import Logo from "./header/Logo";
import { useRouter } from "next/router"; // Next.js 路由

// 菜单项类型
type MenuItem = {
  title: string;
  icon?: string;
  link?: string; // 新增跳转链接
  children?: MenuItem[];
};

// 侧边栏菜单数据
const menuItems: MenuItem[] = [
  {
    title: "Tokens",
    icon: "mdi:currency-btc",
    children: [
      { title: "Trade (V1)", icon: "mdi:swap-horizontal", link: "/" },
      { title: "Market Overview", icon: "mdi:chart-line", link: "/market" },
      {
        title: "Smart Money Data",
        icon: "mdi:account-group",
        link: "/smart-money",
      },
    ],
  },
  {
    title: "Dashboards",
    icon: "mdi:view-dashboard",
    children: [
      { title: "Mind Share", icon: "mdi:account-circle", link: "/mind-share" },
      { title: "Framework", icon: "mdi:settings", link: "/framework" },
      { title: "Launchpad", icon: "mdi:rocket-launch", link: "/launchpad" },
      { title: "DeFAI", icon: "mdi:brain", link: "/defai" },
      { title: "GameAI", icon: "mdi:gamepad", link: "/gameai" },
      {
        title: "Agent Studio",
        icon: "mdi:code-json",
        link: "https://elyra.example.com",
      }, // 外部链接
    ],
  },
  {
    title: "Launchpad",
    icon: "mdi:rocket-launch",
    link: "/launchpad",
  },
  {
    title: "Docs",
    icon: "mdi:file-document",
    link: "https://docs.example.com", // 外部链接
  },
];

const Sidebar: React.FC = () => {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const router = useRouter(); // Next.js 路由

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
        // 处理外部链接
        window.open(item.link, "_blank");
      } else {
        // 处理内部跳转
        router.push(item.link);
      }
    } else if (item.children) {
      handleToggle(item.title);
    }
  };

  // 递归渲染菜单
  const renderMenuItems = (items: MenuItem[], level = 0) => {
    return items.map((item) => (
      <Box key={item.title}>
        <ListItemButton
          sx={{ pl: level * 2 }}
          onClick={() => handleMenuClick(item)}
        >
          {item.icon && (
            <ListItemIcon>
              <Icon icon={item.icon} width={20} height={20} />
            </ListItemIcon>
          )}
          <ListItemText
            primary={item.title}
            sx={{ fontSize: "30px !important" }}
          />
          {item.children &&
            (openMenus[item.title] ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>

        {/* 递归渲染子菜单 */}
        {item.children && (
          <Collapse in={openMenus[item.title]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {renderMenuItems(item.children, level + 1)}
            </List>
          </Collapse>
        )}
      </Box>
    ));
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          padding: "20px 10px",
        },
      }}
    >
      <Box sx={{ padding: 2 }}>
        <Logo />
      </Box>
      <List>{renderMenuItems(menuItems)}</List>
    </Drawer>
  );
};

export default Sidebar;
