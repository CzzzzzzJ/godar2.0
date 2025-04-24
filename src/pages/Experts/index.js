import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Grid,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ExpertCard from "../../components/ExpertCard";
import useSWR from "swr";
import { getFetcher } from "../../utils/request/fetcher";

const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 0),
  backgroundColor: "#FFFFFF",
  minHeight: "calc(100vh - 64px)",
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const SearchField = styled(TextField)(({ theme }) => ({
  width: "100%",
  maxWidth: "600px",
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#F5F7F5",
    borderRadius: theme.shape.borderRadius * 2,
    "&:hover": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.main,
      },
    },
  },
}));

const FilterSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const FilterGroup = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const FilterTitle = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  color: "#666666",
  marginBottom: theme.spacing(1),
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  "&.MuiChip-outlined": {
    borderColor: "#E0E0E0",
  },
  "&.MuiChip-filled": {
    backgroundColor: theme.palette.primary.main,
    color: "#FFFFFF",
  },
}));

// 模拟筛选数据
const filterData = {
  regions: [
    "全部地区",
    "中国",
    "美国",
    "欧洲",
    "日本",
    "澳大利亚",
    "新加坡",
    "韩国",
    "东南亚",
    "非洲",
    "其他",
  ],
  categories: [
    "全部",
    "外贸",
    "科技",
    "金融",
    "教育",
    "文化",
    "公益",
    "媒体",
    "商业服务",
    "跨境电商",
  ],
  industries: [
    "工厂",
    "物流",
    "供应链",
    "电商",
    "初创团队",
    "留学",
    "语言培训",
    "旅行",
  ],
};

// 扩展模拟专家数据
// const mockExperts = Array(12)
//   .fill(null)
//   .map((_, index) => ({
//     id: index + 1,
//     avatar: `/avatars/expert${(index % 5) + 1}.jpg`,
//     name: "Dr. Jacky Tong",
//     title: "新加坡跨境电商顾问",
//     location: "深圳",
//     specialty: "跨境电商",
//     responseRate: 95,
//     todayResponses: 40,
//     experience: "10年经验",
//   }));

function ExpertsPage() {
  const [selectedRegion, setSelectedRegion] = useState("全部地区");
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { data } = useSWR("/AIAssistant/user123", getFetcher);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterClick = (type, value) => {
    switch (type) {
      case "region":
        setSelectedRegion(value);
        break;
      case "category":
        setSelectedCategory(value);
        break;
      case "industry":
        setSelectedIndustry(value === selectedIndustry ? null : value);
        break;
      default:
        break;
    }
  };

  return (
    <PageContainer>
      <Container maxWidth="lg">
        <SearchContainer>
          <SearchField
            placeholder="搜索专家名称、专业领域或关键词"
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <FilterListIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </SearchContainer>

        <FilterSection>
          <FilterGroup>
            <FilterTitle>全部地区</FilterTitle>
            <Box>
              {filterData.regions.map((region) => (
                <StyledChip
                  key={region}
                  label={region}
                  variant={selectedRegion === region ? "filled" : "outlined"}
                  onClick={() => handleFilterClick("region", region)}
                  clickable
                />
              ))}
            </Box>
          </FilterGroup>

          <FilterGroup>
            <FilterTitle>业务类型</FilterTitle>
            <Box>
              {filterData.categories.map((category) => (
                <StyledChip
                  key={category}
                  label={category}
                  variant={
                    selectedCategory === category ? "filled" : "outlined"
                  }
                  onClick={() => handleFilterClick("category", category)}
                  clickable
                />
              ))}
            </Box>
          </FilterGroup>

          <FilterGroup>
            <FilterTitle>专业领域</FilterTitle>
            <Box>
              {filterData.industries.map((industry) => (
                <StyledChip
                  key={industry}
                  label={industry}
                  variant={
                    selectedIndustry === industry ? "filled" : "outlined"
                  }
                  onClick={() => handleFilterClick("industry", industry)}
                  clickable
                />
              ))}
            </Box>
          </FilterGroup>
        </FilterSection>

        <Grid container spacing={2}>
          {data?.map((expert) => (
            <Grid item xs={12} sm={6} md={3} key={expert.id}>
              <ExpertCard expert={expert} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </PageContainer>
  );
}

export default ExpertsPage;
