import { Router } from "express";
import { issueCredential } from "../services/issuanceService.js";

const router = Router();

router.post("/issue", async (req, res) => {
  try {
    const { name, email, credentialid } = req.body;
    const result = await issueCredential(name, email, credentialid);
    res.json(result);
  } catch (err: any) {
    console.error("issue error:", err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

export default router;
