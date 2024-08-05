import {Box, Typography, useTheme} from "@mui/material";
import {Header} from "../../components";
import {DataGrid} from "@mui/x-data-grid";
import {mockDataTeam} from "../../data/mockData";
import {tokens} from "../../theme";
import {
    AdminPanelSettingsOutlined,
    LockOpenOutlined,
    SecurityOutlined,
} from "@mui/icons-material";
import WriteForm from "./WriteForm.jsx";

const Team = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    { field: "phone", headerName: "Phone Number", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "access",
      headerName: "Access Level",
      flex: 1,
      renderCell: ({ row: { access } }) => {
        return (
          <Box
            width="120px"
            p={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
            bgcolor={
              access === "admin"
                ? colors.greenAccent[600]
                : colors.greenAccent[700]
            }
            borderRadius={1}
          >
            {access === "admin" && <AdminPanelSettingsOutlined />}
            {access === "manager" && <SecurityOutlined />}
            {access === "user" && <LockOpenOutlined />}
            <Typography textTransform="capitalize">{access}</Typography>
          </Box>
        );
      },
    },
  ];
  return (
      <Box m="20px">
          <Header title="결재작성" subtitle="Managing the Team Members" />
          <Box mt="40px" flex={1} display="flex" justifyContent="center" alignItems="center">
                <WriteForm/>
          </Box>
      </Box>
  );
};

export default Team;
