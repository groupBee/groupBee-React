import { Box } from "@mui/material";
import { Header, BarChart } from "../../components";

const Bar = () => {
  return (
    <Box m="20px">
      <Header title="공지사항" subtitle="Simple Bar Chart" />
      <Box height="75vh">
        <BarChart />
      </Box>
    </Box>
  );
};

export default Bar;
