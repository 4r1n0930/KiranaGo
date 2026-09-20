import { Router, Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import { importFromCSV } from './csvImport';

const upload = multer({ dest: '/tmp' });
const router = Router();

router.post(
  '/import/inventory',
  upload.single('file'),
  async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      res.status(400).json({ error: 'No file attached. Please attach a CSV file with field name "file".' });
      return;
    }

    const filePath = req.file.path;

    try {
      const result = await importFromCSV(filePath);
      res.status(200).json(result);
    } catch (error: any) {
      console.error('[ImportRouter] Error processing CSV import:', error);
      res.status(500).json({
        error: 'Failed to process CSV file',
        details: error.message
      });
    } finally {
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (unlinkErr) {
          console.error('[ImportRouter] Failed to delete temporary file:', unlinkErr);
        }
      }
    }
  }
);

export default router;
