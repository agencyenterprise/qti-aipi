import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import Navigation from '@/components/Navigation';
import ItemList from './ItemList';

export default function ItemBankPage() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Navigation />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          pt: { xs: 8, sm: 9 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
            <Grid item xs>
              <Typography variant="h4" component="h1">
                Item Bank
              </Typography>
              <Typography variant="subtitle1" sx={{ mt: 1 }}>
                Manage your QTI assessment items
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                href="/item-bank/create"
              >
                Create Item
              </Button>
            </Grid>
          </Grid>

          <ItemList />
        </Container>
      </Box>
    </Box>
  );
} 