import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { Indexer } from "@0glabs/0g-ts-sdk";

export const dynamic = "force-dynamic";

export async function GET(
    _req: NextRequest,
    context: { params: Promise<{ hash: string }> }
) {
    try {
        const { hash } = await context.params;

        if (!hash) {
            return NextResponse.json({ error: "Missing file hash" }, { status: 400 });
        }

        const STORAGE_INDEXER = process.env.OG_INDEXER_URL;

        const indexer = new Indexer(STORAGE_INDEXER);

        const tmpDir = "/tmp/uploads";
        const filePath = join(tmpDir, `${hash}.data`);

        const fs = await import("fs");
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
        }

        const err = await indexer.download(hash, filePath, true);
        if (err !== null) throw new Error(`Download error: ${err}`);

        const buffer = fs.readFileSync(filePath);
        fs.unlinkSync(filePath);

        return new NextResponse(buffer, {
            headers: {
                "Content-Type": "application/octet-stream",
                "Content-Disposition": `attachment; filename="${hash}.data"`,
            },
        });
    } catch (error) {
        console.error("Retrieve route error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
