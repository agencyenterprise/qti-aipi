'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Pagination,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { assessmentItemService } from '@/lib/api/services';
import type { QTIAssessmentItem } from '@/types/qti';
import { useItemBankStore } from '@/store';

export default function ItemList() {
  const router = useRouter();
  const { setItems } = useItemBankStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [localItems, setLocalItems] = useState<QTIAssessmentItem[]>([]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await assessmentItemService.getAll({
        page,
        limit: 12,
        search: searchQuery,
      });
      setLocalItems(response.data.items);
      setItems(response.data.items);
      setTotalPages(response.data.pages);
    } catch (err) {
      setError('Failed to load assessment items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [page, searchQuery]);

  const handleDelete = async (identifier: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await assessmentItemService.delete(identifier);
        fetchItems();
      } catch (err) {
        setError('Failed to delete item');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search items..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Grid container spacing={3}>
        {localItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.identifier}>
            <Card>
              <CardContent>
                <Typography variant="h6" noWrap>
                  {item.title}
                </Typography>
                <Chip
                  label={item.type}
                  size="small"
                  sx={{ mt: 1 }}
                />
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton
                    size="small"
                    onClick={() => router.push(`/item-bank/${item.identifier}/edit`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(item.identifier)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
} 