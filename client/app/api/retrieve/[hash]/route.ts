import { NextRequest, NextResponse } from 'next/server';
import { Indexer } from '@0glabs/0g-ts-sdk';
import { join } from 'path';

export async function GET(
  _req: NextRequest,
  { params }: { params: { hash: string } }
) {
  const { hash } = params;

  try {
  const STORAGE_INDEXER = process.env.OG_INDEXER_URL;
    if (!STORAGE_INDEXER) throw new Error('Missing STORAGE_INDEXER rpc');

    const indexer = new Indexer(STORAGE_INDEXER);
    const fs = await import('fs');

    const tempDir = '/tmp/uploads';
    const filePath = join(tempDir, `${hash}.bin`);

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Download file from indexer
    const result = await indexer.download(hash, filePath, true);
    if (result) throw new Error(`Download failed: ${result}`);

    // Read into memory
    const data = fs.readFileSync(filePath);
    fs.unlinkSync(filePath); 

    const headers = {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${hash}.bin"`,
    };

    return new NextResponse(data, { headers });

  } catch (err) {
    console.error('❌ Retrieval failed:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
