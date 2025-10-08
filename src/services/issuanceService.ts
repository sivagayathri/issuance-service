import { redis } from "../clients/redisClient.js";
import { supabase } from "../clients/supabaseClient.js";
import os from "os";


const STREAM = process.env.STREAM_NAME || "credential_stream";

let WORKER_ID: string;

async function registerWorker() {
  const id = await redis.incr("worker-counter");
  WORKER_ID = `worker-${id}`;
  console.log(`Registered as ${WORKER_ID}`);
}

await registerWorker(); 


export async function issueCredential(name: string, email: string, credentialid: string) {
  if (!name || !email || !credentialid) throw new Error("Missing fields");

  const { data: existing, error: selErr } = await supabase
    .from("credentials")
    .select("*")
    .eq("credentialid", credentialid)
    .single();

  if (selErr && selErr.code !== "PGRST116") throw selErr;
  if (existing) return { message: "Credential already issued", worker: WORKER_ID };

  const issuedAt = new Date().toISOString();

  const { error: insertError } = await supabase.from("credentials").insert([{
    name, email, credentialid, issuedat: issuedAt, worker: WORKER_ID
  }]);
  if (insertError) throw insertError;

  const streamId = await redis.xadd(
    STREAM,
    "*",
    "credentialid", credentialid,
    "name", name,
    "email", email,
    "issuedat", issuedAt,
    "worker", WORKER_ID
  );

  await redis.set(`cred:${credentialid}`, JSON.stringify({ name, email, credentialid, issuedat: issuedAt, worker: WORKER_ID }));

  return { message: `Credential issued by ${WORKER_ID}`, streamId };
}
