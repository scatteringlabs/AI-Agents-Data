import {
  ClusterFilter,
  Context,
  generateSigner,
  keypairIdentity,
  Program,
  publicKey,
  PublicKey,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import fs from "fs";
import { mplCore } from "@metaplex-foundation/mpl-core";
import {
  string,
  publicKey as publicKeySerializer,
} from "@metaplex-foundation/umi/serializers";
import { mplHybrid } from "./plugin";
import {
  captureV1,
  fetchEscrowV1,
  initEscrowV1,
  initNftDataV1,
  MPL_HYBRID_PROGRAM_ID,
  releaseV1,
  updateEscrowV1,
} from "./generated";
import {
  createFungible,
  mintV1,
  mplTokenMetadata,
  TokenStandard,
  transferV1,
} from "@metaplex-foundation/mpl-token-metadata";
import bs58 from "bs58";

async function main() {
  // Import your private key file and parse it.
  const wallet = "/Users/vincent/.config/solana/id.json";
  const secretKey = JSON.parse(fs.readFileSync(wallet, "utf-8"));
  //console.log(secretKey)
  const umi = createUmi(
    "https://mainnet.helius-rpc.com/?api-key=c6323c63-ef25-4c90-acd3-3a81fb798c45",
  );
  // Create a keypair from your private key
  const keypair = umi.eddsa.createKeypairFromSecretKey(
    new Uint8Array(secretKey),
  );

  let collection = publicKey("AQJuBg4ns9p8QyJUWxStKfFV6AzVgN3YmWZvdLh18WNd");
  let feeLocation = publicKey("72SebYpPzemzf4h7g52dgCc4awKgmHnoRmn8PLpP8MaK");
  let assets = publicKey("CKnGht4Jp4o5g2qi2hwvERPWCjVwRuG3BNiag7ovHj98");
  // mint assets
  let tokenMintAddr = publicKey("3G32TcqRWzUZZLTSmWiP43EeM91RJgXnmtCS4udtfWUv");
  // Register it to the Umi client.
  umi.use(keypairIdentity(keypair));
  umi.use(mplHybrid());
  umi.use(mplTokenMetadata());
  umi.use(mplCore());

  // const tokenMint = generateSigner(umi);
  // 创建同质化资产
  // let cTx=await createFungible(umi, {
  //     name: 'Scattering Token',
  //     symbol: 'SCR',
  //     uri: '"https://shdw-drive.genesysgo.net/9hUCJxvayARBsHHe17dhNbrHV2YEWy7a3je6NUKv4Qv1/hack_metadata.json"',
  //     sellerFeeBasisPoints: {
  //         basisPoints: BigInt(0),
  //         identifier: '%',
  //         decimals: 2,
  //     },
  //     decimals:9,
  //     isMutable:true,
  //     mint: tokenMint,
  // }).sendAndConfirm(umi);
  // console.log("createFungible:",bs58.encode(cTx.signature))

  // let mintTx=await mintV1(umi, {
  //     mint: tokenMintAddr,
  //     tokenStandard: TokenStandard.Fungible,
  //     tokenOwner: publicKey('66uisZTcV1nSb9kbHFSj45Mpo43GioLy1d2NVnhwkVpw'),
  //     amount: BigInt(1e9*1e5),
  // }).sendAndConfirm(umi);
  // console.log("mintTx:",bs58.encode(mintTx.signature))
  // return

  const escrow = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
    string({ size: "variable" }).serialize("escrow"),
    publicKeySerializer().serialize(collection),
  ]);
  console.log("escrow:", escrow["0"]);
  // let initEscrowV1Tx=await initEscrowV1(umi, {
  //     escrow,
  //     collection: collection,
  //     token: tokenMintAddr,
  //     feeLocation: feeLocation,
  //     name: 'Test Escrow',
  //     uri: 'https://shdw-drive.genesysgo.net/EnT7faUnVhZA2G3Nyf9QcJSiVYhgaSXSt6C6ZCa7Rtt7/',
  //     max: 100,
  //     min: 0,
  //     amount: BigInt(1e9*10), // 1 个 nft 需要 10个token
  //     feeAmount: BigInt(1e9), // 1个nft 抽取1 ft作为手续费
  //     path: 0,
  //     solFeeAmount: BigInt(1), // 收取1e-9
  // }).sendAndConfirm(umi);
  // console.log("initEscrowV1Tx:",bs58.encode(initEscrowV1Tx.signature))

  let updateEscrowV1Tx = await updateEscrowV1(umi, {
    escrow,
    collection: collection,
    token: tokenMintAddr,
    feeLocation: feeLocation,
    name: "Test Escrow",
    uri: "https://shdw-drive.genesysgo.net/EnT7faUnVhZA2G3Nyf9QcJSiVYhgaSXSt6C6ZCa7Rtt7/",
    max: 100,
    min: 0,
    amount: BigInt(1e9 * 10), // 1 NFT requires 10 tokens
    feeAmount: BigInt(1e9), // 1 NFT charges 1 FT as fee
    path: 0,
    solFeeAmount: BigInt(0),
  }).sendAndConfirm(umi);
  console.log("updateEscrowV1Tx:", bs58.encode(updateEscrowV1Tx.signature));

  const escrowData = await fetchEscrowV1(umi, escrow);
  console.log(escrowData);

  let captureV1Tx = await captureV1(umi, {
    owner: umi.identity,
    escrow: escrow,
    asset: assets,
    collection: collection,
    token: tokenMintAddr,
    feeProjectAccount: escrowData.feeLocation,
  }).sendAndConfirm(umi);
  console.log(bs58.encode(captureV1Tx.signature));

  // let releaseV1Tx=await releaseV1(umi, {
  //     owner: umi.identity,
  //     escrow: escrow,
  //     asset: assets,
  //     collection: collection,
  //     token: tokenMintAddr,
  //     feeProjectAccount: escrowData.feeLocation,
  // }).sendAndConfirm(umi)
  // console.log(bs58.encode(releaseV1Tx.signature))

  // const nftData = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
  //     string({ size: 'variable' }).serialize('nft'),
  //     publicKeySerializer().serialize(assets),
  // ]);
  // let initNftDataV1Tx=await initNftDataV1(umi,{
  //     asset:assets,
  //     nftData: nftData,
  //     name: "",
  //     path: 0,
  //     amount: BigInt(1e9*10),
  //     feeAmount: BigInt(1e9),
  //     solFeeAmount: BigInt(0),
  //     max: 100,
  //     min: 0,
  //     uri: "",
  //     collection:collection,
  //     token:tokenMintAddr,
  //     feeLocation:escrowData.feeLocation
  // }).sendAndConfirm(umi)
  // console.log("initNftDataV1Tx:",bs58.encode(initNftDataV1Tx.signature))
}

main().catch((err) => {
  console.error(err);
});
