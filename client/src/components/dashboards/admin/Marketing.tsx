import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Grid as MuiGrid } from "@mui/material";
import Box from "@mui/material/Box";

// Create a wrapper component for Grid that works with Material UI v5
const Grid = (props: any) => {
  const { item, ...rest } = props;
  return <MuiGrid {...rest} />;
};
import {
  Email as EmailIcon,
  Notifications as NotificationsIcon,
  Campaign as CampaignIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import axios from "axios";

interface Campaign {
  id: number;
  name: string;
  type: string;
  status: string;
  targetAudience: string;
  startDate: string;
  endDate: string;
  budget: number;
  performance: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    conversionRate: number;
  };
}

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  previewText: string;
  lastModified: string;
  category: string;
}

const Marketing: React.FC = () => {
  const [activeTab, setActiveTab] = useState("campaigns");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "campaigns") {
        const response = await axios.get("/api/admin/marketing/campaigns");
        setCampaigns(response.data);
      } else if (activeTab === "email") {
        const response = await axios.get(
          "/api/admin/marketing/email-templates"
        );
        setEmailTemplates(response.data);
      }
    } catch (error) {
      console.error("Error fetching marketing data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (type: string) => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const renderCampaigns = () => (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">Marketing Campaigns</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog("newCampaign")}
        >
          New Campaign
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Target Audience</TableCell>
              <TableCell>Period</TableCell>
              <TableCell>Budget</TableCell>
              <TableCell>Performance</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell>{campaign.name}</TableCell>
                <TableCell>{campaign.type}</TableCell>
                <TableCell>
                  <Chip
                    label={campaign.status}
                    color={
                      campaign.status === "Active"
                        ? "success"
                        : campaign.status === "Scheduled"
                        ? "info"
                        : campaign.status === "Completed"
                        ? "default"
                        : "warning"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>{campaign.targetAudience}</TableCell>
                <TableCell>
                  {new Date(campaign.startDate).toLocaleDateString()} -{" "}
                  {new Date(campaign.endDate).toLocaleDateString()}
                </TableCell>
                <TableCell>${campaign.budget.toLocaleString()}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">
                      CTR: {campaign.performance.ctr.toFixed(2)}%
                    </Typography>
                    <Typography variant="body2">
                      Conv: {campaign.performance.conversionRate.toFixed(2)}%
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog("editCampaign")}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {campaigns.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No campaigns found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderEmailMarketing = () => (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">Email Templates</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog("newTemplate")}
        >
          New Template
        </Button>
      </Box>

      <Grid container spacing={2}>
        {emailTemplates.map((template) => (
          <Grid xs={12} md={4} lg={4} key={template.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6" component="div">
                    {template.name}
                  </Typography>
                  <Chip label={template.category} size="small" />
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Subject: {template.subject}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Preview: {template.previewText}
                </Typography>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Last modified:{" "}
                  {new Date(template.lastModified).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" startIcon={<EditIcon />}>
                  Edit
                </Button>
                <Button size="small" startIcon={<SendIcon />}>
                  Send Test
                </Button>
                <Button size="small" color="error" startIcon={<DeleteIcon />}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
        {emailTemplates.length === 0 && (
          <Grid xs={12}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography>No email templates found</Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );

  const renderNotifications = () => (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">Push Notifications</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog("newNotification")}
        >
          New Notification
        </Button>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Create and manage push notifications to engage with your users.
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<NotificationsIcon />}
              >
                Send to All Users
              </Button>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<NotificationsIcon />}
              >
                Send to Car Owners
              </Button>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<NotificationsIcon />}
              >
                Send to Customers
              </Button>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<NotificationsIcon />}
              >
                Schedule Notification
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Recent Notifications
        </Typography>
        <List>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <NotificationsIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Summer Discount Announcement"
              secondary="Sent to 1,245 users • 87% open rate • July 5, 2025"
            />
            <Button size="small">View Details</Button>
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <NotificationsIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="New Feature Alert"
              secondary="Sent to 2,103 users • 92% open rate • July 1, 2025"
            />
            <Button size="small">View Details</Button>
          </ListItem>
        </List>
      </Paper>
    </Box>
  );

  return (
    <Box>
      <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
        Marketing & Promotions
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <CampaignIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Campaigns</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Manage marketing campaigns across different channels
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => setActiveTab("campaigns")}>
                  View Campaigns
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <EmailIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Email Marketing</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Create and manage email templates and campaigns
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => setActiveTab("email")}>
                  View Templates
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <NotificationsIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Push Notifications</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Send targeted push notifications to users
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => setActiveTab("notifications")}
                >
                  Manage Notifications
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Paper sx={{ p: 3 }}>
        {activeTab === "campaigns" && renderCampaigns()}
        {activeTab === "email" && renderEmailMarketing()}
        {activeTab === "notifications" && renderNotifications()}
      </Paper>
 
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogType === "newCampaign" && "Create New Campaign"}
          {dialogType === "editCampaign" && "Edit Campaign"}
          {dialogType === "newTemplate" && "Create Email Template"}
          {dialogType === "newNotification" && "Create Push Notification"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {dialogType.includes("Campaign") &&
                "Fill in the details to create a new marketing campaign."}
              {dialogType === "newTemplate" &&
                "Design a new email template for your marketing campaigns."}
              {dialogType === "newNotification" &&
                "Create a new push notification to send to your users."}
            </Typography>
            <Grid container spacing={2}>
              <Grid xs={12}>
                <TextField label="Name" fullWidth variant="outlined" />
              </Grid>

              {dialogType.includes("Campaign") && (
                <>
                  <Grid xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Campaign Type</InputLabel>
                      <Select label="Campaign Type">
                        <MenuItem value="email">Email</MenuItem>
                        <MenuItem value="social">Social Media</MenuItem>
                        <MenuItem value="discount">Discount</MenuItem>
                        <MenuItem value="referral">Referral</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Target Audience</InputLabel>
                      <Select label="Target Audience">
                        <MenuItem value="all">All Users</MenuItem>
                        <MenuItem value="owners">Car Owners</MenuItem>
                        <MenuItem value="customers">Customers</MenuItem>
                        <MenuItem value="inactive">Inactive Users</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              )}

              {dialogType === "newTemplate" && (
                <>
                  <Grid xs={12}>
                    <TextField
                      label="Subject Line"
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid xs={12}>
                    <TextField
                      label="Preview Text"
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                </>
              )}

              {dialogType === "newNotification" && (
                <>
                  <Grid xs={12}>
                    <TextField label="Title" fullWidth variant="outlined" />
                  </Grid>
                  <Grid xs={12}>
                    <TextField
                      label="Message"
                      fullWidth
                      multiline
                      rows={3}
                      variant="outlined"
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleCloseDialog}>
            {dialogType.startsWith("new") ? "Create" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Marketing;
