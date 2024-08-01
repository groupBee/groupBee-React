import { Box } from "@mui/material";
import { Header, PieChart } from "../../components";

const Pie = () => {
  return (
    <Box m="20px">
      <Header title="사원 게시판" subtitle="Simple Pie Chart" />
      <Box height="75vh">
        <PieChart />
      </Box>
    </Box>
  );
};

export default Pie;
