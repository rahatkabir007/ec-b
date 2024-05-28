import * as fs from 'fs';
import * as path from 'path';

export function convertFileToURL(file): string {
    const fileName = file.originalname;
    const dirPath = path.join(__dirname, '..', 'uploads');
    const filePath = path.join(dirPath, fileName);

    // Ensure the directory exists
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(filePath, file.buffer);
    return `${process.env.API_URL}/uploads/${fileName}`;
}