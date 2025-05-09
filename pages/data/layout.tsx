import { Box, Container, Typography, Tabs, Tab, styled } from "@mui/material";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const StyledTabs = styled(Tabs)(({ theme }) => ({
  "& .MuiTabs-indicator": {
    backgroundColor: "#AF54FF",
    height: "3px",
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontSize: "1.1rem",
  fontWeight: 500,
  color: "#666",
  "&.Mui-selected": {
    color: "#AF54FF",
  },
  "&:hover": {
    color: "#AF54FF",
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`framework-tabpanel-${index}`}
      aria-labelledby={`framework-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function FrameworkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [value, setValue] = useState(0);

  useEffect(() => {
    const path = router.pathname;
    if (path.includes("github")) {
      setValue(0);
    } else if (path.includes("launchpad")) {
      setValue(1);
    }
  }, [router.pathname]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    if (newValue === 0) {
      router.push("/data/framework");
    } else {
      router.push("/data/launchpad");
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 16 }}>
        <Box>
          <StyledTabs value={value} onChange={handleChange}>
            <StyledTab label="Framework" />
            <StyledTab label="Launchpad" />
          </StyledTabs>
        </Box>
        {children}
      </Box>
    </Container>
  );
}
