import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

function safeExt(filename: string) {
    const ext = path.extname(filename).toLowerCase();
    const allowed = new Set([".png", ".jpg", ".jpeg", ".webp"]);
    return allowed.has(ext) ? ext : ".jpg";
}

export async function savePublicUpload(file: File): Promise<string> {
    if (!file || file.size === 0) return "";

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const filename = `${randomUUID()}${safeExt(file.name)}`;
    const fullPath = path.join(uploadsDir, filename);

    const bytes = await file.arrayBuffer();
    await fs.writeFile(fullPath, Buffer.from(bytes));

    return `/uploads/${filename}`;
}
