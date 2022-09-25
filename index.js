// Import Solana web3 functionalities
const {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmRawTransaction,
  sendAndConfirmTransaction
} = require("@solana/web3.js");

//Generated a new Key Pair to extract Secret Key

/*
const newPair = Keypair.generate();
console.log(newPair);*/


//Replaced Secret Key from demo video with the Secret Key from the newly generated Key Pair
const EXAMPLE_FROM_SECRET_KEY = new Uint8Array(
  [
      150, 21,  110, 200, 130, 10, 161, 156,  166, 149, 167,
      123,  79,  22, 174, 91, 159,  27, 96,  11,  27,  154,
      212,  145,  28, 78, 129,  14,  93, 45, 98, 145,  43,
     123, 235, 148, 134, 189, 68, 111, 222, 67,  128,  138,
     121, 217,  285,  43, 165, 92, 98, 167,  190, 29, 106,
      100,  73, 142,  95, 34,  158, 201,  176, 129
    ]
    
);

const transferSol = async() => {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // Get Keypair from Secret Key
  var from = Keypair.fromSecretKey(EXAMPLE_FROM_SECRET_KEY);

  // Other things to try: 
  // 1) Form array from userSecretKey
  // const from = Keypair.fromSecretKey(Uint8Array.from(userSecretKey));
  // 2) Make a new Keypair (starts with 0 SOL)
  // const from = Keypair.generate();

  // Generate another Keypair (account we'll be sending to)
  const to = Keypair.generate();

  // Aidrop 2 SOL to Sender wallet
  console.log("Airdopping 2 SOL to Sender wallet!");
  const fromAirDropSignature = await connection.requestAirdrop(
      new PublicKey(from.publicKey),
      2 * LAMPORTS_PER_SOL
  );

  // Latest blockhash (unique identifer of the block) of the cluster
  let latestBlockHash = await connection.getLatestBlockhash();

  // Confirm transaction using the last valid block height (refers to its time)
  // to check for transaction expiration
  await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: fromAirDropSignature
  });

  console.log("Airdrop completed for the Sender account");

  let fromBalance = await connection.getBalance(from.publicKey);
  let lamportFromBalance = fromBalance / LAMPORTS_PER_SOL;
  console.log('from wallet balance: ', lamportFromBalance);

  // Send 50%
  const HalfTransfer = lamportFromBalance / 2;
  console.log('token to transfer: ', HalfTransfer);

  let toBalance = await connection.getBalance(to.publicKey);
  let lamportToBalance = toBalance / LAMPORTS_PER_SOL;
  console.log('to wallet Balance: ', lamportToBalance);

  // Send money from "from" wallet and into "to" wallet
  var transaction = new Transaction().add(
      SystemProgram.transfer({
          fromPubkey: from.publicKey,
          toPubkey: to.publicKey,
          lamports: parseFloat(HalfTransfer) * LAMPORTS_PER_SOL
      })
  );

  // Sign transaction
  var signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [from]
);

  toBalance = await connection.getBalance(to.publicKey);
  lamportToBalance = toBalance / LAMPORTS_PER_SOL;
  console.log("to wallet balance: ", lamportToBalance);
  console.log('Signature is ', signature);
}
transferSol();