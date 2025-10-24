import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { join } from 'path';
import { Indexer, ZgFile } from '@0glabs/0g-ts-sdk';
import { ethers } from 'ethers';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // --- Parse incoming form data
    const data = await req.formData();
    const uploadFile = data.get('file') as File;

    if (!uploadFile) {
      return NextResponse.json({ error: 'No file found in request' }, { status: 400 });
    }

    // --- Config values
    const RPC_ENDPOINT = 'https://evmrpc-testnet.0g.ai';
    const STORAGE_INDEXER = process.env.OG_INDEXER_URL;
    const WALLET_SECRET = process.env.OG_WALLET_KEY;

    if (!RPC_ENDPOINT || !STORAGE_INDEXER || !WALLET_SECRET) {
      return NextResponse.json(
        { error: 'Storage configuration missing in environment' },
        { status: 500 }
      );
    }

    // --- Blockchain setup
    const provider = new ethers.JsonRpcProvider(RPC_ENDPOINT);
    const wallet = new ethers.Wallet(WALLET_SECRET, provider);
    const storageIndexer = new Indexer(STORAGE_INDEXER);

    // --- Convert file to buffer
    const fileBytes = Buffer.from(await uploadFile.arrayBuffer());

    // --- Create temporary path
    const tmpDir = '/tmp/uploads';
    await fs.mkdir(tmpDir, { recursive: true });
    const tempFilePath = join(tmpDir, `${Date.now()}-${uploadFile.name}`);
    await fs.writeFile(tempFilePath, fileBytes);

    // --- Generate ZG file
    const zgInstance = await ZgFile.fromFilePath(tempFilePath);
    const [tree, treeError] = await zgInstance.merkleTree();
    if (treeError) throw new Error(`Merkle tree generation failed: ${treeError}`);

    // --- Upload file to 0G network
    const [txHash, uploadError] = await storageIndexer.upload(zgInstance, RPC_ENDPOINT, wallet as any);
    if (uploadError) throw new Error(`Upload failed: ${uploadError}`);

    await zgInstance.close();
    await fs.unlink(tempFilePath).catch(() => {});

    // --- Success response
    return NextResponse.json({
      success: true,
      root: tree?.rootHash() ?? '',
      txHash,
      message: 'File successfully uploaded to 0G network'
    });

  } catch (err) {
    console.error('File upload failed:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unexpected error occurred' },
      { status: 500 }
    );
  }
}
