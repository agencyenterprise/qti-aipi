import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';
import JSZip from 'jszip';
import { QTIPackage, QTIItem } from '../types';

export const QTIPackageManager: React.FC = () => {
  const [packages, setPackages] = useState<QTIPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<QTIPackage | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<QTIItem | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const zip = new JSZip();
      const contents = await zip.loadAsync(file);
      
      // Process QTI package
      const newPackage: QTIPackage = {
        id: crypto.randomUUID(),
        name: file.name.replace('.zip', ''),
        uploadDate: new Date(),
        items: []
      };

      // Extract QTI items from the zip
      for (const [path, zipEntry] of Object.entries(contents.files)) {
        if (path.endsWith('.xml')) {
          const content = await zipEntry.async('text');
          // Here you would parse the XML content and create QTI items
          // This is a simplified version
          newPackage.items.push({
            id: crypto.randomUUID(),
            title: path.split('/').pop()?.replace('.xml', '') || '',
            type: 'multiple-choice',
            content: content
          });
        }
      }

      setPackages(prev => [...prev, newPackage]);
    } catch (error) {
      console.error('Error processing QTI package:', error);
      alert('Error processing QTI package');
    }
  };

  const handleDeletePackage = (packageId: string) => {
    setPackages(prev => prev.filter(p => p.id !== packageId));
  };

  const handleEditItem = (item: QTIItem) => {
    setEditItem(item);
    setEditDialogOpen(true);
  };

  const handleSaveItem = () => {
    if (!editItem || !selectedPackage) return;

    setPackages(prev => prev.map(p => {
      if (p.id === selectedPackage.id) {
        return {
          ...p,
          items: p.items.map(item => 
            item.id === editItem.id ? editItem : item
          )
        };
      }
      return p;
    }));

    setEditDialogOpen(false);
    setEditItem(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        QTI Package Manager
      </Typography>

      <Button
        variant="contained"
        component="label"
        startIcon={<Add />}
        sx={{ mb: 3 }}
      >
        Upload QTI Package
        <input
          type="file"
          hidden
          accept=".zip"
          onChange={handleFileUpload}
        />
      </Button>

      <Box display="flex" gap={2}>
        <Paper sx={{ width: 300, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Packages
          </Typography>
          <List>
            {packages.map(pkg => (
              <ListItem
                key={pkg.id}
                secondaryAction={
                  <IconButton 
                    edge="end" 
                    onClick={() => handleDeletePackage(pkg.id)}
                  >
                    <Delete />
                  </IconButton>
                }
                onClick={() => setSelectedPackage(pkg)}
                sx={{ cursor: 'pointer' }}
              >
                <ListItemText 
                  primary={pkg.name}
                  secondary={pkg.uploadDate.toLocaleDateString()}
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        {selectedPackage && (
          <Paper sx={{ flex: 1, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Items in {selectedPackage.name}
            </Typography>
            <List>
              {selectedPackage.items.map(item => (
                <ListItem
                  key={item.id}
                  secondaryAction={
                    <IconButton 
                      edge="end" 
                      onClick={() => handleEditItem(item)}
                    >
                      <Edit />
                    </IconButton>
                  }
                >
                  <ListItemText 
                    primary={item.title}
                    secondary={`Type: ${item.type}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Box>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          {editItem && (
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="Title"
                value={editItem.title}
                onChange={e => setEditItem({ ...editItem, title: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Content"
                value={editItem.content}
                onChange={e => setEditItem({ ...editItem, content: e.target.value })}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveItem} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 