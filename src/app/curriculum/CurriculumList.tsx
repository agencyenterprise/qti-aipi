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
  Stack,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { curriculumService } from '@/lib/api/services';
import type { QTICurriculum } from '@/types/qti';
import { useCurriculumStore } from '@/store';

export default function CurriculumList() {
  const router = useRouter();
  const { setCurricula } = useCurriculumStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [localCurricula, setLocalCurricula] = useState<QTICurriculum[]>([]);

  const fetchCurricula = async () => {
    try {
      setLoading(true);
      const response = await curriculumService.getAll({
        page,
        limit: 9,
      });
      setLocalCurricula(response.data.items);
      setCurricula(response.data.items);
      setTotalPages(response.data.pages);
    } catch (err) {
      setError('Failed to load curricula');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurricula();
  }, [page]);

  const handleDelete = async (identifier: string) => {
    if (window.confirm('Are you sure you want to delete this curriculum?')) {
      try {
        await curriculumService.delete(identifier);
        fetchCurricula();
      } catch (err) {
        setError('Failed to delete curriculum');
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
        placeholder="Search curricula..."
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
        {localCurricula.map((curriculum) => (
          <Grid item xs={12} sm={6} md={4} key={curriculum.identifier}>
            <Card>
              <CardContent>
                <Typography variant="h6" noWrap>
                  {curriculum.title}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Chip
                    icon={<SchoolIcon />}
                    label={curriculum.subject}
                    size="small"
                  />
                  <Chip
                    label={curriculum.gradeLevel}
                    size="small"
                  />
                </Stack>
                {curriculum.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {curriculum.description}
                  </Typography>
                )}
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton
                    size="small"
                    onClick={() => router.push(`/curriculum/${curriculum.identifier}/edit`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(curriculum.identifier)}
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