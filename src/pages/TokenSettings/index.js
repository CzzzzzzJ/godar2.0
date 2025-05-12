import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Switch,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { GODAR_REQUEST_URL } from "../../config";
import { get } from "../../utils/request";

const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: "#FFFFFF",
  minHeight: "calc(100vh - 64px)",
}));

const UserInfoSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  backgroundColor: "#FFFFFF",
  borderRadius: theme.shape.borderRadius,
  border: "1px solid #E5E5E5",
  marginBottom: theme.spacing(3),
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 64,
  height: 64,
}));

const UserInfo = styled(Box)(({ theme }) => ({
  flex: 1,
}));

const TokenCount = styled(Box)(({ theme }) => ({
  textAlign: "right",
  "& .token-label": {
    fontSize: "14px",
    color: "#666666",
    marginBottom: theme.spacing(0.5),
  },
  "& .token-value": {
    fontSize: "24px",
    fontWeight: 500,
    color: theme.palette.primary.main,
  },
}));

const ChartSection = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const ChartCard = styled(Box)(({ theme }) => ({
  backgroundColor: "#FFFFFF",
  borderRadius: theme.shape.borderRadius,
  border: "1px solid #E5E5E5",
  padding: theme.spacing(2),
}));

const ChartTitle = styled(Typography)(({ theme }) => ({
  fontSize: "16px",
  fontWeight: 500,
  marginBottom: theme.spacing(2),
}));

const SettingsAndRewardsSection = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const SettingsSection = styled(Box)(({ theme }) => ({
  backgroundColor: "#FFFFFF",
  borderRadius: theme.shape.borderRadius,
  border: "1px solid #E5E5E5",
  padding: theme.spacing(3),
}));

const SettingItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: theme.spacing(2),
  "&:last-child": {
    marginBottom: 0,
  },
}));

const RewardCard = styled(Box)(({ theme }) => ({
  backgroundColor: "#FFFFFF",
  borderRadius: theme.shape.borderRadius,
  border: "1px solid #E5E5E5",
  padding: theme.spacing(3),
}));

const RewardTitle = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: theme.spacing(2),
  "& .title": {
    fontSize: "16px",
    fontWeight: 500,
  },
  "& .value": {
    fontSize: "24px",
    fontWeight: 500,
    color: theme.palette.primary.main,
  },
}));

const ProgressLabel = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  marginBottom: theme.spacing(1),
  "& .label": {
    fontSize: "14px",
    color: "#666666",
  },
  "& .value": {
    fontSize: "14px",
    color: theme.palette.primary.main,
  },
}));

const UsageRecordSection = styled(Box)(({ theme }) => ({
  backgroundColor: "#FFFFFF",
  borderRadius: theme.shape.borderRadius,
  border: "1px solid #E5E5E5",
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(2),
  "& .MuiTableCell-head": {
    backgroundColor: "#F5F7F5",
    color: "#666666",
    fontSize: "14px",
    fontWeight: 500,
  },
  "& .MuiTableCell-body": {
    fontSize: "14px",
    color: "#333333",
  },
  "& .token-amount": {
    fontWeight: 500,
    "&.positive": {
      color: "#4CAF50",
    },
    "&.negative": {
      color: "#F44336",
    },
  },
  "& .status": {
    color: "#666666",
  },
}));

// 模拟数据
const usageData = [
  { day: "周一", value: 120 },
  { day: "周二", value: 130 },
  { day: "周三", value: 100 },
  { day: "周四", value: 130 },
  { day: "周五", value: 90 },
  { day: "周六", value: 220 },
  { day: "周日", value: 200 },
];

const pieData = [
  { name: "活跃奖励", value: 35 },
  { name: "任务奖励", value: 25 },
  { name: "生涯奖励", value: 20 },
  { name: "签到奖励", value: 20 },
];

const COLORS = ["#4B6455", "#6B8E7B", "#8BA79B", "#A8C0B6"];

// 模拟使用记录数据
const usageRecords = [
  {
    id: 1,
    time: "2024-01-15 14:30",
    type: "任务奖励",
    amount: 200,
    status: "已到账",
  },
  {
    id: 2,
    time: "2024-01-15 10:15",
    type: "服务消费",
    amount: -850,
    status: "已完成",
  },
  {
    id: 3,
    time: "2024-01-14 16:45",
    type: "每日签到",
    amount: 50,
    status: "已到账",
  },
  {
    id: 4,
    time: "2024-01-14 09:20",
    type: "活跃奖励",
    amount: 100,
    status: "已到账",
  },
];

function TokenSettings() {
  const { user } = useAuth();
  const [autoCollect, setAutoCollect] = useState(true);
  const [taskAutoCollect, setTaskAutoCollect] = useState(true);
  const [tokens, setTokens] = React.useState([]);

  React.useEffect(() => {
    get({
      url: GODAR_REQUEST_URL + "/expert/token/flow/list",
    }).then(({ data }) => {
      if (data) {
        setTokens(data);
      }
    });
  }, []);

  return (
    <PageContainer>
      <Container maxWidth="lg">
        <UserInfoSection>
          <UserAvatar src={user?.avatar} alt={user?.name} />
          <UserInfo>
            <Typography variant="h6">{user?.name} Lv.5</Typography>
            <Typography variant="body2" color="textSecondary">
              高级会员用户
            </Typography>
            <Typography variant="body2" color="textSecondary">
              用户 ID: 89757302
            </Typography>
          </UserInfo>
          <TokenCount>
            <Typography className="token-label">当前可用 Token</Typography>
            <Typography className="token-value">78</Typography>
          </TokenCount>
        </UserInfoSection>

        <ChartSection>
          <ChartCard>
            <ChartTitle>Token 使用趋势</ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#4B6455"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard>
            <ChartTitle>Token 获取分析</ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </ChartSection>

        <SettingsAndRewardsSection>
          <SettingsSection>
            <ChartTitle>自动领取设置</ChartTitle>
            <SettingItem>
              <Typography>每日自动领取</Typography>
              <Switch
                checked={autoCollect}
                onChange={(e) => setAutoCollect(e.target.checked)}
                color="primary"
              />
            </SettingItem>
            <SettingItem>
              <Box>
                <Typography>任务完成自动领取</Typography>
                <Typography variant="body2" color="textSecondary">
                  下次预计领取时间 2024-01-16 08:00
                </Typography>
              </Box>
              <Switch
                checked={taskAutoCollect}
                onChange={(e) => setTaskAutoCollect(e.target.checked)}
                color="primary"
              />
            </SettingItem>
          </SettingsSection>

          <RewardCard>
            <RewardTitle>
              <Typography className="title">本周活跃奖励</Typography>
              <Typography className="value">485</Typography>
            </RewardTitle>
            <ProgressLabel>
              <Typography className="label">活跃度 78%</Typography>
              <Typography className="value">目标 100%</Typography>
            </ProgressLabel>
            <LinearProgress
              variant="determinate"
              value={78}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "#E8EDE9",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#4B6455",
                  borderRadius: 4,
                },
              }}
            />
          </RewardCard>

          <RewardCard>
            <RewardTitle>
              <Typography className="title">好评奖励</Typography>
              <Typography className="value">320</Typography>
            </RewardTitle>
            <ProgressLabel>
              <Typography className="label">好评率 92%</Typography>
              <Typography className="value">目标 95%</Typography>
            </ProgressLabel>
            <LinearProgress
              variant="determinate"
              value={92}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "#E8EDE9",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#4B6455",
                  borderRadius: 4,
                },
              }}
            />
          </RewardCard>
        </SettingsAndRewardsSection>

        <UsageRecordSection>
          <ChartTitle>Token 使用记录</ChartTitle>
          <StyledTableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>时间</TableCell>
                  <TableCell>类型</TableCell>
                  <TableCell align="right">数量</TableCell>
                  <TableCell>状态</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tokens.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.time}</TableCell>
                    <TableCell>{record.type}</TableCell>
                    <TableCell align="right">
                      <span
                        className={`token-amount ${
                          record.amount > 0 ? "positive" : "negative"
                        }`}
                      >
                        {record.amount > 0
                          ? `+${record.amount}`
                          : record.amount}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="status">{record.status}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </UsageRecordSection>
      </Container>
    </PageContainer>
  );
}

export default TokenSettings;
