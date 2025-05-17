import express from "express";
import { saveJob, getSavedJobsByUser, removeSavedJob } from "../controllers/savedJob.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/",isAuthenticated, saveJob);                    // Save job
router.get("/:userId",isAuthenticated, getSavedJobsByUser);   // Get all saved jobs for user
router.delete("/:id",isAuthenticated, removeSavedJob);        // Delete saved job by ID

export default router;
