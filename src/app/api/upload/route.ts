import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * POST /api/upload
 * Accepts a multipart/form-data request with a single "file" field.
 * Only the logged-in admin may upload images. Saves the file to
 * /public/uploads/<uuid>.<ext> and returns its public URL so it can be
 * stored in the Product/Testimonial imageUrl column.
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Only JPG, PNG or WEBP images are allowed" },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "Image must be smaller than 5MB" },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const extension = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
  const fileName = `${randomUUID()}.${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(uploadDir, fileName);

  await writeFile(filePath, buffer);

  return NextResponse.json({ url: `/uploads/${fileName}` });
}
